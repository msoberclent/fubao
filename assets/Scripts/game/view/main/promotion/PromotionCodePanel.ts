import { EditBox, Node, _decorator, instantiate, v3 } from "cc";
import { Utils } from "../../../../../Piter.Framework/BaseKit/Util/Utils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";

const { ccclass, property } = _decorator;

@ccclass('PromotionCodePanel')
export class PromotionCodePanel extends PiterPanel {
    protected static prefabUrl = "promotion/prefabs/PromotionCodePanel";

    protected static className = "PromotionCodePanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_QRCode: Node;

    url = ""

    public createChildren(): void {
        super.createChildren();
        Utils.QRCreate(this.AT_QRCode, this.url);
    }

    init(param) {
        this.url = param;
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionCodePanel);
    }

}