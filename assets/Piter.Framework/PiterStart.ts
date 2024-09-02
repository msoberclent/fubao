
import { Component, Game, _decorator, director, game, sys } from 'cc';
import { ServerConfig } from '../Scripts/game/constant/ServerConst';
import { GameUtils } from '../Scripts/game/utils/GameUtils';
import { BaseConstant } from './BaseKit/Constant/BaseConstant';
import { BaseEvent } from './BaseKit/Constant/BaseEvent';
import Global from './PiterGlobal';
import { DefaultAlertView } from './UIKit/Example/DefaultAlertView';
import { PiterHotUpdateView } from './UpdateKit/PiterHotUpdateView';
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
@ccclass('PiterStart')
export abstract class PiterStart extends Component {

    hotUpdateView: PiterHotUpdateView = null;

    onLoad() {
        // 给个面子不要删除版本号
        director.on("HotUpdateSuccess", this.hotUpdateSuceess, this);
        this.hotUpdateView = this.node.getChildByPath("BottomLayer/HotUpdateView").getComponent(PiterHotUpdateView);
        this.addNativeListener();
    }

    public addNativeListener() {
        if (sys.isNative) {
            GameUtils.init();
        }
    }

    start() {
        this.registerLifeCycle();
    }

    /**
     * 注册生命周期
     */
    private registerLifeCycle() {
        if (sys.isBrowser) {
            document.addEventListener("visibilitychange", () => {
                document.hidden ? this.pauseGame() : this.resumeGame();
            });
        } else {
            game.on(Game.EVENT_HIDE, () => {
                // game.pause();
                this.pauseGame();
            });
            game.on(Game.EVENT_SHOW, () => {
                // game.resume();
                this.resumeGame();
            }, this);
        }
    }


    protected pauseGame() {
        if (!BaseConstant.RUNING_BACK) {
            BaseConstant.RUNING_BACK = true;
            Global.EVENT.dispatchEvent(BaseEvent.RUN_BACKEND);
            if (sys.isBrowser) {
                Global.SOUND.pauseMusic();
            }
            Global.SOUND.stopAllEffects();

        }
    }

    protected resumeGame() {
        BaseConstant.RUNING_BACK = false;
        Global.EVENT.dispatchEvent(BaseEvent.RUN_FORTEND);
        if (sys.isBrowser) {
            Global.SOUND.remuseMusic();
        }
        this.scheduleOnce(() => {
            if (!Global.IN_OUTER) {
                GameUtils.fixOrientation();
            }
        })
    }

    abstract runGame();

    //热更新模块--------------------

    public removeHotUpdate() {
        this.hotUpdateView.node.removeFromParent();
        this.hotUpdateView.node.destroy();
    }

    errorTimes: number = 0;
    public async getRemoteInfo() {
        let path;
        if (sys.os == sys.OS.ANDROID) {
            path = ServerConfig.SERVER_INFO.hot_path + "/android/project.manifest";
        } else {
            path = ServerConfig.SERVER_INFO.hot_path + "/ios/project.manifest";
        }
        let resp = await Global.HTTP.sendGetRequestAsync(path + `?t=${Date.now()}`, null);
        if (resp.code) {
            if (this.errorTimes > 5) {
                DefaultAlertView.addAlert("获取游戏资源失败,请重启游戏", () => {
                });
                return;
            }
            this.errorTimes++;
            this.scheduleOnce(() => {
                this.getRemoteInfo()
            }, 3);
            return;
        }
        ServerConfig.LAST_REMOTE_INFO = resp;
        this.hotUpdateView.startHotupdateView();
    }

    public startHotUpdate() {
        this.hotUpdateView.node.active = true;
        if (ServerConfig.HOT_UP_127) {
            this.getRemoteInfo();
        } else {
            this.hotUpdateView.startHotupdateView();
        }
        // if (!ServerConfig.DOS_SAFE) {
        //     this.hotUpdateView.startHotupdateView();
        //     return
        // } else {
        // }
    }

    abstract showLoginView();

    public hotUpdateSuceess() {

        this.showLoginView();
    }
}
