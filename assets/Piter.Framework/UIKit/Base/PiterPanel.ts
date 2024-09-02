
import { BlockInputEvents, Node, UIOpacity, Vec3, _decorator, easing, tween, v3 } from 'cc';
import { PiterDirector } from '../../PiterDirector';
import PiterView from './PiterView';
const { ccclass, property } = _decorator;

@ccclass
export default abstract class PiterPanel extends PiterView {

    @property({ type: Boolean, tooltip: '是否播放弹出动画', })
    protected bShowAnim: boolean = true;

    protected maskNode: Node;

    protected contentNode: Node;

    protected static layerName = "panel";

    protected defaultScaleVal: Vec3;

    protected defaultPos: Vec3;

    protected panelPopModel = ExpodeMode.sacle_back_easeOut;

    createChildren() {
        super.createChildren();
        this.contentNode = this.node.getChildByName("contentNode");
        if (!this.contentNode.getComponent(UIOpacity)) {
            this.contentNode.addComponent(UIOpacity)
        }

    }

    start() {
        super.start();
        this.maskNode = this.node.getChildByName("maskNode");
        this.defaultScaleVal = this.contentNode.scale.clone();
        this.defaultPos = this.contentNode.position.clone();
        if (this.maskNode) {
            this.maskNode.addComponent(BlockInputEvents);
        }
        if (this.panelPopModel == ExpodeMode.opacity_fade_out) {
            this.contentNode.getComponent(UIOpacity).opacity = 0;
        }
        //约定panel prefab根节点下需要 存在 maskNode, contentNode
        if (this.bShowAnim) {
            this.startAni();
        }
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_CloseBtn: Node;

    AT_CloseBtnTouch() {

    }

    startAni() {
        if (this.panelPopModel == ExpodeMode.opacity_fade_out) {
            tween(this.contentNode.getComponent(UIOpacity)).to(0.65, {
                opacity: 255
            }, { easing: easing.expoOut }).start();
        } else if (this.panelPopModel == ExpodeMode.scale_expoOut) {
            this.contentNode.setScale(v3(this.defaultScaleVal.x * 0.75, this.defaultScaleVal.y * 0.75));
            tween(this.contentNode).to(0.35, {
                scale: this.defaultScaleVal
            }, { easing: easing.expoOut }).start();
        } else if (this.panelPopModel == ExpodeMode.sacle_back_easeOut) {
            this.contentNode.setScale(v3(this.defaultScaleVal.x * 0.75, this.defaultScaleVal.y * 0.75));
            tween(this.contentNode).to(0.35, {
                scale: this.defaultScaleVal
            }, { easing: easing.backOut }).start();
        } else if (this.panelPopModel == ExpodeMode.circle_expoOut) {

        }
        if (this.maskNode) {
            let maskOp = this.maskNode.getComponent(UIOpacity);
            if (!maskOp) {
                maskOp = this.maskNode.addComponent(UIOpacity);
            }
            if (maskOp) {
                let beforeValue = 225 * 0.7 //maskOp.opacity;
                maskOp.opacity = 0;
                tween(maskOp).delay(0.15).to(0.35, {
                    opacity: beforeValue
                }, { easing: easing.quadOut }).start();
            }
        }
    }

    private isRunClose: boolean = false;
    closeView() {
        this.contentNode.addComponent(UIOpacity).opacity = 0;
        // if (this.bShowAnim) {
        //     if (this.isRunClose) {
        //         return;
        //     }
        //     this.isRunClose = true;
        //     tween(this.contentNode).to(0.3, {
        //         scale: v3(this.defaultScaleVal.x - 0.2, this.defaultScaleVal.y - 0.2)
        //     }, { easing: easing.expoIn }).call(() => {
        //         this.onRemoved();
        //         this.node.destroy();
        //         this.isRunClose = false;
        //     }).start();
        //     const uiOpacity = this.maskNode.getComponent(UIOpacity);
        //     tween(uiOpacity).to(0.3, {
        //         opacity: 0
        //     }).start();

        // } else {
        this.onRemoved();
        this.node.destroy();
        // }
    }
}
export enum ExpodeMode {
    scale_expoOut = "scale_expoOut",
    opacity_fade_out = "opacity_fade_out",
    sacle_back_easeOut = "sacle_back_easeOut",
    circle_expoOut = "circle_expoOut"
}
