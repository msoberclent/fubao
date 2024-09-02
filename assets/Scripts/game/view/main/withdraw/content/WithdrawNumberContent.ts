import { EditBox, Label, Node, Sprite, _decorator, instantiate } from "cc";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DefaultAlertView } from "../../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ImageUtils } from "../../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ServerConfig } from "../../../../constant/ServerConst";
import { GamePlayerManager } from "../../../../manager/GamePlayerManager";
import { WithdrawMethodItem } from "../../../../message/GameMessage";
import { GameEvent } from "../../../../model/event/GameEvent";
import { SafeModifyXJMMPanel } from "../../secretBox/SafeModifyXJMMPanel";
import { WithdrawComfirmPanel } from "../WithdrawComfirmPanel";
import { WithdrawConfig, WithdrawContent } from "./WithdrawContent";

const { ccclass, property } = _decorator;
@ccclass('WithdrawNumberContent')
export class WithdrawNumberContent extends PiterUI {

  public defaultItemType: Array<number> = [1, 2, 3, 4, 5, 6];
  itemType = 1;
  root: WithdrawContent;

  public onAdded(): void {
    //   super.onAdded();
    //   Global.EVENT.on(GameEvent.BANK_ITEM_SELECT, this.changeItem, this);
    Global.EVENT.on(GameEvent.WITH_METHOD_UPDATE, this.onShowUI, this)
  }

  public onRemoved(): void {
    //   super.onRemoved();
    //   Global.EVENT.off(GameEvent.BANK_ITEM_SELECT, this.changeItem, this);
    Global.EVENT.off(GameEvent.WITH_METHOD_UPDATE, this.onShowUI, this)
  }

  onInit(root, config) {
    this.root = root;
    this.withdrawConfig = config;
    this.onShowUI();
  }

  @PiterDirector.AUTO_BIND(Node)
  AT_SelectCard: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_EnterBtn: Node;

  public withdrawConfig: WithdrawConfig;

  showCardNodeInfo(cardNode: Node, cardData: WithdrawMethodItem) {
    if (this.defaultItemType.indexOf(cardData.type) == -1) {
      return;
    }
    cardNode.getComponent(Label).string = cardData.provider + "(" + cardData.accountAddr + ")";
    // let name = cardNode.getChildByName("name").getComponent(Label);
    // let value = cardNode.getChildByName("value").getComponent(Label);
    // name.string = cardData.provider;
    // value.string = cardData.accountAddr;
  }

  @PiterDirector.AUTO_BIND(Node)
  AT_CurCard: Node;

  selectCardData: WithdrawMethodItem;
  public changeItem(cardNode) {
    this.selectCardData = cardNode.target[`info`];
    this.showCardNodeInfo(this.AT_CurCard, this.selectCardData);
    this.AT_SelectCard.getChildByName("view").active = false;
    this.itemType = this.selectCardData.type;
    // ButtonUtils.setGray(this.AT_EnterBtn.getComponent(Button), this.selectCardData == null, this.selectCardData == null)
  }

  onShowUI() {
    // super.onShowUI();
    this.showContent();
    this.AT_NumEdit.string = ""
    this.AT_NumEdit.placeholder = `单笔提现最低金额100`
  }

  lockReq: boolean = false;
  async AT_ComfirmBtnTouch() {
    if (!Global.PLAYER.player.payPwdSeted) {
      return DefaultAlertView.addAlert("请先设置现金密码.", () => {
        Global.UI.openView(SafeModifyXJMMPanel)
      }, null, false);
    }
    if (!this.selectCardData) {
      return DefaultAlertView.addOnlyAlert("请先选择提现账户.", null);;
    }
    let amount = Number(this.AT_NumEdit.string);
    // if (isNaN(amount) || amount < 105 || amount > 50000) {
    //   DefaultToast.instance.showText("提现范围为105-50000");
    //   return;
    // }
    if (amount > Global.PLAYER.player.gold) {
      DefaultToast.instance.showText("金币不足");
      return;
    }
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
      type: this.itemType,
      withdrawConfig: this.withdrawConfig,
      callback: async () => {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/apply", reqData, true);
        this.lockReq = false;
        if (resp.code == 200) {
          DefaultToast.instance.showText("申请成功", resp.msg)
          this.AT_NumEdit.string = ""
          // if (resp.data.limit) {
          //   this.AT_CanWithdrawLabel.string = GoldUtils.formatGold(resp.data.limit);
          // }
        } else {
          DefaultToast.instance.showText(resp.msg)
        }
      }
    })
    return;
  }


  @PiterDirector.AUTO_BIND(EditBox)
  AT_NumEdit: EditBox

  @PiterDirector.AUTO_BIND(EditBox)
  AT_MMEdit: EditBox

  @PiterDirector.AUTO_BIND(Label)
  AT_CanWithdrawLabel: Label

  @PiterDirector.AUTO_BIND(Node)
  AT_NodCard: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_CardItem: Node;

  cardDatas: WithdrawMethodItem[]
  async showContent() {
    let withdrawMethod = await GamePlayerManager.instance.getMineWithdrawMethodByType(this.defaultItemType);
    this.AT_NodCard.active = withdrawMethod.length == 0
    this.AT_SelectCard.active = !this.AT_NodCard.active;
    // // this.AT_CanWithdrawLabel.string = GoldUtils.formatGold(this.withdrawConfig.amountLimit);
    this.cardDatas = withdrawMethod;
    // let showSuc = false;
    this.AT_SelectCard.getChildByPath("view/mask/lakai").destroyAllChildren();
    for (let i = 0; i < this.cardDatas.length; i++) {
      let card = this.cardDatas[i];
      let cardNode = instantiate(this.AT_CardItem);
      cardNode.setParent(this.AT_SelectCard.getChildByPath("view/mask/lakai"));
      cardNode.active = true;
      cardNode.getComponentInChildren(Label).string = card.provider + "(" + card.accountAddr + ")";
      cardNode[`info`] = card;
      if (card.isdefault) {
        //   showSuc = true;
        this.selectCardData = cardNode[`info`];
        this.itemType = card.type;
        this.showCardNodeInfo(this.AT_CurCard, this.selectCardData);
        this.AT_SelectCard.getChildByPath("view").active = false;
      }
    }
    // if (!showSuc && withdrawMethod.length > 0) {
    //   this.changeItem(this.cardDatas[0]);
    // }
  }

  NodCardTouch() {
    this.root.father.onBtnSwitchPage(null, "3");
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