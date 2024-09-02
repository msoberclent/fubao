import { Node, Sprite, Toggle, _decorator, instantiate } from "cc";
import { BaseObject } from "../../../../../Piter.Framework/BaseKit/Constant/BaseObject";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { RechargeMethodItem } from "../../../message/GameMessage";
import { FullScreenView } from "../FullScreenView";
import { RechargeRecordPanel } from "./RechargeRecordPanel";
import { BaseRechargeContent } from "./content/BaseRechargeContent";

const { ccclass, property } = _decorator;
@ccclass('RechargePanel')
export class RechargePanel extends FullScreenView {
  protected static prefabUrl = "bank/prefabs/RechargePanel";

  protected static className = "RechargePanel";

  tabIndex: string[];

  @PiterDirector.AUTO_BIND(Node)
  AT_TempNode: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_Tab: Node

  @PiterDirector.AUTO_BIND(Node)
  AT_Content: Node

  protected static uiResConfig: UIResConfig = {
    bundleName: BundlesInfo.game_main,
    dirNames: [MainDirConst.bank]
  }


  public createChildren(): void {
    super.createChildren();
    this.initTabList();
    // Global.SOUND.playEffectPauseMusic(BaseConstant.ONE_DAY_TIME, `back/sound/hall_recharge_tishi`, 4)
  }

  public getTabNameKey(key) {
    switch (key) {
      case "wx":
        return "微信";
      case "zfb":
        return "支付宝";
      case "yhk":
      case "yhk_dc":
        return "银行卡";
      case "rgcz":
        return "人工充值";
      case "usdt":
      case "usdt_dc":
        return "USDT";
      case "ysf":
        return "云闪付";
      case "topay":
        return "TOPAY";
      case "okpay":
        return "OKPAY";
      case "szrmb":
        return "数字人民币";
      case "wanb":
        return "万币钱包";
      case "kdpay":
        return "K豆支付";
      case "btpay":
        return "币通钱包"
      default:
        return "未知";
    }
  }

  public rechargeModel: BaseObject<RechargeMethodItem> = {};
  public async initTabList() {
    this.rechargeModel = {};
    let methods = await GamePlayerManager.instance.getRechargeMethod();
    this.tabIndex = [];
    for (let i = 0; i < methods.length; i++) {
      let tabId = methods[i].modeKey;// this.getTabIndexByKey(methods[i].modeKey);
      if (methods[i].active) {
        this.rechargeModel[tabId] = methods[i];
        this.tabIndex.push(tabId);
      }
    }
    for (let i = 0; i < this.tabIndex.length; i++) {
      let tabIndex = this.tabIndex[i];
      let tabItem = instantiate(this.AT_TempNode);
      tabItem.active = true;
      tabItem.parent = this.AT_Tab;
      tabItem.getComponent(Toggle).clickEvents[0].customEventData = tabIndex + "";
      ImageUtils.showRemoteHeader(tabItem.getChildByPath("no/icon").getComponent(Sprite),methods[i].picUrl)
      ImageUtils.showRemoteHeader(tabItem.getChildByPath("select/icon").getComponent(Sprite),methods[i].picUrl)
      // tabItem.getComponent(CommonTabItem).setText(this.getTabNameKey(tabIndex));
    }
    this.onBtnSwitchPage(null, this.tabIndex[0] + "");
  }


  private showContent(contentStr: string, tabId: number) {
    for (let i = 0; i < this.AT_Content.children.length; i++) {
      let child = this.AT_Content.children[i];
      if (child.name == contentStr) {
        child.active = true;
        if (child.getComponent(BaseRechargeContent)) child.getComponent(BaseRechargeContent).onShowUI(this.rechargeModel[tabId]);
      } else {
        child.active = false;
      }
    }
  }

  onBtnSwitchPage(e, custom) {
    switch (custom) {
      case "yhk":
        this.showContent("AT_BankContent", custom); break;
      case "usdt":
        this.showContent("AT_USDTContent", custom); break;
      case "zfb":
      case "wx":
      case "topay":
      case "okpay":
      case "szrmb":
      case "ysf":
      case "btpay":
      case "kdpay":
      case "wanb":
      case "usdt_dc":
      case "yl":
        this.showContent("AT_WXContent", custom); break;
      case "rgcz":
        this.showContent("AT_RGContent", custom); break;
      case "yhk_dc":
        this.showContent("AT_YHKDCContent", custom); break;
    }
  }

  AT_BackBtnTouch(): void {
    Global.UI.closeView(RechargePanel);
    Global.PLAYER.updatePlayerInfo(false);
  }


  AT_RecordBtnTouch() {
    Global.UI.openView(RechargeRecordPanel);
  }

  AT_closeBtnTouch(): void {
    Global.UI.closeView(RechargePanel);
    Global.PLAYER.updatePlayerInfo(false);
}


  public rechargeSuccess() {
    // Global.SOUND.playEffectByTime(5, `recharge/back/sound/hall_rechargeScc`)
  }

  public onAdded(): void {
    super.onAdded();
  }

  public onRemoved(): void {
    super.onRemoved();
  }
}