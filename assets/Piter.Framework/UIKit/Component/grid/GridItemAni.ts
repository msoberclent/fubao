import { UIOpacity } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Label, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

/** 数据表格动画组件 */
@ccclass('GridItemAni')
export class GridItemAni extends Component {

    animationType: number;

    @property
    animationTime: number = 0.2;

    @property
    animationDelayTime: number = 0.05;
    public startAnimation(index: number) {
        let uiOpacity = this.node.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = this.node.addComponent(UIOpacity);
        }
        uiOpacity.opacity = 0;
        tween(uiOpacity).delay(this.animationDelayTime * index).to(this.animationTime, {
            opacity: 255
        }).start();
    }
}