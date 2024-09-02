import { Button, Component, Node, Sprite, _decorator } from "cc";
import { Callback } from "../../BaseKit/Data/Callback";
import { SOUND_CONST_URL } from "../../BaseKit/Sound/BaseSoundComponent";
import Global from "../../PiterGlobal";

/**
 * 
 */
const { ccclass, property } = _decorator;

@ccclass('ToggleButtonComponent')
export class ToggleButtonComponent extends Component {

    @property({
        type: Sprite
    })
    onSprite: Sprite = null;

    @property({
        type: Sprite
    })
    offSprite: Sprite = null;

    @property
    status: boolean = false;

    onLoad() {
        this.setStatus(this.status);
    }

    private callback: Callback;
    public addTouchEvent(callback: Callback) {
        this.callback = callback
        this.node.on(Node.EventType.TOUCH_END, this.onTouchTap, this);
    }

    public changeStatus() {
        this.status = !this.status
        this.onSprite.node.active = this.status;
        this.offSprite.node.active = !this.status

        return this.status;
    }

    public setStatus(status: boolean) {
        this.status = status
        this.onSprite.node.active = this.status;
        this.offSprite.node.active = !this.status
    }

    public onTouchTap() {
        if (SOUND_CONST_URL.CLICK_BTN) {
            //播放点击音效
            Global.SOUND.playEffect(SOUND_CONST_URL.CLICK_BTN)
        }
        this.callback.bindCallback();
    }


    onFocusInEditor() {
        if (CC_EDITOR) {
            if (this.offSprite) {
                this.offSprite.node.active = !this.status;
            }
            if (this.onSprite) {
                this.onSprite.node.active = this.status;
            }
        }
    }

    onLostFocusInEditor() {
        if (CC_EDITOR) {
            if (this.offSprite) {
                this.offSprite.node.active = !this.status;
            }
            if (this.onSprite) {
                this.onSprite.node.active = this.status;
            }
        }
    }
}