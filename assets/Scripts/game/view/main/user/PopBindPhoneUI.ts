import { _decorator } from "cc";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";


const { ccclass, property } = _decorator;

@ccclass('PopBindPhoneUI')
export class PopBindPhoneUI extends ScrollToLeftInPanel {
    protected static prefabUrl = "hall/prefabs/PopBindPhoneUI";

    protected static className = "PopBindPhoneUI";

    callfun = null;

    public createChildren(): void {
        super.createChildren();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    // init(paramsData: any): void {
    //     if (paramsData && paramsData.callback) {
    //         this.callfun = paramsData.callback;
    //     }
    // }

    // AT_bindBtnTouch() {
    //     let callback = this.callfun;
    //     Global.UI.openView(BindPhonePanel, {
    //         callback: () => {
    //             callback && callback();
    //         }
    //     });
    //     Global.UI.closeView(PopBindPhoneUI);
    // }

    AT_closeBtnTouch(): void {
        this.callfun && this.callfun();
        Global.UI.closeView(PopBindPhoneUI);
    }

}