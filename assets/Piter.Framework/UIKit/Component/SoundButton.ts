import { _decorator, Component, Node } from "cc";
import Global from "../../PiterGlobal";
/**
 * 声音按钮组件(包含 特效和音乐)
 */
const { ccclass, property } = _decorator;
@ccclass('SoundButton')
export class SoundButton extends Component {

    onNode: Node;

    offNode: Node;

    onLoad() {
        this.onNode = this.node.getChildByName("on");
        this.offNode = this.node.getChildByName("off");

        let value = Global.SOUND.musicVolume
        this.onNode.active = (value == 1);
        this.offNode.active = !this.onNode.active

        this.node.on(Node.EventType.TOUCH_END, this.changeValue, this)
    }

    private changeValue() {
        if (this.onNode.active) {
            Global.SOUND.effectVolume = Global.SOUND.musicVolume = 1;
        } else {
            Global.SOUND.effectVolume = Global.SOUND.musicVolume = 0;
        }
        this.onNode.active = (Global.SOUND.musicVolume == 1);
        this.offNode.active = !this.onNode.active
    }

}