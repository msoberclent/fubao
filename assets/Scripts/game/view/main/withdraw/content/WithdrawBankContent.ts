import { EditBox, Label, Node, Sprite, _decorator, instantiate } from "cc";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DefaultAlertView } from "../../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { BankCardUtils } from "../../../../../../Piter.Framework/UIKit/Util/BankCardUitls";
import { ImageUtils } from "../../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ServerConfig } from "../../../../constant/ServerConst";
import { GamePlayerManager } from "../../../../manager/GamePlayerManager";
import { WithdrawMethodItem } from "../../../../message/GameMessage";
import { GameEvent } from "../../../../model/event/GameEvent";
import { BankAddPanel } from "../../bank/BankAddPanel";
import { SafeModifyXJMMPanel } from "../../secretBox/SafeModifyXJMMPanel";
import { WithdrawComfirmPanel } from "../WithdrawComfirmPanel";
import { WithdrawConfig, WithdrawContent } from "./WithdrawContent";

const { ccclass, property } = _decorator;
@ccclass('WithdrawBankContent')
export class WithdrawBankContent extends PiterUI {

  root: WithdrawContent;
  config = null;
  onInit(root, config) {
    this.root = root;
    this.withdrawConfig = config;
    this.onShowUI();
  }

  public onAdded(): void {
    super.onAdded();
    // Global.EVENT.on(GameEvent.BANK_ITEM_SELECT, this.changeBankItem, this);
    Global.EVENT.on(GameEvent.WITH_METHOD_UPDATE, this.onShowUI, this)
  }

  public onRemoved(): void {
    super.onRemoved();
    //   Global.EVENT.off(GameEvent.BANK_ITEM_SELECT, this.changeBankItem, this);
    Global.EVENT.off(GameEvent.WITH_METHOD_UPDATE, this.onShowUI, this)
  }


  @PiterDirector.AUTO_BIND(Node)
  AT_NodCard: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_SelectCard: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_MMEdit: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_CurCard: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_CardItem: Node;



  public withdrawConfig: WithdrawConfig;

  showCardNodeInfo(cardNode: Node, cardData: WithdrawMethodItem) {
    if (cardData.type != 0) {
      return;
    }
    this.AT_CurCard.getComponent(Label).string = JSON.parse(cardData.notes).bankName + "(" + BankCardUtils.jiamiCard(cardData.accountAddr) + ")";
    //   let name = cardNode.getChildByName("name").getComponent(Label);
    //   let value = cardNode.getChildByName("value").getComponent(Label);
    //   if (cardData.notes) {
    //     name.string = JSON.parse(cardData.notes).bankName;
    //   } else {
    //     name.string = "未知"
    //   }
    //   if (cardData.accountAddr) {
    //     value.string = BankCardUtils.jiamiCard(cardData.accountAddr);
    //   } else {
    //     value.string = "未知"
    //   }
    //   let icon = cardNode.getChildByName("icon").getComponent(Sprite);
    //   if (Global.RES.checkHasRES(`bank/res/icon/bank_icon_${cardData.provider}`)) {
    //     ImageUtils.showImage(icon, `bank/res/icon/bank_icon_${cardData.provider}`);
    //   } else {
    //     ImageUtils.showImage(icon, `bank/res/icon/bank_icon_DEFAULT`);
    //   }
  }

  selectCardData: WithdrawMethodItem;
  public changeBankItem(cardNode) {
    this.selectCardData = cardNode.target[`info`];
    this.showCardNodeInfo(this.AT_CurCard, this.selectCardData);
    this.AT_SelectCard.getChildByName("view").active = false;
    // ButtonUtils.setGray(this.AT_WithBankBtn.getComponent(Button), this.selectCardData == null, this.selectCardData == null)
  }

  onShowUI() {
    // super.onShowUI();
    this.showContent();
    this.AT_NumEdit.string = ""
    this.AT_NumEdit.placeholder = `单笔提现最低金额105`
  }

  lockReq: boolean = false;
  async AT_ComfirmBtnTouch() {
    if (!Global.PLAYER.player.payPwdSeted) {
      return DefaultAlertView.addAlert("请先设置现金密码.", () => {
        Global.UI.openView(SafeModifyXJMMPanel)
      }, null, false);
    }
    if (!this.selectCardData) {
      return DefaultAlertView.addOnlyAlert("请先选择提现账户.", null);
    }
    let amount = Number(this.AT_NumEdit.string);
    this.AT_NumEdit.placeholder = `请输入提现金额`
    // if (isNaN(amount) || amount < 105 || amount > 50000) {
    //   DefaultToast.instance.showText("提现范围为105-50000");
    //   return;
    // }
    if (amount > Global.PLAYER.player.gold) {
      DefaultToast.instance.showText("金币不足");
      return;
    }
    // if (amount * GoldUtils.GOLD_RATE_MUL > this.withdrawConfig.amountLimit) {
    //   DefaultToast.instance.showText("您的最大可提现金额为" + GoldUtils.formatGold(this.withdrawConfig.amountLimit));
    //   return;
    // }
    let payPwd = this.AT_MMEdit.getComponent(EditBox).string.trim();
    if (!payPwd) {
      DefaultToast.instance.showText("请输入现金密码.");
      return;
    }
    let reqData = {
      accountId: this.selectCardData.id,
      amount: amount,
      payPwd: payPwd
    }
    Global.UI.openView(WithdrawComfirmPanel, {
      reqData: reqData,
      type: 0,
      withdrawConfig: this.withdrawConfig,
      callback: async () => {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/apply", reqData, true);
        this.lockReq = false;
        if (resp.code == 200) {
          DefaultToast.instance.showText("申请成功", resp.msg)
          this.AT_NumEdit.string = ""
          if (resp.data.limit) {
            // this.AT_CanWithdrawLabel.string = GoldUtils.formatGold(resp.data.limit);
          }
        } else {
          DefaultToast.instance.showText(resp.msg)
        }
      }
    })
  }

  @PiterDirector.AUTO_BIND(EditBox)
  AT_NumEdit: EditBox

  // @PiterDirector.AUTO_BIND(Label)
  // AT_CanWithdrawLabel: Label

  cardDatas: WithdrawMethodItem[]
  async showContent() {
    let withdrawMethod = await GamePlayerManager.instance.getMineWithdrawMethodByType(0);
    this.AT_NodCard.active = withdrawMethod.length == 0
    this.AT_SelectCard.active = !this.AT_NodCard.active;
    // // this.AT_CanWithdrawLabel.string = GoldUtils.formatGold(this.withdrawConfig.amountLimit);
    this.cardDatas = withdrawMethod;
    this.AT_SelectCard.getChildByPath("view/mask/lakai").destroyAllChildren();
    for (let i = 0; i < this.cardDatas.length; i++) {
      let card = this.cardDatas[i];
      let cardNode = instantiate(this.AT_CardItem);
      cardNode.setParent(this.AT_SelectCard.getChildByPath("view/mask/lakai"));
      cardNode.active = true;
      cardNode.getComponentInChildren(Label).string = JSON.parse(card.notes).bankName + "(" + BankCardUtils.jiamiCard(card.accountAddr) + ")";
      cardNode[`info`] = card;
      if (card.isdefault) {
        //   showSuc = true;
        this.selectCardData = cardNode[`info`];
        this.showCardNodeInfo(this.AT_CurCard, this.selectCardData);
        this.AT_SelectCard.getChildByPath("view").active = false;
      }
    }
    // if (!showSuc && withdrawMethod.length > 0) {
    //   this.changeBankItem(this.cardDatas[0]);
    // }
  }

  NodCardTouch() {
    Global.UI.openView(BankAddPanel);
  }

  SelectCardTouch() {
    this.AT_SelectCard.getChildByName("view").active = !this.AT_SelectCard.getChildByName("view").active;
  }

  onSeePassWordClick() {
    let _editState = this.AT_MMEdit.getComponent(EditBox).inputFlag;
    if (_editState == 0) {
      this.AT_MMEdit.getComponent(EditBox).inputFlag = 5;
      ImageUtils.showImage(this.node.getChildByPath("withdraw_content/common_tab_bg3/mminput/seePass/login_see_password").getComponent(Sprite), "login/res/login_see_password2")
    } else {
      this.AT_MMEdit.getComponent(EditBox).inputFlag = 0;
      ImageUtils.showImage(this.node.getChildByPath("withdraw_content/common_tab_bg3/mminput/seePass/login_see_password").getComponent(Sprite), "login/res/login_see_password")
    }
  }
}