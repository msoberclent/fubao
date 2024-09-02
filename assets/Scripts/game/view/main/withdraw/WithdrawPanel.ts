import { Label, Node, Toggle, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { WithdrawAccountPanel } from "./WithdrawAccountPanel";
import { WithdrawRecordPanel } from "./WithdrawRecordPanel";
import { WithdrawContent } from "./content/WithdrawContent";

const { ccclass, property } = _decorator;
@ccclass('WithdrawPanel')
export class WithdrawPanel extends PiterPanel {

  protected static prefabUrl = "bank/prefabs/WithdrawPanel";

  protected static className = "WithdrawPanel";

  protected static uiResConfig: UIResConfig = {
    bundleName: BundlesInfo.game_main,
    dirNames: [MainDirConst.bank]
  }

  tabIndex: number[];

  @PiterDirector.AUTO_BIND(Node)
  AT_TempNode: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_Tab: Node

  @PiterDirector.AUTO_BIND(Node)
  AT_Content: Node

  @PiterDirector.AUTO_BIND(Node)
  AT_Withdraw: Node

  @PiterDirector.AUTO_BIND(Node)
  AT_Record: Node

  @PiterDirector.AUTO_BIND(Node)
  AT_Account: Node

  @PiterDirector.AUTO_BIND(Node)
  AT_Head: Node
  @PiterDirector.AUTO_BIND(Node)
  AT_withdrawLimit: Node

  withdrawConfig = null;

  public async createChildren() {
    super.createChildren();
    await GamePlayerManager.instance.getMineWithdrawMethod();
    this.withdrawConfig = await GamePlayerManager.instance.getMineWithdrawGold();
    let tabIndex = this.paramsData.tabIndex || "1";
    this.initTabList(tabIndex);
    // Global.SOUND.playEffectPauseMusic(BaseConstant.ONE_DAY_TIME, "back/sound/duihuan_tishi", 6);
    // this.checkHasXJMM();
  }

 

  public async initTabList(tabIndex) {
    let bankOpen = this.withdrawConfig.withdrawalOpen.indexOf("0");
    let zfbOpen = this.withdrawConfig.withdrawalOpen.indexOf("7");
    this.AT_Head.getChildByName("card").active = bankOpen > -1 ? true : false;
    this.AT_Head.getChildByName("numberic").active = true;
    this.AT_Head.getChildByName("zfb").active = zfbOpen > -1 ? true : false;
    this.AT_withdrawLimit.getComponent(Label).string = "还需投入"+GoldUtils.formatGold(this.withdrawConfig.amountLimit)+ "才能提现"
    this.onBtnSwitchPage(null, tabIndex);
  }


  private showContent(contentStr: string) {
    // for (let i = 0; i < this.AT_Content.children.length; i++) {
    //   let child = this.AT_Content.children[i];
    //   if (child.name == contentStr) {
    //     child.active = true;
    //     if (child.getComponent(BaseWithdrawContent)) child.getComponent(BaseWithdrawContent).onShowUI();
    //   } else {
    //     child.active = false;
    //   }
    // }
  }

  onBtnSwitchPage(e, custom) {
    this.AT_Withdraw.active = this.AT_Record.active = this.AT_Account.active = false;
    switch (custom) {
      case "1":
        this.AT_Withdraw.active = true;
        this.AT_Withdraw.getComponent(WithdrawContent).onInit(this, this.withdrawConfig);
        break;
      case "2":
        this.AT_Record.active = true;
        this.AT_Record.getChildByName("WithdrawRecordPanel").getComponent(WithdrawRecordPanel).onInit();
        break;
      case "3":
        this.AT_Tab.children[2].getComponent(Toggle).isChecked = true;
        this.AT_Account.active = true;
        this.AT_Account.getChildByName("WithdrawAccountPanel").getComponent(WithdrawAccountPanel).onInit(this.withdrawConfig);
        break;
    }
  }

  AT_BackBtnTouch(): void {
    Global.UI.closeView(WithdrawPanel);
  }

  public onAdded(): void {
    super.onAdded();
  }

  public onRemoved(): void {
    super.onRemoved();
  }
}
