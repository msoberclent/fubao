import { Label, Node, _decorator, instantiate } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameEvent } from "../../../model/event/GameEvent";
import { BankAddPanel } from "../bank/BankAddPanel";
import { NumberAddPanel } from "../bank/NumberAddPanel";
import { ThirdPayAddPanel } from "../bank/ThirdPayAddPanel";
import { ZFBAddPanel } from "../bank/ZFBAddPanel";
import { WithdrawAccountItem } from "./WithdrawAccountItem";

const { ccclass, property } = _decorator;
@ccclass('WithdrawAccountPanel')
export class WithdrawAccountPanel extends PiterUI {


    @PiterDirector.AUTO_BIND(Node)
    AT_withdrawAccountSC: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_withdrawMethodSC: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_AddZFBBtn: Node;
    canAddZfb = true;

    accountConfig = [];

    withdrawConfig = null;

    async onInit(config) {
        console.log("onInit 1")
        if (!config) {
            config = await GamePlayerManager.instance.getMineWithdrawGold();
            console.log("onInit 2")
        }
        this.withdrawConfig = config;
        console.log("onInit 3")
        this.accountConfig = await GamePlayerManager.instance.getMineWithdrawMethodByType(this.withdrawConfig.withdrawalOpen);
        if (config.withdrawalOpen.indexOf("7") == -1) {
            this.AT_withdrawMethodSC.getChildByPath("view/layout/AT_AddZFBBtn").active = false;
        }
        if (config.withdrawalOpen.indexOf("1") == -1) {
            this.AT_withdrawMethodSC.getChildByPath("view/layout/AT_AddNumberBtn").active = false;
        }
        if (config.withdrawalOpen.indexOf("0") == -1) {
            this.AT_withdrawMethodSC.getChildByPath("view/layout/AT_AddCardBtn").active = false;
        }
        console.log("onInit ")
    }

    createChildren() {
        super.createChildren();
        this.freshList();
    }

    onAdded() {
        super.onAdded();
        Global.EVENT.on(GameEvent.WITH_METHOD_UPDATE, this.freshList, this)
    }

    onRemoved() {
        super.onRemoved();
        Global.EVENT.off(GameEvent.WITH_METHOD_UPDATE, this.freshList, this)
    }

    async freshList() {
        await this.onInit(this.withdrawConfig);
        this.initList();
    }

    initList() {
        let list = this.AT_withdrawAccountSC.getChildByPath("view/layout");
        for (let i = 0; i < list.children.length; i++) {
            let v = list.children[i];
            v.active = false;
        }
        this.accountConfig.forEach((v) => {
            if (v.type == 7) {
                this.canAddZfb = false;
                this.AT_AddZFBBtn.getChildByName("weibangding").active = false;
                this.AT_AddZFBBtn.getChildByName("name").active = true;
                this.AT_AddZFBBtn.getChildByName("withdraw_shanchu").getComponent(Label).string = "已绑定";
            }
        })
        for (let i = 0; i < this.accountConfig.length; i++) {
            let item = this.AT_withdrawAccountSC.getChildByPath("view/accountItem");
            let v;
            if (list.children.length <= this.accountConfig.length) {
                v = instantiate(item);
                v.setParent(list);
                v.setSiblingIndex(0);
            } else {
                v = list.children[i]
            }
            v.active = true;
            v.getComponent(WithdrawAccountItem).setData(this.accountConfig[i])
        }
    }


    /**
     * 添加数字账户
     */
    AT_AddNumberBtnTouch() {
        Global.UI.openView(NumberAddPanel);
    }

    /**
     * 添加三方账户
     */
    AT_AddThirdBtnTouch() {
        Global.UI.openView(ThirdPayAddPanel, this.withdrawConfig);
    }

    /**
     * 添加银行卡
     */
    AT_AddCardBtnTouch() {
        Global.UI.openView(BankAddPanel);
    }

    /**
     * 添加支付宝
     */
    AT_AddZFBBtnTouch() {
        if (!this.canAddZfb) return;
        Global.UI.openView(ZFBAddPanel);
    }
}