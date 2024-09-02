import { EditBox, Label, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { BankCardUtils } from "../../../../../Piter.Framework/UIKit/Util/BankCardUitls";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameEvent } from "../../../model/event/GameEvent";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { UserSafeSettingPanel } from "../user/UserSafeSettingPanel";
import { BaseEvent } from "../../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
const { ccclass, property } = _decorator;
@ccclass('BankAddPanel')
export class BankAddPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "bank/prefabs/BankAddPanel";

    protected static className = "BankAddPanel";

    private lockReq: boolean = false;
    @PiterDirector.AUTO_BIND(Label)
    AT_nameLabel: Label

    @PiterDirector.AUTO_BIND(EditBox)
    AT_CardEdit: EditBox

    public flushGold() {
        this.AT_nameLabel.string = GamePlayerManager.instance.player.realName;
    }

    public createChildren(): void {
        super.createChildren();
        this.AT_nameLabel.string = GamePlayerManager.instance.player.realName;
    }

    flushUI() {
        this.AT_nameLabel.string = GamePlayerManager.instance.player.realName;
    }

    AT_BackBtnTouch() {
        Global.UI.closeView(BankAddPanel);
    }

    async AT_EnterBtnTouch() {
        if (!GamePlayerManager.instance.player.realName) {
            return Global.UI.openView(UserSafeSettingPanel);
        }
        let card = this.AT_CardEdit.string;
        // let name = this.AT_nameLabel.string;
        // if (!ValidateUtils.isChineseName(name)) {
        //     DefaultToast.instance.showText("姓名格式错误");
        //     return;
        // }
        if (card.length >= 25 || card.length < 15) {
            DefaultToast.instance.showText("请输入正确的银行卡号");
            return;
        }
        let cardInfo = null;
        try {
            cardInfo = BankCardUtils.getBankInfoByCardNo(card)
        } catch (error) {
            cardInfo = null;
        }
        if (!cardInfo) {
            let serverBack = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/bank-addition", {
                bankCardNum: card
            });
            if (serverBack.code == 200) {
                if (serverBack.data) {
                    cardInfo = {
                        bankName: serverBack.data.bankName,
                        bankCode: serverBack.data.bankCode,
                        cardType: serverBack.data.cardType,
                        cardTypeName: serverBack.data.cardTypeName
                    }
                }
            }
            if (!cardInfo) {
                DefaultToast.instance.showText("未查询到银行信息,请联系在线客服添加.");
                return;
            }
        }
        let withdrawMethod = await GamePlayerManager.instance.getMineWithdrawMethodByType(0);
        let data = {
            type: 0,
            realName: GamePlayerManager.instance.player.realName,
            provider: cardInfo.bankCode,
            providerName: cardInfo.bankName,
            notes: JSON.stringify(cardInfo),
            accountAddr: card,
            isdefault: withdrawMethod.length == 0 ? 1 : 0
        }
        if (this.lockReq) {
            return;
        }
        this.lockReq = true;
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/cash-account-add", data, true);
        if (resp.code == 200) {
            DefaultToast.instance.showText("添加成功", resp.msg);
            let all = await GamePlayerManager.instance.getMineWithdrawMethod();
            all.push(resp.data);
            Global.EVENT.dispatchEvent(GameEvent.WITH_METHOD_UPDATE);
            Global.UI.closeView(BankAddPanel)
        } else {
            this.lockReq = false;
            DefaultToast.instance.showText(resp.msg)
        }
    }
}