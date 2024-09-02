import { JsonAsset, sys } from "cc";
import { BaseEvent } from "../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { BaseObject } from "../../../Piter.Framework/BaseKit/Constant/BaseObject";
import { LocalStorageData } from "../../../Piter.Framework/BaseKit/Data/LocalStorageData";
import { Utils } from "../../../Piter.Framework/BaseKit/Util/Utils";
import NetLoadingView from "../../../Piter.Framework/NetKit/NetLoadingView";
import Global from "../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../Piter.Framework/UIKit/Example/DefaultToast";
import { OpeninstallAPI } from "../../platform/OpeninstallAPI";
import { NotifyConst } from "../constant/NotifyConst";
import { ServerConfig } from "../constant/ServerConst";
import { GameIconItem, PlatPlayer, RechargeMethodItem, SecondIconItem, WithdrawMethodItem } from "../message/GameMessage";
import { GameUtils } from "../utils/GameUtils";
import { GameLoginView } from "../view/login/GameLoginView";
import { ActivityBwhbyPanel } from "../view/main/activity/ActivityBwhbyPanel";


export class GamePlayerManager {
    private static _instance: GamePlayerManager;
    public static get instance(): GamePlayerManager {
        if (!GamePlayerManager._instance) {
            GamePlayerManager._instance = new GamePlayerManager();
            Global.PLAYER = GamePlayerManager._instance
        }
        return GamePlayerManager._instance;
    }

    public constructor() {
        if (GamePlayerManager._instance) {
            throw new Error("ActivityManager使用单例");
        }
        this.addConstNotify();
    }


    public async getDeviceInfo() {
        this.deviceInfo = await GameUtils.getDeviceInfo();
    }

    public async getInvieteData() {
        if (sys.isNative) {
            this.inviteData = await OpeninstallAPI.getOpenInstallData();
        } else {
            let code = Utils.getURLQueryString("inviteCode").trim();
            if (code) {
                this.inviteData = {
                    bindData: {
                        inviteCode: code
                    }
                }
            }
        }

    }


    public getInviteCode() {
        if (!this.inviteData || !this.inviteData.bindData) {
            return null;
        }
        return this.inviteData.bindData.inviteCode;
    }

    public init() {
        this.getDeviceInfo();
        this.getInvieteData();
    }

    public addConstNotify() {
        Global.EVENT.on(NotifyConst.NOTIFY_REPEATED_LOGIN, this.onLogout, this);
        Global.EVENT.on(BaseEvent.NOTIFY_ACCOUNT_CHANGE, this.updatePlayerGold, this);
        Global.EVENT.on(NotifyConst.NOTIFY_RED_DOT_UPDATE, this.updateRedDot, this);
        Global.EVENT.on(NotifyConst.NOTIFY_MARQUEE_ARRIVED, this.showPMD, this);
        Global.EVENT.on(BaseEvent.NOTIFY_BONUS_RAIN_ARRIVED, this.onHBArrived, this);
    }

    showPMD(msg) {
        if (msg.errorCode != 200) return;
        let data = { content: msg.content };
        Global.UI.showPaomaDeng(data);
    }

    updatePlayerGold(data) {
        if (data.userAccount) {
            let playerData = GamePlayerManager.instance.player;
            playerData.gold = data.userAccount.gold;
            playerData.safety = data.userAccount.safety;
            Global.EVENT.dispatchEvent(BaseEvent.GOLD_FLUSH);
        }
    }

    public onLogout(data) {
        Global.SOCKET.isDingHao = true;
        Global.SOCKET.close();
        DefaultAlertView.addAlert("网络异常,请重新登陆游戏!", () => {
            Global.UI.closeAllView();
            Global.SOCKET.socketUrl = null;
            Global.PLAYER.clearPlayerData();
            LocalStorageData.removeItem("user_token");
            Global.UI.openView(GameLoginView, { reload: false });
        })
    }

    updateRedDot(data) {
        this.redDotMap = data.redDotMap;
        Global.EVENT.dispatchEvent(BaseEvent.RED_DOT_FLUSH, data.redDotMap);
    }


    clearPlayerData() {
        this.loginInfo = null;
        this.player = {};
        this.parentId = null;
        this.gameSceneConfig = {};
        this.withdrawMethod = null;
        this.rechargeMethod = null;
        this.redDotMap = {};
        this.allowSendCode = null;
    }


    public loginInfo;

    public player: PlatPlayer = {};

    public parentId: number;

    public socketUrl: string;

    public gameSceneConfig: any = {};

    public withdrawMethod: WithdrawMethodItem[];

    public rechargeMethod: RechargeMethodItem[];

    public redDotMap = {};

    public allGameConfig: any = null;

    public allGameSortList: any = {};

    public inviteData: any = null;

    public deviceInfo: any = {};

    public allowSendCode: any = null;

    public clientConfig: any = {};

    public activityStr: string = "";

    public bannerUrls: string[] = [];
    private getGames(gameStr: string, gameListJson: any[]) {
        let gameClientJson = {};
        for (let i = 0; i < gameListJson.length; i++) {
            gameClientJson[gameListJson[i].c] = gameListJson[i]
        }
        let returnJson = [];
        let gameServerList = gameStr.split(",");
        // temp = 1000_1
        for (let i = 0; i < gameServerList.length; i++) {
            let temp = gameServerList[i];
            let gameInfoArr = temp.split("_");
            let gameId = gameInfoArr[0];
            let gameStatus = gameInfoArr[1];
            let jsonData = gameClientJson[gameId]
            if (jsonData) {
                jsonData[`e`] = Number(gameStatus);
                returnJson.push(jsonData);
            }
        }
        return returnJson;
    }

    public appDownUrl: string;
    public async getAllGameConfigs() {
        if (this.allGameConfig) {
            return { code: 200 };
        }
        let games = {};
        let data = Global.RES.getAsset("excel/gamelist", JsonAsset) as JsonAsset
        let gameListJson = data.json as any[];
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/getAllGames", {});
        if (resp.code == 200) {
            this.appDownUrl = resp.data.appDownUrl;
            if(resp.data.bannerUrl){
                this.bannerUrls = resp.data.bannerUrl.split(",");
            }
            resp.data.games = this.getGames(resp.data.gamesStr, gameListJson);
            this.activityStr = resp.data.switchs || "";
            let baoliu = {
                //     "LIVE": ['AG'],
                //     "PVP": ['KY', "WL"],
                //     "RNG": ["CQ9", "JDB", "MG", "PG", "PP"],
                //     "FISH": ["JDB", "CQ9"],
                //     "SPORT": ["SABA"]
            }
            if (resp.data.notSearch) {
                this.excludePlat = resp.data.notSearch.split(",");
            }
            this.allGameConfig = resp.data;
            this.allGameConfig.groupGame = {};
            GamePlayerManager.instance.allowSendCode = resp.data.registNeedCaptcha;
            for (let i = 0; i < resp.data.games.length; i++) {
                let game = resp.data.games[i];
                let gameItem: GameIconItem = {
                    productCode: game['a'],
                    gameType: game['b'],
                    gameId: game['c'],
                    name: game['d'],
                    status: game['e'],
                    platName: game['f'],
                    jumpUrl: game['g'],
                    sortIndex: game['h'],
                    displayType: game['i'],
                    prex: ""
                }
                let platIndex = this.allGameSortList[gameItem.platName] || 1;
                gameItem.sortIndex = platIndex;
                platIndex++;
                this.allGameSortList[gameItem.platName] = platIndex
                if (gameItem.jumpUrl) {
                    if (sys.isNative && ServerConfig.DOS_SAFE) {
                        if (ServerConfig.SERVER_INFO.public_res_path) {
                            gameItem.jumpUrl = ServerConfig.SERVER_INFO.public_res_path + "/yuanjian/icon/" + gameItem.jumpUrl
                        } else {
                            gameItem.jumpUrl = ServerConfig.PATH_CONFIG.http_server + "/yuanjian/icon/" + gameItem.jumpUrl
                        }
                    } else {
                        if (gameItem.jumpUrl.indexOf("http") == -1) {
                            gameItem.jumpUrl = resp.data.baseDomain[gameItem.platName].replace(`icon${gameItem.platName}`, "icon4") + gameItem.jumpUrl
                        }
                    }
                }
                let baoliuItem = baoliu[game['b']]
                if (!baoliuItem) {
                    games[gameItem.gameId] = gameItem;
                } else {
                    if (baoliuItem.indexOf(game['a']) > -1) {
                        games[gameItem.gameId] = gameItem;
                    }
                }

            }
            //

            let twoLine = this.allGameConfig.topClass[0] == 'HOT' && this.allGameConfig.topClass[1] == 'JINSHU';
            if (twoLine) {
                delete this.allGameConfig.secondClass["HOT"];
                this.allGameConfig.topClass.splice(0, 1);
            }
            this.allGameConfig.games = games;
            if (this.allGameConfig.secondClass["JINSHU"]) {
                this.allGameConfig.secondClass["HOT"] = this.allGameConfig.secondClass["JINSHU"];
                delete this.allGameConfig.secondClass["JINSHU"];
            }

            for (let key in this.allGameConfig.secondClass) {
                let secondList = this.allGameConfig.secondClass[key];
                if (baoliu[key]) {
                    let list = [];
                    for (let i = 0; i < secondList.length; i++) {
                        if (baoliu[key].indexOf(secondList[i].productCode) > -1) {
                            list.push(secondList[i]);
                        }
                    }
                    this.allGameConfig.secondClass[key] = list;
                }
            }

            for (let i = 0; i < this.allGameConfig.topClass.length; i++) {
                if (this.allGameConfig.topClass[i] == "JINSHU") {
                    this.currentModel = 2
                    this.allGameConfig.topClass[i] = "HOT";
                }
            }
        }
        return resp;
    }

    public isLogin() {
        return this.player.simpleUser != undefined;
    }

    public currentModel: number = 1;
    public getGameByGroup(secondItem: SecondIconItem, searchKey: string = "") {
        let key = secondItem.gameType + "_" + secondItem.productCode;
        if (!searchKey) {
            if (this.allGameConfig.groupGame[key]) {
                return this.allGameConfig.groupGame[key]
            }
        }
        let games = this.allGameConfig.games as BaseObject<GameIconItem>;
        let findGames = [];
        for (let i in games) {
            let gameIcon = games[i];
            let success = false;
            if (secondItem.productCode == "HOT") {
                if (this.currentModel == 1) {
                    if (gameIcon.status == 2) {
                        success = true;
                    }
                } else {
                    if (gameIcon.platName == "0") {
                        success = true;
                    }
                }
            } else if (secondItem.productCode == "FISH_LIST") {
                if (gameIcon.gameType == "FISH") {
                    success = true;
                }
            } else {
                if (gameIcon.productCode == secondItem.productCode && gameIcon.gameType == secondItem.gameType) {
                    success = true;
                }
            }
            if (success) {
                let cloneIcon = _.clone(gameIcon);
                if (secondItem.prex) {
                    cloneIcon.prex = secondItem.prex
                }
                if (searchKey) {
                    if (cloneIcon.name.indexOf(searchKey) > -1) {
                        findGames.push(cloneIcon);
                    }
                } else {
                    findGames.push(cloneIcon);
                }
            }
        }
        let list = _.sortBy(findGames, (item) => {
            if (item.sortIndex) {
                return item.sortIndex
            }
            return 999;
        });
        if (!searchKey) {
            this.allGameConfig.groupGame[key] = list
        }
        return list;
    }
    /**
     * 获取游戏列表
     * @param type 
     * @returns 
     */
    public getGameList(type: number) {

    }

    /**
     * 更新玩家头像
     * @param headerUrl 
     */
    public updatePlayerImage(headerUrl) {
        this.player.simpleUser.headImg = headerUrl;
        Global.EVENT.dispatchEvent(BaseEvent.HEADER_FLUSH)
    }

    public async deleteWithdrawMethod(id: number) {
        for (let i = 0; i < this.withdrawMethod.length; i++) {
            if (this.withdrawMethod[i].id == id) {
                this.withdrawMethod.splice(i, 1);
            }
        }
    }

    public async getRechargeMethod(): Promise<RechargeMethodItem[]> {
        // if (this.rechargeMethod) {
        //     return this.rechargeMethod;
        // }
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge/mode-list", {}, true);
        if (resp.code == 200) {
            this.rechargeMethod = resp.data;
        } else {
            DefaultAlertView.addOnlyAlert(resp.msg);
        }
        //返回数据格式:
        return this.rechargeMethod;
    }


    public async getMineWithdrawMethod(): Promise<WithdrawMethodItem[]> {
        if (this.withdrawMethod) {
            return this.withdrawMethod;
        }
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/cash-account-list", {}, true);
        if (resp.code == 200) {
            this.withdrawMethod = resp.data;
        } else {
            DefaultToast.instance.showText(resp.msg)
        }
        //返回数据格式:
        return this.withdrawMethod;
    }

    public getMineWithdrawMethodByType(type: any): WithdrawMethodItem[] {
        if (!this.withdrawMethod) {
            return [];
        }
        let backData = [];
        if (typeof (type) == "number") {
            for (let i = 0; i < this.withdrawMethod.length; i++) {
                if (this.withdrawMethod[i].type == type) {
                    backData.push(this.withdrawMethod[i]);
                }
            }
        } else {
            for (let i = 0; i < this.withdrawMethod.length; i++) {
                if (-1 != type.indexOf(this.withdrawMethod[i].type) || -1 != type.indexOf(String(this.withdrawMethod[i].type))) {
                    backData.push(this.withdrawMethod[i]);
                }
            }
        }

        return backData;
    }


    public async getMineWithdrawGold() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/withdrawable-amount", {}, true);
        if (resp.code == 200) {
            return resp.data;
        }
        //返回数据格式:
        return {};
    }

    public get mineUid() {
        return this.player.simpleUser.uid;
    }

    onHBArrived(data) {
        Global.UI.openView(ActivityBwhbyPanel, data)
    }


    /**
     * logintype 0手机登录,1游客登录,2账号登录
     * 返回数据格式: 
     * {
         gold:
         strength_data //强化数据
        }qy 
     */
    public async login(logintype = 0, inviteCode?) {
        let loginData;
        let parentid = GamePlayerManager.instance.getInviteCode();
        if (logintype == 1) {
            let dv = await GameUtils.getUniId();
            if (parentid) {
                loginData = {
                    "login_type": logintype,
                    "udid": dv,
                    "invitedCode": parentid
                }
            } else {
                loginData = {
                    "login_type": logintype,
                    "udid": dv,
                }
            }

        } else {
            if (parentid) {
                loginData = {
                    "login_type": logintype,
                    "phone":
                        // "zhangsan1200",
                        // 1233,
                        ServerConfig.DEFAULT_NAME,
                    "pwd":
                        // "zhangsan1200",
                        // 123
                        ServerConfig.DEFAULT_PASS,
                    "invitedCode": parentid
                }
            } else {
                loginData = {
                    "login_type": logintype,
                    "phone":
                        // "zhangsan1200",
                        // 1233,
                        ServerConfig.DEFAULT_NAME,
                    "pwd":
                        // "zhangsan1200",
                        // 123
                        ServerConfig.DEFAULT_PASS
                }
            }
            if (logintype == 2) {
                loginData[`loginName`] = loginData.phone;
                delete loginData.phone;
            }
        }
        let osType = "H5";
        if (sys.os == sys.OS.ANDROID) {
            osType = "Android";
        } else if (sys.os == sys.OS.IOS) {
            osType = "IOS";
        }
        let deviceInfo = await GameUtils.getDeviceInfo()
        let dv = await GameUtils.getUniId();
        let deviceData = {
            deviceName: deviceInfo.model || "",
            deviceCode: dv,
            devicePlat: osType
        }
        loginData.deviceInfo = deviceData;
        if (parentid) {
            loginData.invitedCode = parentid;
        }
        loginData.deviceInfo = deviceData;
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/user-login", loginData);
        if (resp.code == 200) {
            this.loginInfo = resp.data;
            Global.HTTP.token = resp.data.token;
            this.parentId = resp.data.parentId
            this.player.simpleUser = resp.data.simpleUser
            this.socketUrl = ServerConfig.PATH_CONFIG.socket_server + resp.data.token;
            let auto = LocalStorageData.getItem("auto_login");
            if (auto == "1") {
                LocalStorageData.setItem("user_token", this.socketUrl);
            } else {
                LocalStorageData.removeItem("user_token");
            }

        }
        //返回数据格式:
        return resp;
    }

    public async updatePlayerInfo(disPathEvent: boolean = false) {
        if (disPathEvent) NetLoadingView.instance.show(`updatePlayerInfo`);
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/user-info", {});
        if (disPathEvent) {
            NetLoadingView.instance.hide(`updatePlayerInfo`);
        }
        if (resp.code == 200) {
            this.player = resp.data;
            this.clientConfig = resp.data.cfgs || {};
            if (disPathEvent) {
                Global.EVENT.dispatchEvent(BaseEvent.GOLD_FLUSH, {
                    playerData: this.player
                });
            }
        }
        //返回数据格式:
        return resp;
    }

    // 场景配置
    gameSceneConfigs: Map<string, any> = new Map();

    /**
     * 
     * @param gameId 获取游戏场景配置
     */
    public async getGameScene(gameId) {
        if (this.gameSceneConfigs[gameId]) {
            return this.gameSceneConfigs[gameId]
        }
        let data = { gameId: gameId }
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/getAll-gameConfig-by-gameId", data);
        if (resp.code == 200) {
            this.gameSceneConfigs[gameId] = resp.data.gameConfigList;
        }
        return this.gameSceneConfigs[gameId]
    }


    public checkIsMe(uid: string) {
        return this.player.simpleUser.uid == uid;
    }


    private includePlat: string[] = [];
    private excludePlat: string[] = ["PG2", "PGP", "PGP2"];

    public isInExcludePlat(platName) {
        return this.excludePlat.indexOf(platName) > -1;
    }

    public searchGame(gameStr: string) {
        let back = [];
        for (let i in this.allGameConfig.games) {
            let game = this.allGameConfig.games[i] as GameIconItem;
            if (!game.jumpUrl) {
                continue;
            }
            //需要包含
            if (this.includePlat.length > 0 && this.includePlat.indexOf(game.productCode) == -1) {
                continue;
            }
            //需要排除
            if (this.excludePlat.length > 0 && this.excludePlat.indexOf(game.productCode) > -1) {
                continue;
            }
            if (game.gameId.toString().indexOf(gameStr) > -1 || game.name.indexOf(gameStr) > -1) {
                back.push(game);
            }
        }
        return back
    }


    /**
     * 收藏
     */
    shoucangList = null
    public async getShouCangList() {
        if (this.shoucangList) {
            return this.shoucangList;
        }
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recently-game", {
            status: 1
        });
        if (resp.code == 200) {
            this.shoucangList = resp.data;
            return this.shoucangList
        }
        return [];
    }

    tabList: any;
}
