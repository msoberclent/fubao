import { Asset, Component, _decorator, log } from "cc";
import { DEBUG } from "cc/env";
import { BaseEvent } from "../BaseKit/Constant/BaseEvent";
import { EventData } from "../BaseKit/Data/SocketEventData";
import { LogUtils } from "../BaseKit/Util/LogUtils";
import Global from "../PiterGlobal";
import { ReconnectComponent } from "./ReconnectComponent";
const { ccclass, property } = _decorator;
@ccclass("SocketManager")
export default class SocketManager extends Component {
    private m_callbackList: Map<number, Function> = new Map<number, Function>();
    private m_callbackName: Map<number, string> = new Map<number, string>();
    private m_callbackList1: Map<number, Function> = new Map<number, Function>();
    private m_sequence: number = 1;
    public socket: WebSocket;

    @property({ type: Asset })
    public wssCacert: Asset = null!;


    /**
     * 目标服务器地址
     */
    public socketUrl: string;
    /**
        * WebSocket发送和接收数据类型
        */
    private m_type;
    private m_lastHeartbeatTime: number;

    /**
        * WebSocket连接状态
        */
    private m_state: WebSocketStateEnum = WebSocketStateEnum.CLOSED;

    /**
        * 心跳定时器
        */
    private m_heartbeatInterval;

    public token: string;

    public connecting: boolean = false;

    public fliterMsg: string[] = ["HEART_BEAT", "NOTIFY_MARQUEE_ARRIVED"];

    public reconnectComp: ReconnectComponent;

    public isDingHao: boolean = false;
    start() {
        Global.SOCKET = this;
        this.reconnectComp = this.node.addComponent(ReconnectComponent);
    }

    public addFilterMsg(name: string) {
        if (this.fliterMsg.indexOf(name) == -1) {
            this.fliterMsg.push(name);
        }
    }

    private onSocketConnect(data: SocketEventData): void {
        LogUtils.logD("onSocketConnect");
        this.m_state = WebSocketStateEnum.CONNECTED;
        this.m_lastHeartbeatTime = Date.now();
        this.startHeartbeat();
        if (this.connecting) {
            Global.EVENT.dispatchEvent(BaseEvent.SOCKET_RECONNECT);
            this.connecting = false;
        } else {
            Global.EVENT.dispatchEvent(BaseEvent.SOCKET_CONNECT);
        }
        if (this.reconnectComp) {
            this.reconnectComp.stopReconnect();
        }
    }

    private startHeartbeat() {
        this.m_heartbeatInterval = setInterval(() => {
            if (this.m_state != WebSocketStateEnum.CONNECTED) {
                clearInterval(this.m_heartbeatInterval);
                this.m_heartbeatInterval = null;
                return;
            }
            if (Date.now() - this.m_lastHeartbeatTime >= 10000) {
                this.sendHeartbeat();
            }
        }, 10000);
    }

    /**
    * 发送数据带回调
    * @param  {} data
    * @param  {Callback} callback
    */
    public sendDataBySequece(data, callback: Function) {
        data.sequence = this.getSequence();
        if (callback) {
            this.m_callbackList1.set(data.sequence, callback);
        }
        if (this.token) {
            data.token = this.token;
        }
        this.sendData(data);
    }

    /**
     * 异步发送数据
     * @param  {} data
     */
    public sendSequeceAsync(reqData): Promise<any> {
        return new Promise((rs, rj) => {
            if (!reqData.code) { reqData.code = "BUSINESS" }
            if (!reqData.request) { reqData.request = { params: {} } }
            reqData.sequence = this.getSequence();
            this.m_callbackList1.set(reqData.sequence, (resp: any) => {
                rs(resp);
            });
            this.m_callbackName.set(reqData.sequence, reqData.cmd);
            if (this.token) {
                // reqData.token = this.token;
            }
            if (typeof (reqData) != "string" && reqData != "hb") {
                LogUtils.logD(`发送数据:---${reqData.subCode}--- %j=`, reqData);
            }
            this.sendData(reqData);
        });
    }


    public sendSequeceAsyncSubCode(subCode: string, params = {}): Promise<any> {
        let reqData = {
            subCode: subCode,
            request: {
                params: params
            }
        }
        return this.sendSequeceAsync(reqData);
    }

    public sendDataBinary(data): void {
        if (typeof (data) != "string") {
            data = JSON.stringify(data);
        }
        this.socket.send(this.string2ArrayBuffer(data.trim()))
    }

    private sendDataUTF(data): void {
        data = JSON.stringify(data);
        this.socket.send(data);
    }

    public async request(cmd, data, route = "default") {
        let reqData = {
            cmd: cmd,
            data: data,
            route: route,
        }
        return await this.sendSequeceAsync(reqData)
    }

    /**
         * 发送数据
         * @param  {egret.ByteArray} data
         */
    public sendData(data): void {
        if (this.state == WebSocketStateEnum.CLOSED || this.state == WebSocketStateEnum.ERROR_CLOSED) {
            // DefaultAlertView.addOnlyAlert("与服务器的连接已经断开", () => {
            this.scheduleOnce(() => {
                this.reConnect();
            })
            // })
            return;
        }
        // if (this.m_type == WebSocketTypeEnum.TYPE_BINARY) {
        //     this.sendDataBinary(data);
        // } else {
        this.sendDataUTF(data);
        // }
        this.m_lastHeartbeatTime = Date.now();
        // this.m_webSocket.writeBytes(data);
    }

    public sendHeartbeat() {
        let data = {
            code: "HEART_BEAT",
            sequence: 0
        };
        this.sendData(data);
    }

    /**
     * 获取一个序列号
     */
    private getSequence() {
        if (this.m_sequence >= 1000) {
            this.m_sequence = 1;
            return this.m_sequence;
        }
        return this.m_sequence++;
    }


    private onSocketData(event): void {
        let jsonStr = event.data;
        let jsonData;
        if (jsonStr) {
            jsonData = JSON.parse(jsonStr);
        } else {
            return;
        }
        if (DEBUG) {
            if (this.fliterMsg.indexOf(jsonData.subCode) == -1) {
                if (jsonData.sequence) {
                    console.log(Date.now() + " 收到请求返回: --" + jsonData.subCode + "-- %j=", JSON.parse(jsonStr))
                } else {
                    console.log(Date.now() + " 收到推送: " + jsonData.subCode + " %j=", JSON.parse(jsonStr))
                }

            }
        }
        if (jsonData.code == "BUSINESS") {
            if (jsonData.sequence) {
                let callback1 = this.m_callbackList1.get(jsonData.sequence);
                if (callback1) {
                    callback1(jsonData);
                    this.m_callbackList1.delete(jsonData.sequence);
                    return;
                }
                var callback: Function = this.m_callbackList.get(jsonData.sequence);
                if (callback) {
                    callback(jsonData);
                    this.m_callbackList.delete(jsonData.sequence);
                }
            } else {
                Global.EVENT.dispatchEvent(jsonData.subCode, jsonData.response)
            }
        }
        // //被人顶号 todo
        // if (jsonData.code == 501) {
        //     this.socket.close();
        // }
    }

    private onSocketIOError(data: SocketEventData): void {
        this.m_state = WebSocketStateEnum.ERROR_CLOSED;
        this.scheduleOnce(() => {
            this.reConnect();
        })
        log("onSocketIOError");
    }

    public onSocketClose(data: SocketEventData): void {
        log("onSocketClose1" + this.m_state);
        if (this.m_state == WebSocketStateEnum.CLOSED || this.m_state == WebSocketStateEnum.ERROR_CLOSED) {
            return;
        }
        log("onSocketClose2");
        this.m_state = WebSocketStateEnum.CLOSED;
        if (this.isDingHao) {
            this.isDingHao = false;
            return;
        }
        // log("onSocketClose3");
        // if (BaseConstant.RUNING_BACK) {
        //     //     //弹出提示框
        //     this.reconnectComp.stopReconnect();
        //     DefaultAlertView.addOnlyAlert("与服务器的连接已经断开", () => {
        //         this.reConnect();
        //     })
        // } else {

        // }
        log("onSocketClose4");
        this.reconnectComp.stopReconnect();
        this.scheduleOnce(() => {
            this.reConnect();
        })
    }

    public disConnectAndReconnect() {
        if (this.m_state != WebSocketStateEnum.CLOSED) {
            this.m_state = WebSocketStateEnum.CLOSED;
            this.socket.close();
            this.reConnect()
        }
    }


    /**
    * 主动出发断线
    */
    public disConnect(autoRect: boolean = true) {
        LogUtils.logD("type1 dx");
        if (this.m_state != WebSocketStateEnum.CLOSED) {
            this.m_state = WebSocketStateEnum.CLOSED;
            this.socket.close();
            if (autoRect) {
                this.reConnect();
            }
        }
    }


    /**
     * 重连
     */
    public reConnect() {
        if (this.m_state == WebSocketStateEnum.CONNECTED) {
            return;
        }
        LogUtils.logD("type6 dianxian");
        this.reconnectComp.startReconnect();
        // if (!BaseConstant.RUNING_BACK && this.m_state == WebSocketStateEnum.CLOSED) {
        // } else {
        //     DefaultAlertView.addOnlyAlert("与服务器断开连接", () => {
        //         this.m_state = WebSocketStateEnum.CONNECTING;
        //         this.reconnectComp.startReconnect();
        //     })
        //     this.m_state = WebSocketStateEnum.CLOSED;
        // }
    }


    recenterServer() {

    }

    /**
        * 断开与服务器的连接
        */
    public close(): void {
        this.socket.close();
        this.m_state = WebSocketStateEnum.CLOSED;
    }
    /**
     * 获取当前链接状态
     */
    public get state(): WebSocketStateEnum {
        return this.m_state;
    }

    public createSocket(socketUrl): void {
        let socket = new WebSocket(socketUrl);
        socket.onclose = this.onSocketClose.bind(this);
        socket.onopen = this.onSocketConnect.bind(this);
        socket.onmessage = this.onSocketData.bind(this);
        socket.onerror = this.onSocketIOError.bind(this);
        this.socket = socket;
        this.m_type = WebSocketTypeEnum.TYPE_BINARY;
    }

    public connect(url: string): void {
        this.m_state = WebSocketStateEnum.CONNECTING;
        this.socketUrl = url;
        if (this.socket) {
            this.socket.close();
            this.isDingHao = true;
            this.socket = null;
        }
        this.createSocket(url)
    }

    public string2ArrayBuffer(str: string) {
        let buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
        let bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}

/**
 * TYPE_STRING 以字符串格式发送和接收数据
 * TYPE_BINARY 以二进制格式发送和接收数据
 */
export enum WebSocketTypeEnum {
    TYPE_STRING,
    TYPE_BINARY
}

/**
    * CONNECTING   正在尝试连接服务器
    * CONNECTED    已成功连接服务器 
    * CLOSING      正在断开服务器连接
    * CLOSED       已断开与服务器连接
    */
export enum WebSocketStateEnum {
    CONNECTING,
    CONNECTED,
    CLOSED,
    ERROR_CLOSED
}

/**
 * 本类为webSocket事件数据类
 */
export class SocketEventData extends EventData {

    public constructor(messageID: string, messageData) {
        super(messageID, messageData);
    }
}