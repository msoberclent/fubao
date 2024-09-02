import { DynamicAtlasManager, JsonAsset, _decorator, game, macro, resources, setDisplayStats, sys } from 'cc';
import { LocalStorageData } from '../Piter.Framework/BaseKit/Data/LocalStorageData';
import { ExcelManager } from '../Piter.Framework/BaseKit/Manager/ExcelManager';
import { SOUND_CONST_URL } from '../Piter.Framework/BaseKit/Sound/BaseSoundComponent';
import { LogUtils } from '../Piter.Framework/BaseKit/Util/LogUtils';
import { Utils } from '../Piter.Framework/BaseKit/Util/Utils';
import { LanguageItem } from '../Piter.Framework/I18Kit/LanguageManager';
import NetLoadingView from '../Piter.Framework/NetKit/NetLoadingView';
import Global from '../Piter.Framework/PiterGlobal';
import { PiterStart } from '../Piter.Framework/PiterStart';
import { DefaultAlertView } from '../Piter.Framework/UIKit/Example/DefaultAlertView';
import { DefaultToast } from '../Piter.Framework/UIKit/Example/DefaultToast';
import { BundlesInfo } from './bundles';
import { GameExcelConst, GameResConst, MainDirConst } from './game/constant/GameResConst';
import { PathConfigFac, PathTypeEnum, ServerConfig } from './game/constant/ServerConst';
import { GamePlayerManager } from './game/manager/GamePlayerManager';
import { GameUtils } from './game/utils/GameUtils';
import { GameLoginView } from './game/view/login/GameLoginView';
import { WebGameUtils } from './webutils/WebGameUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PiterStart
 * DateTime = Wed Jan 26 2022 10:50:57 GMT+0800 (中国标准时间)
 * Author = Piter
 * FileBasename = PiterStart.ts
 * FileBasenameNoExtension = PiterStart
 * URL = db://assets/Piter.Framework/PiterStart.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 * PiterFarmeWork启动组件
 */

@ccclass('GameStart')
export class GameStart extends PiterStart {

    gameVersionPath: string;
    /**
     * 初始化就设置一些参数
     * 
     */
    setGlobalConst() {
        // assetManager.downloader.maxConcurrency = 10;
        // assetManager.downloader.maxRequestsPerFrame = 12;
        this.setFrameRate();
        SOUND_CONST_URL.CLICK_BTN = "";
        DefaultToast.prefabUrl = `prefabs/GameToast`;
        DefaultAlertView.prefabUrl = "prefabs/GameAlertPanel";
        NetLoadingView.prefabUrl = `prefabs/GameNetLoading`;
        if (sys.isNative) {
            DynamicAtlasManager.instance.enabled = false;
            macro.CLEANUP_IMAGE_CACHE = true;
        } else {
            DynamicAtlasManager.instance.enabled = false;
        }
        if (CC_DEBUG) {
            if (sys.isNative) {
                setDisplayStats(false);
                // setDisplayStats(true);
            }
        }
        if (sys.isNative) {
            if (this.releaseAppIndex == null) {
                let last = LocalStorageData.getItem("lastAppIndex");
                if (last) {
                    this.releaseAppIndex = Number(last) || 0
                } else {
                    this.releaseAppIndex = 0;
                }
            }
        }
    }


    public setFrameRate() {
        if (sys.isNative || sys.isMobile) {
            game.frameRate = 60;
        } else {
            game.frameRate = 60;
        }
    }

    public releaseAppConfigs = [
        "https://app.mx898.pro/static_config.json",
        "https://app.mx898.xyz/static_config.json"
    ];
    public liveAppConfigs = [`http://app.hz888.vip/mx_config.json`]

    public releaseAppIndex: number = 0

    public setNextReleaseAppConfig() {
        this.releaseAppIndex++;
        if (this.releaseAppIndex > this.releaseAppConfigs.length - 1) {
            this.releaseAppIndex = 0;
        }
    }

    times: number = 1;
    useDosServer: string;
    info;
    subGameInfo;
    public async getServerInfo() {
        let appVersion = "1";
        if (sys.isNative) {
            appVersion = await GameUtils.getAPPVersion();
        }

        let packageName = await GameUtils.getPackageName() as string;
        let path = this.releaseAppConfigs[this.releaseAppIndex];
        if (packageName.indexOf("live") > -1) {
            path = this.liveAppConfigs[0];
        }
        console.log("请求地址：" + path)
        let resp = await Global.HTTP.sendGetRequestAsync(path + `?t=${Date.now()}`, {});
        console.log(("请求返回：" + JSON.stringify(resp)));
        if (resp.code == -500) {
            this.times++;
            this.setNextReleaseAppConfig();
            if (this.times >= 20) {
                DefaultAlertView.addOnlyAlert("获取最新版本文件失败,请检查网络设置权限", () => {
                    game.end();
                });
            } else {
                this.scheduleOnce(() => {
                    this.getServerInfo();
                }, 0.5)
            }
            return;
        }
        if (sys.isNative) {
            let liveVersion;
            if (sys.os == sys.OS.IOS) {
                liveVersion = resp.ios_version;
            } else {
                liveVersion = resp.android_version;
            }
            console.log("appVersion: " + appVersion);
            console.log("liveVersion: " + liveVersion);
            if (GameUtils.compareVersions(appVersion, liveVersion) == -1) {
                DefaultAlertView.addOnlyAlert("当前游戏版本过旧,请下载最新游戏包", () => {
                    GameUtils.goUrl(resp.download_url);
                    game.restart();
                });
                return;
            }
        }
        if (resp) {
            if (!resp.domain) {
                resp.domain = [];
            }
            let domain = _.shuffle(resp.domain);
            let findDomain = _.find(domain, (item: any) => {
                return item.status == 1;
            })
            if (!findDomain) {
                findDomain = {};
            }
            // let hotUrl = path.replace("/static_config.json", "") + "/hot/release";
            ServerConfig.SERVER_INFO = {
                hot_path: decodeURIComponent(resp.hot_path),
                subgame_hot_path: decodeURIComponent(resp.subgame_hot_path),
                verion_key: resp.verion_key,
                http_path: findDomain.http,
                socket_path: findDomain.ws
            };
            let httpServer;
            let socketServer;
            httpServer = ServerConfig.SERVER_INFO.http_path.trim();
            socketServer = ServerConfig.SERVER_INFO.socket_path.trim();
            ServerConfig.PATH_CONFIG.http_server = httpServer
            ServerConfig.PATH_CONFIG.socket_server = socketServer
            this.startHotUpdate();
        } else {
            DefaultAlertView.addAlert("获取配置文件失败,请重新下载APP");
        }
    }

    /**
     * 设置屏幕参数
     */
    setScreenConfig() {
        Global.UI.changeResize(2);
        this.setServerConfig();
    }

    setServerConfig() {
        if (sys.isBrowser) {
            this.decodeUrlStr();
            WebGameUtils.HOME_PAGE_URL = decodeURIComponent(Utils.getURLQueryString("op_home_url"));
            WebGameUtils.OP_RETURN_TYPE = decodeURIComponent(Utils.getURLQueryString("op_return_type"));
            WebGameUtils.GID = Utils.getURLQueryString("gid");
            if (!WebGameUtils.GID) {
                WebGameUtils.GID = Utils.getURLQueryString("gid", false) || "";
            }
            if (window['WebClient']) {
                Global.VERSION.CLIENT = window['WebClient'].VERSION;
            }
        } else {
            let nickname = LocalStorageData.getItem("test_server_name");
            if (!nickname) {
                nickname = "Player" + _.random(100000, 999999);
                LocalStorageData.setItem("test_server_name", nickname);
            }
            ServerConfig.DEFAULT_NAME = nickname;
            ServerConfig.DEFAULT_PASS = nickname;
            ServerConfig.DEFAULT_OPENID = nickname;
            // PathConfigFac.getPathByType(PathTypeEnum.DEV1);
            PathConfigFac.getPathByType(PathTypeEnum.NATIVE_SERVER);
        }
        GameResConst.init();
    }

    private async decodeUrlStr() {
        let token = Utils.getURLQueryString("token");
        if (token) {
            let secretToken = Utils.getURLQueryString("token", false);
            // WebGameUtils.decodeGameToken(secretToken)
            WebGameUtils.initParam();
            WebGameUtils.TOKEN = Utils.getURLQueryString("token");
            let pathConfig = PathConfigFac.getPathByType(PathTypeEnum.WEB_SERVER);
            ServerConfig.PATH_CONFIG.token_login = true;
            pathConfig.http_server = decodeURIComponent(Utils.getURLQueryString("h"));
            pathConfig.socket_server = decodeURIComponent(Utils.getURLQueryString("w")) + "/ws/connect/";
        } else {
            let host = window.location.host;
            let serverType = Utils.getURLQueryString("t");
            if (serverType == "3" || serverType == "7") {

            } else if (host.indexOf("test") > -1) {
                PathConfigFac.getPathByType(PathTypeEnum.WEB_TEST_SERVER);
            } else if (host.indexOf("localhost") > -1) {

            } else if (host.indexOf("127.0.0.1") > -1) {
                PathConfigFac.getPathByType(PathTypeEnum.WEB_SERVER);
                LogUtils.loglevel = LogUtils.DEBUG
            } else if (host.indexOf("lizix") > - 1) {

            } else if (host.indexOf("172.16") > - 1) {

            } else {
                if (host.indexOf("live") > -1) {
                    PathConfigFac.getPathByType(PathTypeEnum.WEB_SERVER2);
                } else {
                    PathConfigFac.getPathByType(PathTypeEnum.WEB_SERVER);
                }
                return;
            }
            if (serverType == "1" || serverType == "2" || serverType == "5" || serverType == "7") {
                PathConfigFac.getPathByType(serverType);
                if (host.indexOf("localhost") > -1) {
                    LogUtils.loglevel = LogUtils.DEBUG
                }
            } else if (serverType == "4") {
                if (host.indexOf("live") > -1) {
                    PathConfigFac.getPathByType(PathTypeEnum.WEB_SERVER2);
                } else {
                    PathConfigFac.getPathByType(PathTypeEnum.WEB_SERVER);
                }
                if (host.indexOf("localhost") > -1) {
                    LogUtils.loglevel = LogUtils.DEBUG
                }
                return;
            } else {
                let server = Utils.getURLQueryString("s");
                if (server) {
                    let pathConfig = PathConfigFac.getPathByType(PathTypeEnum.WEB_SERVER);
                    pathConfig.http_server = "http://" + server;
                    pathConfig.socket_server = "ws://" + server + "/ws/connect/";
                    LogUtils.loglevel = LogUtils.DEBUG
                }
            }
            let nickname = Utils.getURLQueryString("un");
            if (nickname) {
                ServerConfig.DEFAULT_NAME = nickname;
                ServerConfig.DEFAULT_PASS = nickname;
                ServerConfig.DEFAULT_OPENID = nickname;
            }
        }

    }

    async start() {
        super.start();
        this.setScreenConfig();
        let lang = LanguageItem.ZH_CN;
        if (sys.isBrowser) {
            if (Utils.getURLQueryString("lang")) {
                lang = lang;
            }
        } else {
            this.hotUpdateView.node.active = true;
        }
        Global.LANG.init(lang)
        this.schedule(this.checkNerWorkState, 1, macro.REPEAT_FOREVER);
        this.checkNerWorkState();
        // this.runGame();
        // this.setGlobalConst();
    }

    public async checkNerWorkState() {
        this.runGame();
        this.setGlobalConst();
        this.unschedule(this.checkNerWorkState);
        return true;
    }

    public loadingLanguageText(callback: Function) {
        //加载当前语言配置
        Global.RES.loadGroup(["resources"], null, () => {
            let languageConfig = ExcelManager.getConfigList(GameExcelConst.lanuage);
            Global.LANG.setLangConfig(languageConfig);
            callback();
        })
    }

    /**
     * 开始游
     */
    runGame() {
        this.loadingLanguageText(async () => {
            let versionData = resources.get(`SubGameVersion`, JsonAsset);
            // await Global.RES.preloadBundleDirs(BundlesInfo.game_main, GameResConst.preload);
            this.goLoginOrLoading();
        });
    }

    /**
     * 可选择跳往加载界面或者登录界面
     */
    async goLoginOrLoading() {
        if (CC_DEBUG && !sys.isNative) {
            this.hotUpdateSuceess();
            return;
        }
        if (sys.isNative) {
            this.getServerInfo();
            return;
        }
        this.hotUpdateSuceess();
    }

    public async showLoginView() {
        // assetManager.loadBundle(BundlesInfo.game_main);
        if (sys.isBrowser) {
            await Global.RES.preloadBundleDirs(BundlesInfo.game_main, ['login']);
            if (document.getElementById("loadingDiv")) document.getElementById("loadingDiv").style.display = "none";
            if (document.getElementById("Cocos3dGameContainer")) {
                document.getElementById("Cocos3dGameContainer").style.display = "";
            }
        } else {
            await Global.RES.preloadBundleDirs(BundlesInfo.game_main, _.values(MainDirConst));
        }
        GamePlayerManager.instance.init();
        Global.UI.openView(GameLoginView, { reload: true });
    }
}
