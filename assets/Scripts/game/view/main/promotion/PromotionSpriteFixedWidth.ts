import { UITransform } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PromotionSpriteFixedWidth')
export class PromotionSpriteFixedWidth extends Component {
    @property({ type: String })
    inputType: string = "";

    protected onLoad(): void {

    }

    start() {
        // let width = this.node.getComponent(UITransform).width;
        let scremWidth = view.getVisibleSize().width;
        let widthoffset = (scremWidth - view.getDesignResolutionSize().width)
        if (this.inputType == "0") {
            this.node.getComponent(UITransform).width += widthoffset;
        } 
        // else if (this.inputType == "1") {
        //     let posx = this.node.getPosition().x;
        //     posx += widthoffset / 2;
        //     this.node.setPosition(posx, 0);
        // }

    }

    update(deltaTime: number) {

    }
}


