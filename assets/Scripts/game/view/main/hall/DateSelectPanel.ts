import { Node, _decorator } from "cc";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";


const { ccclass, property } = _decorator;
@ccclass('DateSelectPanel')
export class DateSelectPanel extends PiterPanel {

    protected static prefabUrl = "hall/prefabs/date/DateSelectPanel";

    protected static className = "DateSelectPanel";

    public targetEditNode: Node

    public async createChildren() {
        super.createChildren();
        this.targetEditNode = this.paramsData.editbox;
    }

    AT_CloseBtnTouch() {
        Global.UI.closeView(DateSelectPanel);
    }
}

