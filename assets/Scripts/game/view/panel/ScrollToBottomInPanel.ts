import { Node, UITransform, Widget, _decorator, tween, v3 } from 'cc';
import { PageViewPanel } from './PageViewPanel';
const { ccclass, property } = _decorator;

@ccclass('ScrollToBottomInPanel')
export class ScrollToBottomInPanel extends PageViewPanel {

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
        let trans = this.node.getComponent(UITransform)
        this.contentNode.getComponent(Widget).top = trans.height;
        this.contentNode.getComponent(Widget).bottom = -trans.height;
        this.contentNode.getComponent(Widget).updateAlignment();
    }

    startAni() {
        let trans = this.node.getComponent(UITransform)
        tween(this.contentNode).by(0.25, {
            position: v3(0, trans.height, 0)
        }, {
            easing: 'sineIn'
        }).call(() => {
            this.contentNode.getComponent(Widget).top = 0;
            this.contentNode.getComponent(Widget).bottom = 0;
        }).start();
    }

    closeView() {
        let trans = this.node.getComponent(UITransform)
        tween(this.contentNode).by(0.25, {
            position: v3(0, -trans.height, 0)
        }, {
            easing: 'sineOut'
        }).call(() => {
            this.onRemoved();
            this.node.destroy();
        }).start()
    }
}

