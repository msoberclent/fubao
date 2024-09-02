import { _decorator } from "cc";
import { BaseEvent } from "../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { LocalStorageData } from "../../../../Piter.Framework/BaseKit/Data/LocalStorageData";
import { ExcelManager } from "../../../../Piter.Framework/BaseKit/Manager/ExcelManager";
import NetLoadingView from "../../../../Piter.Framework/NetKit/NetLoadingView";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DefaultAlertView } from "../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { config_slo_subgame } from "../../../config/config_slo_subgame";
import { WebGameUtils } from "../../../webutils/WebGameUtils";
import { GameExcelConst } from "../../constant/GameResConst";
import { NotifyConst } from "../../constant/NotifyConst";
import { ServerConfig } from "../../constant/ServerConst";
import { GamePlayerManager } from "../../manager/GamePlayerManager";
import { GameUtils } from "../../utils/GameUtils";
import { MainView } from "../main/MainView";
import { GameSignInPanel } from "./GameSignInPanel";
import { InputAccView } from "./InputAccView";

/**
 * 主界面登陆组件
 */
const { ccclass, property } = _decorator;

@ccclass('MainLoginComp')
export class MainLoginComp extends PiterUI {

    mainView: MainView = null;

    public setDelegate(mainView: MainView) {
        this.mainView = mainView
    }

    createChildren() {
        super.createChildren();
        // this.checkLogin();
    }

    public checkLogin() {
        let token = LocalStorageData.getItem("user_token");
        if (token && !GamePlayerManager.instance.isLogin()) {
            NetLoadingView.instance.show(`checkLogin`);
            GamePlayerManager.instance.socketUrl = token;
            let name = LocalStorageData.getItem("user_name") || "";
            let pass = LocalStorageData.getItem("user_pass") || "";
            ServerConfig.DEFAULT_NAME = name;
            ServerConfig.DEFAULT_PASS = pass;
            this.doUserLogin();
            return false;
        } else {
            this.mainView.lockUIBtn = false;
        }
        return true;
    }

    public AT_LoginBtnTouch() {
        if (this.mainView.lockUIBtn) {
            return;
        }
        GameUtils.checkIOSLock();
        Global.UI.openView(InputAccView, { father: this });
    }

    public AT_RegisterBtnTouch() {
        if (this.mainView.lockUIBtn) {
            return;
        }
        GameUtils.checkIOSLock();
        Global.UI.openView(GameSignInPanel, { father: this });
    }

    async doUserLogin() {
        //竖版账号登录
        let data = await GamePlayerManager.instance.login(2)
        if (data.code != 200) {
            DefaultAlertView.addAlert(data.msg, () => {
                Global.UI.openView(InputAccView, { father: this });
            })
            NetLoadingView.instance.hide(`AT_accLoginBtnTouch`)
            this.mainView.lockUIBtn = false;
            return;
        }
        //链接Soket
        this.connect2Server();
    }

    private connect2Server() {
        let socketUrl = GamePlayerManager.instance.socketUrl;
        Global.SOCKET.connect(socketUrl);
    }

    public onAdded() {
        super.onAdded();
        Global.EVENT.on(BaseEvent.NORMAL_LOGIN_SUCCESS, this.onLoginSuccess, this);
        Global.EVENT.on(BaseEvent.DO_MAIN_LOGIN, this.doUserLogin, this);
        Global.EVENT.on(NotifyConst.NOTIFY_ONLINE, this.onSocketSuccess, this);
    }

    public onRemoved() {
        super.onRemoved();
        Global.EVENT.off(BaseEvent.NORMAL_LOGIN_SUCCESS, this.onLoginSuccess, this);
        Global.EVENT.off(NotifyConst.NOTIFY_ONLINE, this.onSocketSuccess, this);
        Global.EVENT.off(BaseEvent.DO_MAIN_LOGIN, this.doUserLogin, this);
    }

    onLoginSuccess() {
        this.mainView.doLoginSuccess();
    }

    async onSocketSuccess(data) {
        let resp = await GamePlayerManager.instance.updatePlayerInfo();
        if (resp.code != 200) {
            DefaultAlertView.addOnlyAlert(resp.msg);
            NetLoadingView.instance.hide(`onSocketSuccess 1 `)
            return;
        }
        this.mainView.lockUIBtn = false;
        //进入游戏大厅
        GamePlayerManager.instance.getShouCangList()
        this.mainView.doLoginSuccess();
        if (!Global.IN_OUTER) {
            let checkResp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/check-user-enter", {});
            if (checkResp.code == 200) {
                this.mainView.checkLastJumpInfo(checkResp.data);
            } else {
                this.mainView.checkLastJumpInfo(null);
                DefaultAlertView.addOnlyAlert(checkResp.msg);
            }
        } else {
            this.mainView.checkLastJumpInfo(null);
        }
    }

    public goGidGame() {
        let gid = WebGameUtils.GID;
        let gameExcelConfig = ExcelManager.getConfigById(GameExcelConst.subGames, gid) as config_slo_subgame;
        if (!gameExcelConfig) {
            //没有这个游戏
            DefaultAlertView.addOnlyAlert("游戏暂未开放", () => {
                WebGameUtils.flushWindow();
            })
            return;
        }
        WebGameUtils.openSubgame(gameExcelConfig, () => {
            Global.UI.closeView(MainView);
        })
    }
}
