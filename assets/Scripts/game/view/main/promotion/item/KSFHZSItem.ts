import { Component, Label, _decorator } from 'cc';
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { ButtonSpriteChange } from '../../../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange';
import { PromotionXJXQPanel } from '../PromotionXJXQPanel';
import { ModifyShuiShouPanel } from '../zhishu/ModifyShuiShouPanel';
const { ccclass, property } = _decorator;

@ccclass('KSFHZSItem')
export class KSFHZSItem extends Component {

    itemData: any;

    info: any;

    setItemData(itemData, i, type = 1) {
        if (itemData.weekRecharge < 0) {
            itemData.weekRecharge = 0;
        }
        if (this.node.getComponent(ButtonSpriteChange)) {
            if (i % 2 == 0) {
                this.node.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
            } else {
                this.node.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
            }
        }
        this.itemData = itemData;
        if (type == 1) {
            this.showLabels();
        } else {
            this.showLabels2();
        }

    }


    showLabels2() {
        let labels = [
            { name: "uid", label: "id", desc: "id", divGold: false },
            { name: "directMemberCount", label: "zhishu", desc: "直属人数", divGold: false },
            { name: "teamMemberCount", label: "team", desc: "团队人数", divGold: false },
            { name: "registTime", label: "time", desc: "注册时间", divGold: false },
            { name: "teamFlow", label: "liushui", desc: "流水", divGold: true },
            { name: "teamRecharge", label: "recharge", desc: "充值", divGold: true },
            { name: "loginName", label: "username", desc: "用户名", divGold: true },

            { name: "bucj", label: "nick", desc: "昵称", divGold: true },
            { name: "loginTime", label: "login_time", desc: "登录时间", divGold: false },
            { name: "accountBalance", label: "accountBalance", desc: "账号余额", divGold: true },
            { name: "walletBalance", label: "walletBalance", desc: "钱包余额", divGold: true },

            { name: "memberInfo", label: "level", desc: "会员层级", divGold: false },
        ];
        for (let i = 0; i < labels.length; i++) {
            let item = labels[i];
            let node = this.node.getChildByPath(item.label);
            if (node && item.name) {
                if (item.divGold) {
                    node.getComponent(Label).string = GoldUtils.formatGold(this.itemData[item.name]);
                } else {
                    node.getComponent(Label).string = this.itemData[item.name]
                }
            }
        }
    }

    showLabels() {
        let labels = [
            { name: "uid", label: "id", desc: "id", divGold: false },
            { name: "directMemberCount", label: "zhishu", desc: "直属人数", divGold: false },
            { name: "teamMemberCount", label: "team", desc: "团队人数", divGold: false },
            { name: "registTime", label: "time", desc: "注册时间", divGold: false },
            { name: "flow", label: "liushui", desc: "流水", divGold: true },
            { name: "recharge", label: "recharge", desc: "充值", divGold: true },
            { name: "loginName", label: "username", desc: "用户名", divGold: true },

            { name: "bucj", label: "nick", desc: "昵称", divGold: true },
            { name: "loginTime", label: "login_time", desc: "登录时间", divGold: false },
            { name: "accountBalance", label: "accountBalance", desc: "账号余额", divGold: true },
            { name: "walletBalance", label: "walletBalance", desc: "钱包余额", divGold: true },

            { name: "memberInfo", label: "level", desc: "会员层级", divGold: false },
        ];
        for (let i = 0; i < labels.length; i++) {
            let item = labels[i];
            let node = this.node.getChildByPath(item.label);
            if (node && item.name) {
                if (item.divGold) {
                    node.getComponent(Label).string = GoldUtils.formatGold(this.itemData[item.name]);
                } else {
                    node.getComponent(Label).string = this.itemData[item.name]
                }
            }
        }
    }

    public onLookBtnCall() {
        Global.UI.openView(PromotionXJXQPanel, { info: this.itemData, fanyongInfo: this.info });
    }

    public onModifyShuiShouBtnTouch() {
        Global.UI.openView(ModifyShuiShouPanel, this.info);
    }
}





