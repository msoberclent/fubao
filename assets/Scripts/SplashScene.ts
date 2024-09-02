import { _decorator, Component, director, sys } from 'cc';
import { GameUtils } from './game/utils/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('SplashScene')
export class SplashScene extends Component {

    async start() {
        if(sys.isNative){
            GameUtils.init();
            this.scheduleOnce(() => {
                director.preloadScene("AppGameScene");
                this.goAppGameScene();
                // this.startInit();
            }, 1)
        }else{
            this.goAppGameScene();
        }
    }

    async startInit() {
        let result = await GameUtils.SDKInit();
        if (result.result == 0) {
            this.goAppGameScene();
        } else {
            this.scheduleOnce(() => {
                this.startInit();
            }, 1)
        }
    }

    private goAppGameScene() {
        director.loadScene("AppGameScene");
    }

}

