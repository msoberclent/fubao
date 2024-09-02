import { _decorator } from "cc";
import Global from "../PiterGlobal";
import PiterView from "../UIKit/Base/PiterView";

const { ccclass, property } = _decorator;

@ccclass
export default class NetLoadingView extends PiterView {
    //需要修改
    public static prefabUrl = "prefabs/GameNetLoading";

    protected static className = "NetLoadingView";

    private static _instance: NetLoadingView = null;

    protected static layerName = "loading";

    public static get instance(): NetLoadingView {
        if (!NetLoadingView._instance) {
            let ui = Global.UI.openViewHasLoad(NetLoadingView) as any;
            NetLoadingView._instance = ui;
        }
        return NetLoadingView._instance;
    }

    public start() {
        super.start();
        NetLoadingView._instance = this;
    }

    public show(whereFrom: string) {
        if (CC_DEBUG) {
            console.log("show: " + whereFrom);
        }
        this.node.active = true;
    }

    public hide(whereFrom: string) {
        if (CC_DEBUG) {
            console.log("hide: " + whereFrom);
        }
        if (this.node.active) {
            this.node.active = false;
        }
    }
}