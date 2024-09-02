import { _decorator } from "cc";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { PromotionLQJLPanel } from "./PromotionLQJLPanel";
import { PromotionPTBBPanel } from "./PromotionPTBBPanel";

const { ccclass, property } = _decorator;

@ccclass('PromotionRecordPanel')
export class PromotionRecordPanel extends PiterUI {

    AT_LingquBtnTouch() {
        Global.UI.openView(PromotionLQJLPanel);
    }

    AT_BaobiaoBtnTouch() {
        Global.UI.openView(PromotionPTBBPanel);
    }
}