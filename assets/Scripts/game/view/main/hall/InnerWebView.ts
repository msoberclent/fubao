
const { ccclass, property } = _decorator;

import { Node, UIOpacity, _decorator, sys } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterView from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { ServerConfig } from "../../../constant/ServerConst";
import { game } from "cc";
import { GameUtils } from "../../../utils/GameUtils";
import { WebGameUtils } from "../../../../webutils/WebGameUtils";
import { WebView } from "cc";


@ccclass('InnerWebView')
export class InnerWebView extends PiterView {
    protected static prefabUrl = "hall/prefabs/InnerWebView";

    protected static className = "InnerWebView";

    @PiterDirector.AUTO_BIND(Node)
    AT_CloseBtn: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_WebView: Node = null;

    public createChildren() {
        super.createChildren();
        if (this.paramsData.type == 1) {
            this.AT_WebView.getComponent(WebView).url = `https://tx.tx89.fun/h5/?url=https://tx.tx89.fun&userId=` + Global.PLAYER.player.simpleUser.id;
        } else {
            this.AT_WebView.active = false;
        }
    }

    onWebViewChanged(e, data) {
    }

    AT_closeBtnTouch() {
        this.AT_WebView.destroy();
        Global.UI.closeView(InnerWebView);
    }
}
