import { Node, Prefab, ScrollView, Toggle, UITransform, _decorator, instantiate, sys, tween, v3 } from "cc";
import { BaseEvent } from "../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { GoldUtils } from "../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import NetLoadingView from "../../../../Piter.Framework/NetKit/NetLoadingView";
import { WebSocketStateEnum } from "../../../../Piter.Framework/NetKit/SocketManager";
import { PiterDirector } from "../../../../Piter.Framework/PiterDirector";
import Global from "../../../../Piter.Framework/PiterGlobal";
import PiterView from "../../../../Piter.Framework/UIKit/Base/PiterView";
import { ButtonSpriteChange } from "../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange";
import { DefaultAlertView } from "../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../constant/ServerConst";
import { GamePlayerManager } from "../../manager/GamePlayerManager";
import { GameIconItem, GameListItem } from "../../message/GameMessage";
import { GameUtils, SubGameWebViewInfo } from "../../utils/GameUtils";
import { InputAccView } from "../login/InputAccView";
import { MainLoginComp } from "../login/MainLoginComp";
import { SecondIconItem } from './../../message/GameMessage';
import { BindPhonePanel } from "./BindPhonePanel";
import { InviteCodePanel } from "./InviteCodePanel";
import { ActivityTGLJPanel } from "./activity/ActivityTGLJPanel";
import { DuiHuanPanel } from "./hall/DuiHuanPanel";
import { GameOuteringView } from "./hall/GameOuteringView";
import { MainLeftTabNode } from "./hall/MainLeftTabNode";
import { MainTabItem } from "./hall/MainTabItem";
import { OuterGameIconItem } from "./hall/OuterGameIconItem";
import { SecendMenuIconItem } from "./hall/SecendMenuIconItem";
import { MailListPanel } from "./notice/MailListPanel";
import { NoticePanel } from "./notice/NoticePanel";
import { PromotionPanel } from "./promotion/PromotionPanel";
import { RechargePanel } from "./recharge/RechargePanel";
import { WithdrawPanel } from "./withdraw/WithdrawPanel";
import { SecretBoxPanel } from "./secretBox/SecretBoxPanel";
import { PromotionCenterView } from "./promotion/PromotionCenterView";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * FileBasename = ExampleLogin.ts
 * FileBasenameNoExtension = ExampleLogin
 * URL = db://assets/Bundles/example/scripts/view/ExampleLogin.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('MainView')
export class MainView extends PiterView {

  protected static prefabUrl = "hall/prefabs/MainView";

  protected static className = "MainView";

  //自有游戏

  //外部跳转游戏
  @PiterDirector.AUTO_BIND(Node)
  AT_OuterDiyGameLayout: Node = null;

  @PiterDirector.AUTO_BIND(Node)
  AT_OuterDiyGameSc: Node = null;

  @PiterDirector.AUTO_BIND(Node)
  AT_OuterDiyGame: Node = null;


  @property(Prefab)
  outerGameDivItem: Prefab = null;

  @property(Prefab)
  secondMenuItem: Prefab = null;

  @PiterDirector.AUTO_BIND(Node)
  AT_SecondMenuLayout: Node = null;

  @PiterDirector.AUTO_BIND(Node)
  AT_SecondMenuSc: Node = null;

  @PiterDirector.AUTO_BIND(Node)
  AT_SecondMenu: Node = null;


  @PiterDirector.AUTO_BIND(Node)
  AT_GoldFlushBtn: Node;

  subGameList: GameListItem[] = [];

  backLoadedbundle = [];

  popUIList = [];

  doLoginSuccess() {
    this.showPlayerInfo();
    this.AT_Player.active = true;
    this.AT_LoginGroup.active = false;
  }

  doLogout() {
    Global.PLAYER.player = {}
    this.showPlayerInfo();
    this.AT_Player.active = false;
    this.AT_LoginGroup.active = true;
  }

  /**
 * 一级菜单
 */
  @PiterDirector.AUTO_BIND(Node)
  AT_Tab: Node;

  /**
   * 游戏标签页点击
   */
  currentTouchTab: MainTabItem;

  public checkLastJumpInfo(jumpInfo) {
    if (jumpInfo) {
      Global.SOUND.pauseMusic();
      if (sys.isNative) {
        NetLoadingView.instance.show(`checkLastJumpInfo`);
        GameUtils.openSubGame({
          gameUrl: jumpInfo.jumpUrl,
          gameId: jumpInfo.gameId,
          direction: jumpInfo.displayType,
          reconnect: false
        })
      }
      this.showWebOuterInfo({
        gameUrl: jumpInfo.jumpUrl,
        gameId: jumpInfo.gameId,
        uid: Global.PLAYER.player.simpleUser.uid,
      })
      NetLoadingView.instance.hide(`checkLastJumpInfo`);
      return true
    }
    NetLoadingView.instance.hide(`checkLastJumpInfo`)
    return false;
  }

  private showWebOuterInfo(data) {
    Global.SOUND.pauseMusic();
    GameUtils.h5GoSubGame(data);
    Global.UI.openView(GameOuteringView, data);
    Global.UI.hideNotOuterLayer();
  }

  @PiterDirector.AUTO_BIND(Node)
  AT_TempTab: Node = null;

  @PiterDirector.AUTO_BIND(Node)
  AT_TempTab2: Node = null;

  /**
   * 初始化左边
   */
  initTabItems() {
    let tabs = Global.PLAYER.allGameConfig["topClass"];
    let tabSelect = Global.ONCE_STORAGE[`lastSelectTab`];
    for (let i = 0; i < tabs.length; i++) {
      let tabKeys = tabs[i];
      let tabItem = instantiate(this.AT_TempTab);
      tabItem.active = true;
      tabItem.name = tabKeys;
      tabItem.parent = this.AT_TempTab.parent;
      tabItem.getComponent(MainTabItem).initByConfigData(tabKeys);
      if (tabSelect == undefined) {
        if (i == 0) {
          tabItem.getComponent(Toggle).isChecked = true;
          this.scheduleOnce(() => {
            this.initTabGameList(tabKeys);
          }, 0.5)
        }
      } else if (tabSelect == tabKeys) {
        tabItem.getComponent(Toggle).isChecked = true;
        this.initTabGameList(tabKeys);
      }
    }
  }

  /**
  * @param {*} e
  * @param {*} custom
  */
  onPageSwitchBtnClick(e, custom) {
    if (this.lockUIBtn) {
      return;
    }
    let tabItem = e.target.getComponent(MainTabItem);
    if (tabItem == this.currentTouchTab) {
      return;
    }
    this.currentTouchTab = tabItem;
    this.initTabGameList(tabItem.tabKey);
  }


  private playBGMusic() {
    return;
    let hallbgm = Global.ONCE_STORAGE[`sound_home_bg`];
    if (!hallbgm) {
      let index = 1;//_.shuffle([1, 2, 3])[0];
      Global.ONCE_STORAGE[`sound_home_bg`] = `back/sound/hall_bgm_${index}`;
    }
    Global.SOUND.playMusic(Global.ONCE_STORAGE[`sound_home_bg`], true);
  }

  private async loadUI() {
    this.checkLogin();
    this.scheduleOnce(() => {
      this.initTabItems();
      this.initSecondMenus();
      this.playBGMusic();
    })
  }

  public async createChildren() {
    super.createChildren();
    this.AT_LoginGroup.getComponent(MainLoginComp).setDelegate(this);
    this.initVirtualList();
    this.loadUI();
  }

  public onAdded() {
    super.onAdded();
    Global.EVENT.on(`exit_subgame`, this.onExitSubGame, this)
    Global.EVENT.on(`go_subgame`, this.onGoSubGame, this)
    Global.EVENT.on(BaseEvent.CIRCULAR_MENU_TOUCH, this.circlularMenuTouch, this)
  }

  public onRemoved() {
    this.cacheItems();
    super.onRemoved();
    Global.EVENT.off(`exit_subgame`, this.onExitSubGame, this)
    Global.EVENT.off(`go_subgame`, this.onGoSubGame, this)
    Global.EVENT.off(BaseEvent.CIRCULAR_MENU_TOUCH, this.circlularMenuTouch, this)
  }

  /**
 * 渲染外部icon
 * @param item 
 * @param idx 
 */
  onOuterGameRender(item: Node, idx: number) {
    item.getComponent(OuterGameIconItem).updateItem(this.searchIconList[idx]);
  }

  circlularMenuTouch(data) {
    let tabItem = data.node.getComponent(MainTabItem);
    if (tabItem == this.currentTouchTab) {
      return;
    }
    this.currentTouchTab = tabItem;
    this.initTabGameList(tabItem.tabConfig);
  }

  /**
   * 去子游戏
   * @param serverData 
   */
  public async onGoSubGame(serverData: GameIconItem) {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    if (this.lockJoin) {
      return;
    }
    if (Global.PLAYER.player.allowPlaygame != 1) {
      DefaultAlertView.addOnlyAlert("您好！本平台禁止玩游戏，谢谢合作！");
      return;
    }
    this.lockJoin = true;
    NetLoadingView.instance.show(`onGoSubGame`);
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/get-launch-game-url", {
      gameId: serverData.gameId
    }, true);
    if (resp.code == 200) {
      Global.SOUND.pauseMusic();
      if (sys.isBrowser) {
        this.lockJoin = false;
        NetLoadingView.instance.hide(`onGoSubGame`);
      } else {
        let direction = resp.data.displayType;
        if (direction == undefined) {
          direction = serverData.displayType
        };
        let data: SubGameWebViewInfo = {
          gameUrl: resp.data.launchGameUrl,
          gameId: resp.data.gameId,
          direction: direction,
          reconnect: false
        }
        GameUtils.openSubGame(data)
      }
      this.showWebOuterInfo({
        gameUrl: resp.data.launchGameUrl,
        gameId: resp.data.gameId,
        uid: Global.PLAYER.player.simpleUser.uid,
      })
    } else {
      this.lockJoin = false;
      NetLoadingView.instance.hide(`openSubGame 2`);
      if (resp.code == 9027) {
        DefaultToast.instance.showText("请绑定手机号");
        Global.UI.openView(BindPhonePanel);
      } else {
        DefaultToast.instance.showText(resp.msg);
      }
    }
  }

  public async onExitSubGame(data) {
    if (Global.SOCKET.state != WebSocketStateEnum.CONNECTING) {
      Global.SOCKET.reConnect();
    }
    Global.SOUND.remuseMusic();
    if (sys.isNative) {

    } else {
      Global.UI.closeView(GameOuteringView);
    }
    NetLoadingView.instance.show(`onExitSubGame`);
    this.scheduleOnce(async () => {
      this.lockJoin = false;
      NetLoadingView.instance.hide(`onExitSubGame`);
      Global.IN_OUTER = false;
      if (this.paramsData && this.paramsData.jumpInfo) {
        this.loadUI();
        this.paramsData.jumpInfo = null;
      } else {
        await GamePlayerManager.instance.updatePlayerInfo(true)
      }
    }, 0.2);
  }

  startPopUI() {
    let v = this.popUIList[0];
    if (!v) return;
    let class1 = this.popUIList.shift();
    Global.UI.openView(v, {
      callback: () => {
        class1;
        this.startPopUI();
      }
    })
  }

  private lockJoin: boolean = false;
  /**
   * 显示大图标类
   * @param tabKeys 
   * @returns 
   */
  public initTabGameList(tabKeys: string) {
    if (tabKeys == "HOT") {
      Global.ONCE_STORAGE[`lastSelectTab`] = tabKeys;
      this.scheduleOnce(() => {
        this.showOuterGameList({
          gameType: "",
          productCode: "HOT",
          productType: 0,
          sortIndex: 0,
          status: 0,
          prex: "_h"
        })
      })
    } else {
      this.AT_OuterDiyGame.active = false;
      this.AT_SecondMenu.active = true;
      let child: Node = null;
      for (let i = 0; i < this.AT_SecondMenuLayout.children.length; i++) {
        let childItem = this.AT_SecondMenuLayout.children[i];
        if (childItem.getComponent(SecendMenuIconItem).config.gameType == tabKeys) {
          child = childItem
          break;
        }
      }
      this.AT_SecondMenuSc.getComponent(ScrollView).stopAutoScroll();
      let pos = this.AT_SecondMenuSc.getComponent(ScrollView).content.position;
      let startY = Math.abs(this.AT_SecondMenuSc.getChildByName("mask").position.y)
      if (child) {
        let childHeight = child.getComponent(UITransform).height + 15;
        let posY = startY + Math.floor(child.getComponent(SecendMenuIconItem).index / 2) * childHeight;
        this.AT_SecondMenuSc.getComponent(ScrollView).content.position = v3(pos.x, posY, 0);
      } else {
        this.AT_SecondMenuSc.getComponent(ScrollView).content.position = v3(pos.x, startY, 0)
      }
      // this.onSlotsPPScrolling(this.AT_SecondMenuSc.getComponent(ScrollView));
    }
  }

  /**
  * 显示二级菜单
  * @param tabKeys 
  */
  public showSecondMenuList(tabKeys: string) {
    this.cacheItems();
    this.AT_OuterDiyGame.active = false;
    this.AT_SecondMenu.active = true;
    let bigIconConfig = Global.PLAYER.allGameConfig[`secondClass`][tabKeys] as SecondIconItem[] || [];
    bigIconConfig = _.sortBy(bigIconConfig, "sortIndex");
    let aniTime = 0;
    this.AT_SecondMenuLayout.removeAllChildren();
    this.AT_SecondMenuSc.getComponent(ScrollView).scrollToTop(0);
    for (let i = 0; i < bigIconConfig.length; i++) {
      let icon1 = instantiate(this.secondMenuItem);
      icon1.getComponent(SecendMenuIconItem).init(bigIconConfig[i], i);
      icon1.parent = this.AT_SecondMenuLayout
      if (i < 20) {
        let time = icon1.getComponent(SecendMenuIconItem).showInitAni(i);
        if (time > aniTime) {
          aniTime = time;
        }
        icon1.getChildByName("content").active = true
      }
    }
    this.AT_SecondMenuSc.getComponent(ScrollView).vertical = false;
    this.scheduleOnce(() => {
      // this.onSlotsPPScrolling(this.AT_SecondMenuSc.getComponent(ScrollView));
      this.AT_SecondMenuSc.getComponent(ScrollView).vertical = true
    }, aniTime)
  }




  //母板
  iconList: any[] = [];
  /**
   * 显示 second
   * @param secondItem 
   */
  //搜索板
  searchIconList: any[] = [];
  public showOuterGameList(secondItem: SecondIconItem, searchKey = "") {
    if (secondItem.prex) {
      let subGames = Global.PLAYER.getGameByGroup(secondItem);
      this.iconList = subGames;
      this.AT_SecondMenu.active = false
      this.AT_OuterDiyGame.active = true;
      this.AT_OuterDiyGameLayout.removeAllChildren();
      this.searchIconList = _.filter(this.iconList, (item: GameIconItem) => {
        return item.name.indexOf(searchKey) > -1;
      })
      this.AT_OuterDiyGameSc.getComponent(ScrollView).scrollToTop(0);
      let aniTime = 0;
      for (let i = 0; i < this.searchIconList.length; i++) {
        let icon1 = instantiate(this.outerGameDivItem);
        icon1.getChildByName("content").active = false
        icon1.getComponent(OuterGameIconItem).updateItem(this.searchIconList[i]);
        icon1.parent = this.AT_OuterDiyGameLayout
        if (i < 20) {
          let time = icon1.getComponent(OuterGameIconItem).showInitAni(i);
          if (time > aniTime) {
            aniTime = time;
          }
          icon1.getChildByName("content").active = true
        }
      }
      this.AT_OuterDiyGameSc.getComponent(ScrollView).vertical = false;
      this.scheduleOnce(() => {
        this.onSlotsPPScrolling(this.AT_OuterDiyGameSc.getComponent(ScrollView));
        this.AT_OuterDiyGameSc.getComponent(ScrollView).vertical = true
      }, aniTime)
    } else {
      // this.AT_OuterIcon
      let subGames = Global.PLAYER.getGameByGroup(secondItem);
      this.iconList = subGames;
      this.AT_SecondMenu.active = false
      this.searchIconList = _.filter(this.iconList, (item: GameIconItem) => {
        return item.name.indexOf(searchKey) > -1;
      })
      if (secondItem.gameType == "LOTT" && this.searchIconList.length == 1) {
        this.onGoSubGame(this.searchIconList[0]);
      } else {
        this.AT_OuterDiyGame.active = false;
      }
    }
  }

  async AT_GoldFlushBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    tween(this.AT_GoldFlushBtn).to(2, { angle: -360 }).call(() => {
      this.AT_GoldFlushBtn.angle = 0;
      DefaultToast.instance.showText("刷新成功");
    }).start();
    await GamePlayerManager.instance.updatePlayerInfo(true);
  }

  AT_GoldAddBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(RechargePanel);
  }

  //----------------缓存-------------
  cacheItems() {
    this.AT_OuterDiyGame.active = false;
  }
  //---------------缓存-end---------------

  //虚拟列表
  initVirtualList() {
    this.AT_OuterDiyGameSc.on("scrolling", this.onSlotsPPScrolling, this)
    // this.AT_SecondMenuSc.on("scrolling", this.onSlotsPPScrolling, this)
  }

  //滚动显示外停止渲染
  onSlotsPPScrolling(scoller: ScrollView) {
    let target = scoller.content;
    for (let i = 0; i < target.children.length; i++) {
      let child = target.children[i];
      let itemX = child.position.y + target.position.y;
      if (itemX > 750 || itemX < -800) {
        child.getChildByName("content").active = false;
      } else {
        child.getChildByName("content").active = true;
      }
    }
  }

  //--------------按钮点击事件

  AT_SearchBtnTouch() {
    Global.EVENT.dispatchEvent("main_bottom_tab_touch", { key: "search" });
  }

  lockUIBtn = true;
  private checkIsLoginTouchBtn() {
    if (this.lockUIBtn) {
      return false;
    }
    if (Global.PLAYER.isLogin()) {
      if (!Global.PLAYER.player.parentId) {
        Global.UI.openView(InviteCodePanel);
        return false;
      }
      return true;
    }
    DefaultAlertView.addAlert("您还没登陆游戏,请登陆", () => {
      Global.UI.openView(InputAccView);
    }, null, false);
    return false;
  }

  //TODO需要先拉公告
  AT_messageBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(MailListPanel);
  }

  @PiterDirector.AUTO_BIND(Node)
  AT_Player: Node = null;

  @PiterDirector.AUTO_BIND(Node)
  AT_LoginGroup: Node = null;

  public checkIsLogin() {
    let isLogin = Global.PLAYER.player.simpleUser != undefined;
    this.AT_LoginGroup.active = !isLogin;
    this.AT_Player.active = isLogin
    return isLogin
  }

  public checkLogin() {
    if (!Global.PLAYER.isLogin()) {
      this.scheduleOnce(() => {
        this.AT_LoginGroup.getComponent(MainLoginComp).checkLogin()
      }, 1);
    } else {
      this.doLoginSuccess();
      this.lockUIBtn = false;
    }
  }

  public showPlayerInfo() {
    if (!this.checkIsLogin()) {
      return;
    }
    if (this.AT_GoldLabel) {
      this.AT_GoldLabel.string = GoldUtils.formatGold(Global.PLAYER.player.gold)
    }
    if (this.AT_NameLabel) {
      this.AT_NameLabel.string = Global.PLAYER.player.simpleUser.nick;
    }
    this.lockUIBtn = false;
    this.scheduleOnce(() => {
      if (!GamePlayerManager.instance.player.parentId) {
        this.popUIList.push(InviteCodePanel);
      }
      // if (!Global.ONCE_STORAGE['login_notice']) {
      //   Global.ONCE_STORAGE['login_notice'] = true;
      //   this.popUIList.push(NoticePanel);
      // }
      this.startPopUI();
    }, 1)
  }

  AT_Daili2BtnTouch() {
    if (!this.checkIsLogin()) {
      return;
    }
    Global.UI.openView(PromotionPanel);
  }

  //--------------------

  initSecondMenus() {
    let topClass = Global.PLAYER.allGameConfig["topClass"];
    let secondClass = Global.PLAYER.allGameConfig[`secondClass`];
    let totalList = [];
    for (let i = 0; i < topClass.length; i++) {
      let list = secondClass[topClass[i]];
      if (list) {
        totalList = totalList.concat(list);
      }
    }
    for (let i = 0; i < totalList.length; i++) {
      let item = totalList[i];
      if (Global.PLAYER.isInExcludePlat(item.productCode)) {
        continue;
      }
      let icon1 = instantiate(this.secondMenuItem);
      icon1.getComponent(SecendMenuIconItem).init(item, i);
      icon1.parent = this.AT_SecondMenuLayout
      icon1.getChildByName("content").active = true
    }
  }


  AT_APP2BtnTouch() {
    if (Global.PLAYER.appDownUrl) {
      GameUtils.goUrl(Global.PLAYER.appDownUrl);
    }
  }

  @PiterDirector.AUTO_BIND(Node)
  AT_XuanFuBtn: Node;

  private runningAni: boolean = false;

  XuanFuBtnTouch() {
    if (this.runningAni) {
      return;
    }
    let group = this.AT_XuanFuBtn.getChildByName("group");
    if (group.scale.y == 0) {
      this.AT_XuanFuBtn.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
      this.runningAni = true;
      tween(group).to(0.2, {
        scale: v3(1, 1, 1)
      }).call(() => {
        this.runningAni = false;
      }).start();
    } else {
      this.AT_XuanFuBtn.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
      this.runningAni = true;
      tween(group).to(0.2, {
        scale: v3(1, 0, 1)
      }).call(() => {
        this.runningAni = false;
      }).start();
    }
  }

  AT_CloseXFBtnTouch() {
    this.AT_XuanFuBtn.active = false;
  }


  AT_TGLJBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(ActivityTGLJPanel);
  }

  AT_DHBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(DuiHuanPanel);
  }

  AT_NoticeBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(NoticePanel);
  }


  AT_TiXianBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(WithdrawPanel);
  }

  AT_RechargeBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(RechargePanel);
  }


  AT_BoxBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(SecretBoxPanel, { tabIndex: "1" });
  }


  AT_PromotionBtnTouch() {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    Global.UI.openView(PromotionCenterView);
  }

}
