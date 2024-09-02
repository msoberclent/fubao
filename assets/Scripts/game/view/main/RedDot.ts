import { CCString, Component, Node, _decorator } from "cc";
import { BaseEvent } from "../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import Global from "../../../../Piter.Framework/PiterGlobal";

const { ccclass, property } = _decorator;
@ccclass('RedDot')
export class RedDot extends Component {
    @property({ type: CCString })
    type: string = "";
    @property(Node)
    img: Node = null;

    protected onLoad(): void {
        Global.EVENT.on(BaseEvent.RED_DOT_FLUSH, this.showData, this);
    }

    protected onDestroy(): void {
        Global.EVENT.off(BaseEvent.RED_DOT_FLUSH, this.showData, this);
    }

    showData(msg) {
        if (!msg) {
            this.img.active = false;
            return;
        }
        if (this.type == "MAIL") {
            if (msg[`MAIL`] > 0) {
                this.img.active = true;
                // Global.SOUND.playEffectPauseMusic(10, "back/sound/xinyoujian", 5);
            } else {
                this.img.active = false
            }
        } else if (msg[this.type] > 0) {
            this.img.active = true;
        } else {
            this.img.active = false;
        }
    }

}