import { EditBox, Enum, Node, _decorator } from "cc";
import { TimeUtils } from "../../../../../Piter.Framework/BaseKit/Util/TimeUtils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DateSelectPanel } from "./DateSelectPanel";
export enum DateSelectType {
    EDITBOX, //输入框
    LABEL //Label
}
Enum(DateSelectType);

const { ccclass, property } = _decorator;
@ccclass('DateSelectNode')
export class DateSelectNode extends PiterUI {
    @property({ type: DateSelectType })
    protected cacuType: DateSelectType = DateSelectType.EDITBOX;

    @property
    initByNow: boolean = true;

    onLoad() {
        super.onLoad();
        if (this.cacuType == DateSelectType.EDITBOX) {
            let editbox = this.node.getComponent(EditBox);
            editbox.enabled = false;
        }
        if (this.initByNow) {
            let editbox = this.node.getComponent(EditBox);
            editbox.string = TimeUtils.dateFormatMS("yyyy-MM-dd", Date.now())
        }
    }

    public initNowTime() {
        let editbox = this.node.getComponent(EditBox);
        editbox.string = TimeUtils.dateFormatMS("yyyy-MM-dd", Date.now())
    }


    onAdded() {
        super.onAdded();
        this.node.on(Node.EventType.TOUCH_END, this.onTouchTap, this);
    }

    onRemoved() {
        super.onRemoved();
        this.node.off(Node.EventType.TOUCH_END, this.onTouchTap, this);
    }

    onTouchTap() {
        if (!this.enabled) {
            return;
        }
        let reqData = {
            type: "normal",
            id: this.node[`_id`],
            editbox: null
        }
        if (this.cacuType == DateSelectType.EDITBOX) {
            let editbox = this.node.getComponent(EditBox);
            reqData.editbox = editbox
            Global.UI.openView(DateSelectPanel, reqData)
        }
    }
}

