
import { Component, _decorator, game, log, sys } from 'cc';
import { NotifyConst } from '../../Scripts/game/constant/NotifyConst';
import { GameLoginView } from '../../Scripts/game/view/login/GameLoginView';
import { WebGameUtils } from '../../Scripts/webutils/WebGameUtils';
import { BaseEvent } from '../BaseKit/Constant/BaseEvent';
import { LocalStorageData } from '../BaseKit/Data/LocalStorageData';
import { LogUtils } from '../BaseKit/Util/LogUtils';
import Global from '../PiterGlobal';
import { DefaultAlertView } from '../UIKit/Example/DefaultAlertView';
import NetLoadingView from './NetLoadingView';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * 重连组件
 */

@ccclass('ReconnectComponent')
export class ReconnectComponent extends Component {
    //5次计数如果没有打开则弹开面板
    private count: number = 0;
    public isRunning: boolean = false;
    public lockReconnect: boolean = false;
    public onLoad() {
        Global.EVENT.on(BaseEvent.SOCKET_RECONNECT, this.reconnectSuccess, this);
        Global.EVENT.on(NotifyConst.NOTIFY_NOT_AUTH, this.onNotAuth, this);
        // Global.EVENT.on(NotifyConst.NOTIFY_ONLINE, this.reconnectSuccess, this);
    }

    public onNotAuth(data) {
        if (data.errorCode == -5) {
            Global.SOCKET.isDingHao = true;
            this.stopReconnect();
            DefaultAlertView.addOnlyAlert("游戏链接已经失效,请重新登陆", () => {
                Global.UI.closeAllView();
                this.lockReconnect = false;
                // LocalStorageData.removeItem("user_token");
                if (WebGameUtils.GID) {
                    WebGameUtils.flushWindow();
                } else {
                    Global.UI.openView(GameLoginView, { reload: false });
                }
            });
            return;
        }
        this.lockReconnect = true;
        this.scheduleOnce(() => {
            this.lockReconnect = false;
        }, 5)
        this.stopReconnect();
        // Global.SOCKET.disConnect(false);

        Global.SOCKET.isDingHao = true;
        let str = data.msg || "登录太频繁,请稍后登录";
        DefaultAlertView.addOnlyAlert(str, () => {
            if (data.errorCode == -8) {
                LocalStorageData.removeItem("user_token");
                Global.PLAYER.clearPlayerData();
                if (sys.isNative) {
                    game.restart();
                } else {
                    WebGameUtils.flushWindow();
                }
            }
            Global.UI.closeAllView();
            this.lockReconnect = false;
            Global.UI.openView(GameLoginView, { reload: false });
        })

    }

    public stopReconnect() {
        if (this.isRunning) {
            this.count = 0
            this.isRunning = false;
            NetLoadingView.instance.hide(`stopReconnect`);
            this.unschedule(this.connectServer);
        }
    }

    private connectServer() {
        if (!this.isRunning) {
            this.unschedule(this.connectServer);
            NetLoadingView.instance.hide(`connectServer`);
            return;
        }
        if (this.count <= 0) {
            log("重连不上了")
            NetLoadingView.instance.hide(`connectServer2`);
            this.unschedule(this.connectServer);
            this.showReconnectFailTips();
            return;
        }
        this.connect();
    }

    public startReconnect() {
        if (this.isRunning || this.lockReconnect) {
            return;
        }
        this.isRunning = true;
        this.count = 3
        this.unschedule(this.connectServer);
        NetLoadingView.instance.show(`startReconnect`);
        this.connectServer();
        this.schedule(this.connectServer, 2, 3);
    }

    public reconnectSuccess() {
        LogUtils.logD("重连成功");
        NetLoadingView.instance.hide(`reconnectSuccess`);
        this.isRunning = false
        this.unschedule(this.connectServer);
    }

    private async connect() {
        if (this.lockReconnect) {
            return;
        }
        log("尝试重连");
        this.count--;
        Global.SOCKET.connecting = true
        Global.SOCKET.connect(Global.SOCKET.socketUrl);
        // let suc = await Global.SOCKET. .instance.initServer(PomeloManager.instance.param);
        // if (!suc) {
        //     return;
        // }
        // let resp: any = await PomeloManager.instance.request('connector.entryHandler.c_connect', {
        //     token: H5Global.playerManager.token,
        // });
        // if (resp && !resp.error) {
        //     resp.error = {};
        //     resp.error.code = 0;
        // }
        // if (resp) {
        //     if (resp.error && resp.error.code != 0) {
        //         return;
        //     }
        //     this.isRunning = false
        //     LogUtils.logD("重连成功");
        //     PomeloManager.instance.state = PomeloStateEnum.CONNECT;
        //     H5Global.hideNetLoading();
        //     H5Global.sendNotification(ClientEvent.ReconnectSuccess);
        // }
    }

    /**
     * 重新连接失败
     */
    public showReconnectFailTips() {
        DefaultAlertView.addOnlyAlert("连接服务器失败,请重新登录", () => {
            Global.UI.closeAllView();
            // LocalStorageData.removeItem("user_token");
            Global.UI.openView(GameLoginView, { reload: false });
        })
    }
}
