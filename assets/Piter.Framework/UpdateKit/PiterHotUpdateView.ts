
import { Component, Label, Node, Sprite, _decorator, director, native, sys } from 'cc';
import Global from '../PiterGlobal';
import { PiterHotUpdate } from './PiterHotUpdate';
import { DefaultToast } from '../UIKit/Example/DefaultToast';
const { ccclass, property } = _decorator;

/**
 * 进度条加载模式
 */
@ccclass('PiterHotUpdateView')
export class PiterHotUpdateView extends Component {

    @property(Label)
    AT_ClientVersionLabel: Label;

    @property(Sprite)
    AT_loadingFill: Sprite = null;

    @property(Node)
    AT_loadingGroup: Node = null;

    @property(Label)
    AT_TipsLabel: Label = null;

    start() {
        this.showClientInfo();
        // "正在获取最新资源,请等待"
        this.AT_loadingGroup.active = false;
        this.AT_TipsLabel.string = "游戏正在加载中"//Global.LANG.getLang(1005);
        DefaultToast.instance.showText("正在更新资源中..");
    }

    public startHotupdateView() {
        this.scheduleOnce(() => {
            this.node.getComponent(PiterHotUpdate).startHotUpdate();
            this.node.getComponent(PiterHotUpdate).checkUpdate();
        }, 0.1);
    }

    onHotUpdateFinish(code) {
        if (code == 0) {
            this.onUpdateFinish();
        } else {
            // this.labelTips.string = LanguageManager.getLang(1);
        }
    }

    onHotUpdateRate(data) {
        // if (!this.AT_loadingFill.node.active) {
        //     this.AT_loadingFill.node.active = true;
        // }
        // this.AT_loadingFill.fillRange = data.percent;
        if(data && data.percent){
            let template = `正在更新资源${Math.floor(data.percent * 100)}%`;
            this.AT_TipsLabel.string = template
        }
    }

    //更新完成
    onUpdateFinish() {
        director.emit("HotUpdateSuccess");
        // this.labelTips.string = `${LanguageManager.getLang(3)}`;
        this.AT_loadingFill.node.parent.active = false;
    }

    onEnable() {
        director.on('HotUpdateFinish', this.onHotUpdateFinish, this);
        director.on('HotUpdateRate', this.onHotUpdateRate, this);
    }

    onDisable() {
        director.off('HotUpdateFinish', this.onHotUpdateFinish, this);
        director.off('HotUpdateRate', this.onHotUpdateRate, this);
    }

    /**
     * 展示下载中的错误
     * @param errorCode 
     */
    public showUpdateError(errorCode) {
        switch (errorCode) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // `没有找到热更新文件`
                this.AT_TipsLabel.string = Global.LANG.getLang(1007);
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                this.AT_TipsLabel.string = Global.LANG.getLang(1008) + ".";

                break;
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                //下载热更新文件失败
                this.AT_TipsLabel.string = Global.LANG.getLang(1008) + "!";
                if (sys.os == sys.OS.IOS) {
                    let url = this.node.getComponent(PiterHotUpdate)._assetsManager.getLocalManifest().getPackageUrl()
                    this.AT_TipsLabel.string = url + " !! ";
                }
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                // 当前游戏为最新版本.
                this.AT_TipsLabel.string = Global.LANG.getLang(1009);
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                // 游戏更新完成.马上进入游戏
                this.AT_TipsLabel.string = Global.LANG.getLang(1010);
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
            case native.EventAssetsManager.ERROR_UPDATING:
            case native.EventAssetsManager.UPDATE_FAILED:
                // `更新失败,请重启APP再次尝试`
                this.scheduleOnce(() => {
                    this.AT_TipsLabel.string = "正在重新尝试更新";
                    this.node.getComponent(PiterHotUpdate).checkUpdate();
                }, 1);
                this.AT_TipsLabel.string = Global.LANG.getLang(1011);;
                break;
        }
    }


    /**
     * 展示检查错误的代码
     * @param errorCode 
     */
    public showCheckError(errorCode) {
        switch (errorCode) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // 没有找到热更新文件
                this.AT_TipsLabel.string = Global.LANG.getLang(1007);
                break;
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                //下载热更新文件失败
                this.AT_TipsLabel.string = Global.LANG.getLang(1008) + "!";
                if (sys.os == sys.OS.IOS) {
                    let url = this.node.getComponent(PiterHotUpdate)._assetsManager.getLocalManifest().getPackageUrl()
                    this.AT_TipsLabel.string = url + " !! ";
                }
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.AT_TipsLabel.string = "";//Global.LANG.getLang(1009);
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                this.AT_TipsLabel.string = "检测到新版本,即将开始更新"//Global.LANG.getLang(1012);
                break;
            default:
                // 异常错误(code=${1})
                this.scheduleOnce(() => {
                    this.AT_TipsLabel.string = "正在重新尝试更新";
                    this.node.getComponent(PiterHotUpdate).checkUpdate();
                }, 1);
                this.AT_TipsLabel.string = Global.LANG.getLangByJson(1013, {
                    1: errorCode
                });
                return;
        }
    }

    private getKBSize(size) {
        return Math.ceil(size / 1024);
    }

    public showFoundNewVersion(size) {
        // `发现新版本.大约${Math.ceil(size / 1024)}KB`;
        this.AT_loadingGroup.active = true;
        this.AT_TipsLabel.string = "发现新版本即将开始更新,请勿关闭游戏";
        //  Global.LANG.getLangByJson(1014, {
        //     1: Math.ceil(size / 1024)
        // });
        this.scheduleOnce(() => {
            this.node.getComponent(PiterHotUpdate).hotUpdate();
        }, 0.1)
    }

    public showClientVersion() {
        // this.AT_ClientVersionLabel.string = "version" + Global.VERSION.CLIENT;
    }

    showClientInfo() {
    }




};
