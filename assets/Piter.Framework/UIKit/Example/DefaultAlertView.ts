import { _decorator, Component, Node, BlockInputEvents, Button, Camera, isValid, Label, v2, UITransform, Vec3 } from 'cc';
import { PiterDirector } from '../../PiterDirector';
import Global from '../../PiterGlobal';
import PiterPanel from '../Base/PiterPanel';
const { ccclass, property } = _decorator;

@ccclass("DefaultAlertView")
export class DefaultAlertView extends PiterPanel {

    public static prefabUrl = "prefabs/DefaultAlertShuView";

    public static className = "DefaultAlertView";

    @PiterDirector.AUTO_BIND(Button)
    AT_EnterBtn: Button;

    @PiterDirector.AUTO_BIND(Button)
    AT_CacelBtn: Button

    @PiterDirector.AUTO_BIND(Label)
    AT_ContentLabel: Label

    @PiterDirector.AUTO_BIND(Label)
    AT_EnterLabel: Label;

    @PiterDirector.AUTO_BIND(Label)
    AT_CacelLabel: Label;

    public createChildren() {
        super.createChildren();
        this.AT_ContentLabel.string = this.tipsText;
        if (this.onlyOkBtn) {
            this.AT_EnterBtn.node.position = new Vec3(0, this.AT_EnterBtn.node.position.y);
            this.AT_EnterBtn.node.active = true;
            this.AT_CacelBtn.node.active = false;
        } else {
            // this.AT_EnterBtn.node.position = new Vec3(-132, this.AT_EnterBtn.node.position.y);
            this.AT_EnterBtn.node.active = true;
            this.AT_CacelBtn.node.active = true;
        }
        if (this.okText) {
            this.AT_EnterLabel.string = this.okText;
        }
        if (this.noText) {
            this.AT_CacelLabel.string = this.noText;
        }
    }

    private tipsText: string;
    private onlyOkBtn: boolean;
    private okCallback: Function;
    private noCallback: Function;
    private okText: string;
    private noText: string;
    public init(params) {
        this.tipsText = params.tips;
        this.okCallback = params.okCallback || null;
        this.noCallback = params.noCallback || null;
        this.onlyOkBtn = params.onlyOkBtn || false;
        this.okText = params.okText || null;
        this.noText = params.noText || null;
    }

    public AT_EnterBtnTouch() {
        if (this.okCallback) {
            this.okCallback();
        }
        this.AT_EnterBtn.interactable = this.AT_CacelBtn.interactable = false;
        Global.UI.closeView(DefaultAlertView);
    }

    public AT_CacelBtnTouch() {
        if (this.noCallback) {
            this.noCallback();
        }
        this.AT_EnterBtn.interactable = this.AT_CacelBtn.interactable = false;
        Global.UI.closeView(DefaultAlertView);
    }


    public static addAlertDiy(param, okCallback = null, noCallback = null, onlyOkBtn = true) {
        if (!onlyOkBtn) {
            onlyOkBtn = false;
        }
        Global.UI.openView(DefaultAlertView, {
            title: param.title,
            okText: param.okText,
            noText: param.noText,
            tips: param.content,
            okCallback: okCallback,
            noCallback: noCallback,
            onlyOkBtn: onlyOkBtn
        })
    }

    public static addAlert(content: number | string, okCallback = null, noCallback = null, onlyOkBtn = true) {
        if (!onlyOkBtn) {
            onlyOkBtn = false;
        }
        if (typeof (content) == "number") {
            content = Global.LANG.getLang(content);
        }
        Global.UI.openView(DefaultAlertView, {
            tips: content,
            okCallback: okCallback,
            noCallback: noCallback,
            onlyOkBtn: onlyOkBtn
        })
    }

    public static addOnlyAlert(content, okCallback = null) {
        if (typeof (content) == "number") {
            content = Global.LANG.getLang(content);
        }
        Global.UI.openView(DefaultAlertView, {
            tips: content,
            okCallback: okCallback,
            noCallback: null,
            onlyOkBtn: true
        })
    }


    public static addLangCodeAlert(code: number, okCallback = null) {
        Global.UI.openView(DefaultAlertView, {
            tips: Global.LANG.getLang(code),
            okCallback: okCallback,
            noCallback: null,
            onlyOkBtn: true
        })
    }

    public static addErrorCodeAlert(errorCode: number, okCallback = null) {
        Global.UI.openView(DefaultAlertView, {
            tips: Global.LANG.getLang(errorCode),
            okCallback: okCallback,
            noCallback: null,
            onlyOkBtn: true
        })
    }

    closeView() {
        this.onRemoved();
        this.node.destroy();
    }
}