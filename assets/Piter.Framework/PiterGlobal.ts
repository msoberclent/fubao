import { GamePlayerManager } from "../Scripts/game/manager/GamePlayerManager";
import { GameLogData, GameLogPanel } from "../Scripts/game/view/login/GameLogPanel";
import { PaomaDengUI } from "../Scripts/game/view/main/PaomaDengUI";
import { APPSoundManager } from "./BaseKit/Manager/APPSoundManager";
import { EventManager } from "./BaseKit/Manager/EventManager";
import { PoolManager } from "./BaseKit/Manager/PoolManager";
import { TimeUtils } from "./BaseKit/Util/TimeUtils";
import LanguageManager from "./I18Kit/LanguageManager";
import { HttpManager } from "./NetKit/HttpManager";
import SocketManager from "./NetKit/SocketManager";
import { ResManager } from "./ResKit/ResManager";
import { UIManager } from "./UIKit/Manager/UIManager";

/**
 * 内置数据管理模式
 */
export class PiterGloal {

    public PLAYER: GamePlayerManager = null;
    /**
     * 资源管理
     */
    public RES: ResManager = null;

    /**
     * UI管理
     */
    public UI: UIManager = null;

    /**
     * WEBSocket管理
     */
    public SOCKET: SocketManager;

    /**
     * Http管理器
     */
    public HTTP: HttpManager;

    /**
     * 对象池管理
     */
    public POOL: PoolManager;

    /**
     * 事件分发管理器
     */
    public EVENT: EventManager;

    /**
     * 多语言管理器
     */
    public LANG: LanguageManager;

    /**
     * 音频播放管理器
     */
    public SOUND: APPSoundManager;


    public PMD: PaomaDengUI



    public addLog(str) {
        if (!CC_DEBUG) {
            return;
        }
        let ui = Global.UI.getUI(GameLogPanel)
        let pushStr = TimeUtils.dateFormatMS("hh:mm:ss", new Date().getTime()) + " " + str
        if (ui) {
            GameLogData.pushLog(pushStr);
            return ui.getComponent(GameLogPanel).showLog();
        } else {
            GameLogData.pushLog(pushStr);
        }
    };

    /**
     * 程序单次本地记录
     */
    public ONCE_STORAGE = {}
    /**
     * 版本
     */
    public VERSION: VERSION = {
        CLIENT: "1.0.0.0",
        SERVER: "1.0.0.0",
        RES: "1.0.0.0",
        APP: ""
    }

    /**
     * 开关
     */
    public SWITCH_INFO = {
        VIBRATE: true //手机震动
    }


    public getResLoading() {
        ``
    }

    static UI_DIRECTION: number = 1;

    static openTime: number = Date.now();

    IN_OUTER: boolean = false;

    public platName: string = "yuanjian";
}

export interface VERSION {
    CLIENT: string,
    SERVER: string,
    RES: string
    APP: string
}

const Global = new PiterGloal();

export default Global;