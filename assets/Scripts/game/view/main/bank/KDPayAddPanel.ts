import { _decorator } from "cc";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
const { ccclass, property } = _decorator;
@ccclass('KDPayAddPanel')
export class KDPayAddPanel extends PiterUI {

    protected static prefabUrl = "bank/prefabs/KDPayAddPanel";

    protected static className = "KDPayAddPanel";

    protected lockReq: boolean = false;

    protected curSelectType: string = "kdpay"

    protected cardType: number = 5;

    protected mineClass: any = KDPayAddPanel;

}