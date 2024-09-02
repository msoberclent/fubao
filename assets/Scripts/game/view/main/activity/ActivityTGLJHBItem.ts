import { Component, Label, Sprite, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ActivityTGLJPanel } from "./ActivityTGLJPanel";

const { ccclass, property } = _decorator;
@ccclass('ActivityTGLJHBItem')
export class ActivityTGLJHBItem extends Component {
    root: ActivityTGLJPanel = null;
    updateItem(data, idx) {
        this.node.getChildByName("renshu").getComponent(Label).string = "推广" + (idx + 1) + "人";
        this.node.getChildByName("money").getComponent(Label).string = GoldUtils.formatGold(this.root.packageNum);
        if (idx + 1 <= this.root.curHbIdx) {
            this.node.getChildByName("money").active = true;
            ImageUtils.showImage(this.node.getComponent(Sprite),"activity/res/tglj_hb3");
        }else if(idx + 1 <= this.root.curCanLQIdx){
            this.node.getChildByName("money").active = false;
            ImageUtils.showImage(this.node.getComponent(Sprite),"activity/res/tglj_hb1");
        }else{
            this.node.getChildByName("money").active = false;
            ImageUtils.showImage(this.node.getComponent(Sprite),"activity/res/tglj_hb2");
        }
        // this.node.getChildByName("id").getComponent(Label) = 
        // this.node.getChildByName("je").getComponent(Label) = 
        // this.node.getChildByName("sj").getComponent(Label) = 
    }

    setRoot(root) {
        this.root = root;
    }
}