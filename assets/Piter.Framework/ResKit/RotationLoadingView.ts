import { _decorator, Label } from 'cc';
import Global from '../PiterGlobal';
import PiterView, { UIResConfig } from '../UIKit/Base/PiterView';
const { ccclass, property } = _decorator;

/**
 * 默认内置加载资源
 */
@ccclass('RotationLoadingView')
export class RotationLoadingView extends PiterView {

    protected static prefabUrl = "prefabs/RESLoadingHengView";

    protected static className = "RESLoadingHengView";

    private groupName: string;

    private loadedCallBack: Function;

    @property(Label)
    AT_LoadingText: Label = null;

    public loadGroup(groups: string[], loaded: Function) {
        this.AT_LoadingText.string = "0%";
        this.loadedCallBack = loaded;
        this.node.active = true;
        Global.RES.loadGroup(groups, this.onProgress.bind(this), this.onLoaded.bind(this));
    }


    public loadBundleDirs(uiResConfig: UIResConfig, loaded: Function) {
        this.AT_LoadingText.string = "0%";
        this.loadedCallBack = loaded;
        this.node.active = true;
        Global.RES.loadBundleDirs(uiResConfig.bundleName, uiResConfig.dirNames, this.onProgress.bind(this), this.onLoaded.bind(this));
    }
    

    private onProgress(loaded, total) {
        let percent = Math.floor(loaded / total * 100);
        this.AT_LoadingText.string = `${percent}%`;
    }

    private onLoaded() {
        this.node.active = false;
        this.loadedCallBack && this.loadedCallBack();
    }
}