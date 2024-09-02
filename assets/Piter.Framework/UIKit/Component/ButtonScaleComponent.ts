import { Button, Component, Node, _decorator } from "cc";
import { Callback } from "../../BaseKit/Data/Callback";
import { SOUND_CONST_URL } from "../../BaseKit/Sound/BaseSoundComponent";
import Global from "../../PiterGlobal";

/**
 * 
 */
const { ccclass, property } = _decorator;

@ccclass('ButtonScaleComponent')
export class ButtonScaleComponent extends Component {
    protected btn: Button = null;

    protected isDisabled: boolean;
    onLoad(): void {
        this.btn = this.node.getComponent(Button);
        if (!this.btn) {
            this.btn = this.node.addComponent(Button);
        }
        this.btn.transition = Button.Transition.SCALE;
        this.btn.zoomScale = 1.05;
        this.btn.duration = 0.1;
        this.btn.interactable = true;
    }

    private callback: Callback;
    public addTouchEvent(callback: Callback) {
        this.callback = callback
        this.node.on(Node.EventType.TOUCH_END, this.onTouchTap, this);
    }

    public setDisable(b: boolean) {
        this.isDisabled = b;
        if (b == true) {
            this.btn.transition = Button.Transition.NONE;
        } else {
            this.btn.transition = Button.Transition.SCALE;
        }
    }

    public onTouchTap() {
        if (this.isDisabled) return;
        if (this.node.name == "AT_closeBtn" || this.node.name == "AT_CloseBtn" || this.node.name == "AT_CancelBtn" || this.node.name == "AT_cancelBtn") {
            // Global.SOUND.playEffect(SOUND_CONST_URL.CLOSE_BTN)
        } else if (SOUND_CONST_URL.CLICK_BTN) {
            //播放点击音效
            Global.SOUND.playEffect(SOUND_CONST_URL.CLICK_BTN)
        }
        this.callback.bindCallback();
    }
}