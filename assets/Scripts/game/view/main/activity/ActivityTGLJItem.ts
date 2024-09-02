import { Component, Sprite, _decorator } from "cc";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";

const { ccclass, property } = _decorator;
@ccclass('ActivityTGLJItem')
export class ActivityTGLJItem extends Component {
    updateItem(data, idx) {
        if (idx % 2 == 0) {
            ImageUtils.showImage(this.node.getComponent(Sprite), "activity/res/tglj_2");
        }
        // this.node.getChildByName("id").getComponent(Label) = 
        // this.node.getChildByName("je").getComponent(Label) = 
        // this.node.getChildByName("sj").getComponent(Label) = 
    }
}