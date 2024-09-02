import { WebView, _decorator } from "cc";
import NetLoadingView from "../../../../../Piter.Framework/NetKit/NetLoadingView";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterView from "../../../../../Piter.Framework/UIKit/Base/PiterView";
const { ccclass, property } = _decorator;
@ccclass('KeFuWebViewPanel')
export class KeFuWebViewPanel extends PiterView {

    protected static prefabUrl = "prefabs/kefu/KeFuWebViewPanel";

    protected static className = "KeFuWebViewPanel";

    @PiterDirector.AUTO_BIND(WebView)
    AT_WebView: WebView = null;

    public createChildren(): void {
        super.createChildren();
        NetLoadingView.instance.show(`KeFuWebViewPanel`);
        this.AT_WebView.url = this.paramsData.url;
        this.scheduleOnce(() => {
            NetLoadingView.instance.hide(`KeFuWebViewPanel 2`);
        }, 2)
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(KeFuWebViewPanel);
    }
}