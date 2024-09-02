import { instantiate, Prefab } from "cc";
import Global from "../PiterGlobal";
import { UIResConfig } from "../UIKit/Base/PiterView";
import { RotationLoadingView } from "./RotationLoadingView";

/**
 * 资源加载
 */
export class RESLoading {

    private static _instance: RESLoading = null;

    private view: RotationLoadingView;

    public constructor() {
        if (RESLoading._instance) {
            throw new Error("SceneLoading使用单例");
        }
    }

    public static get instance(): RESLoading {
        if (!RESLoading._instance) {
            RESLoading._instance = new RESLoading();
        }
        return RESLoading._instance;
    }

    public async loadGroup(groups: string[], loaded: Function) {
        if (!this.view) {
            await this.createView();
        }
        this.view.node.parent = Global.UI.uIRoot.loadingLayer;
        this.view.loadGroup(groups, loaded)
    }


    public async loadBundleDirs(uiResConfig: UIResConfig, loaded: Function) {
        if (!this.view) {
            await this.createView();
        }
        this.view.node.parent = Global.UI.uIRoot.loadingLayer;
        this.view.loadBundleDirs(uiResConfig, loaded)
    }



    private createView() {
        return new Promise(async (reso, rej) => {
            let preUrl = "prefabs/RESLoadingHengView";
            if (Global.UI.currentModel == 2) {
                preUrl = "prefabs/RESLoadingShuView";
            }
            Global.RES.loadAsset(preUrl, Prefab, (prefab) => {
                let view = instantiate(prefab);
                this.view = view.getComponent(RotationLoadingView);
                reso(this.view);
            })
        })
    }

}