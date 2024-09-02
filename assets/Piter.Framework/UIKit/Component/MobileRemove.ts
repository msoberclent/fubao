import { Button, Component, Node, Sprite, SpriteFrame, sys, _decorator } from "cc";

/**
 * 
 */
const { ccclass, property } = _decorator;

@ccclass('MobileRemove')
export class MobileRemove extends Component {

    onLoad(): void {
        if (sys.isMobile || sys.isNative) {
            this.node.parent = null;
        }
    }
}