
import { Component, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { DateTimeManager } from '../BaseKit/Manager/DateTimeManager';
import { LogUtils } from '../BaseKit/Util/LogUtils';
import Global from '../PiterGlobal';
import NetLoadingView from './NetLoadingView';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = HttpManager
 * DateTime = Mon Oct 18 2021 13:40:20 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * Http请求
 */
@ccclass("HttpManager")
export class HttpManager extends Component {

    public token: string;

    public mineIp: string

    public start() {
        Global.HTTP = this;
    }

    public getSubGameManifest(url: string, data: any): any {
        fetch(url).then((response: Response) => {
            if (response.ok) {
            } else {
            }
        })
    }

    /**
     * 发送post请求
     * @param url 
     * @param data 
     */
    public sendGetRequestAsync(url: string, data: any, showNetMask = false): Promise<any> {
        if (this.token) {
            data.token = this.token;
        }
        let xhr = new XMLHttpRequest();
        xhr.timeout = 60000;
        xhr.responseType = "text";
        //创建一个 post 请求，采用异步
        xhr.open('GET', url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        if (showNetMask) {
            // NetLoadingView.instance.show();
        }
        //注册相关事件回调处理函数
        return new Promise((resolove, reject) => {
            xhr.ontimeout = () => {
                resolove({ code: -500, msg: `${Global.LANG.getLang(4)}` });
            };
            xhr.onerror = () => {
                resolove({ code: -500, msg: `${Global.LANG.getLang(4)}` });
            };
            xhr.onreadystatechange = function (e) {
                if (showNetMask) {
                }
                if (this.readyState == 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    let result = JSON.parse(xhr.responseText);
                    if (DEBUG) {
                        LogUtils.logD(Date.now() + "," + url + "收到返回:  %j=", JSON.parse(xhr.responseText));
                    }
                    resolove(result);
                } else if (xhr.status == 404) {
                    resolove({ code: -500, msg: `${Global.LANG.getLang(-502)}` });
                }
            };
            if (DEBUG) {
                LogUtils.logD(Date.now() + "," + url + " 请求参数:  %j=", data)
            }
            if (this.token) {
                // data.token = this.token;
                xhr.setRequestHeader("token", this.token)
            }
            //发送数据
            xhr.send(JSON.stringify(data));
        });
    }


    public sendTestRequestAsync(url: string, data: any, showNetMask = false) {
        if (CC_DEBUG) {
            // url = url.replace(ServerConfig.PATH_CONFIG.http_server, ServerConfig.PATH_CONFIG.test_api_server);
            // url = url.replace("/api/gate", "");
        }
        return this.sendRequestAsync(url, data, showNetMask);
    }

    /**
     * 发送post请求
     * @param url 
     * @param data 
     */
    public sendRequestAsync(url: string, data: any, showNetMask = false): Promise<any> {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 60000;
        xhr.responseType = "text";
        //创建一个 post 请求，采用异步
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        if (showNetMask) {
            NetLoadingView.instance.show(`${url} request`);
        }
        //注册相关事件回调处理函数
        return new Promise((resolove, reject) => {
            xhr.ontimeout = () => {
                resolove({ code: -501, msg: `${Global.LANG.getLang(-501)}` });
            };
            xhr.onerror = () => {
                resolove({ code: -502, msg: `${Global.LANG.getLang(-502)}` });
            };
            xhr.onreadystatechange = function (e) {
                if (showNetMask) {
                    NetLoadingView.instance.hide(`${url} response`);
                }
                if (this.readyState == 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    let result = JSON.parse(xhr.responseText);
                    if (DEBUG) {
                        LogUtils.logD(Date.now() + "," + url + "收到返回:  %j=", JSON.parse(xhr.responseText));
                    }
                    if (result.data && result.data.serverTime) {
                        DateTimeManager.instance.updateServerTime(result.data.serverTime);
                    }
                    resolove(result);
                }
            };
            //发送数据
            if (DEBUG) {
                LogUtils.logD(Date.now() + "," + url + " 请求参数:  %j=", data)
            }
            if (this.token) {
                if (CC_DEBUG) {
                    // if (isTest) {
                    //     xhr.setRequestHeader("h", "172.16.0.103")
                    // }
                    //  else {
                    //     xhr.setRequestHeader("h", "172.16.0.107")
                    // }
                }
                // data.token = this.token;
                xhr.setRequestHeader("token", this.token)
            }
            xhr.send(JSON.stringify(data));
        });
    }
}