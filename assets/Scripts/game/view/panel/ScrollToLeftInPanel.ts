import { Node, Widget, _decorator, tween, v3 } from 'cc';
import { PageViewPanel } from './PageViewPanel';
const { ccclass, property } = _decorator;

@ccclass('ScrollToLeftInPanel')
export class ScrollToLeftInPanel extends PageViewPanel {

    protected maskNode: Node;

    protected contentNode: Node;

    protected static layerName = "panel";

    createChildren() {
        super.createChildren();
        this.startAni();
    }

    onLoad() {
        super.onLoad();
        this.contentNode = this.node.getChildByName("contentNode");
        this.contentNode.getComponent(Widget).left = 720;
        this.contentNode.getComponent(Widget).right = -720;
        this.contentNode.getComponent(Widget).updateAlignment();
    }

    startAni() {
        tween(this.contentNode).by(0.25, {
            position: v3(-720, 0, 0)
        }, {
            easing: 'sineIn'
        }).call(() => {
            this.contentNode.getComponent(Widget).left = 0;
            this.contentNode.getComponent(Widget).right = 0;
        }).start();
    }

    closeView() {
        tween(this.contentNode).by(0.25, {
            position: v3(720, 0, 0)
        }, {
            easing: 'sineOut'
        }).call(() => {
            this.onRemoved();
            this.node.destroy();
        }).start()
    }
}

