import { Component, EditBox, Node, Sprite, _decorator } from "cc";
import { ImageUtils } from "../../../Piter.Framework/UIKit/Util/ImageUtils";

const { ccclass, property } = _decorator;

@ccclass('GameCheckMMComp')
export class GameCheckMMComp extends Component {
    @property(Node)
    editbox: Node = null;

    onLoad(){

    }

    protected onDestroy(): void {
        
    }

    onSeePassWordClick(){
        let _editState = this.editbox.getComponent(EditBox).inputFlag;
        if (_editState == 0) {
            this.editbox.getComponent(EditBox).inputFlag = 5;
            ImageUtils.showImage(this.node.getChildByName("login_see_password").getComponent(Sprite), "login/res/login_see_password2")
        } else {
            this.editbox.getComponent(EditBox).inputFlag = 0;
            ImageUtils.showImage(this.node.getChildByName("login_see_password").getComponent(Sprite), "login/res/login_see_password")
        }
    }
}