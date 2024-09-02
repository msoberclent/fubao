import { EventTouch, Node, _decorator, tween, v3 } from "cc";
import { PiterDirector } from "../../../../Piter.Framework/PiterDirector";
import Global from "../../../../Piter.Framework/PiterGlobal";
import PiterView from "../../../../Piter.Framework/UIKit/Base/PiterView";
import { DefaultAlertView } from "../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { InputAccView } from "../login/InputAccView";
import { InviteCodePanel } from "./InviteCodePanel";
import { ActivityTGLJPanel } from "./activity/ActivityTGLJPanel";
import { GirdGameContent } from "./hall/GirdGameContent";
import { MainSearchContent } from "./hall/MainSearchContent";
import { MainKeFuPanel } from "./kefu/MainKeFuPanel";
import { RechargePanel } from "./recharge/RechargePanel";

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

@ccclass('APPView')
export class APPView extends PiterView {

  protected static prefabUrl = "hall/prefabs/APPView";

  protected static className = "APPView";

  @PiterDirector.AUTO_BIND(Node)
  AT_Content: Node

  onMainMenuTouch(e: EventTouch, custorm) {
    let node = e.currentTarget as Node;
    switch (node.name) {
      case "AT_MineBtn":
        if (!this.checkIsLoginTouchBtn()) {
          return;
        }
        this.onShowNode("usercenter");
        break;
      case "AT_RechargeBtn":
        if (!this.checkIsLoginTouchBtn()) {
          return;
        }
        Global.UI.openView(RechargePanel);
        break;
      case "AT_ActivityBtn":
        if (!this.checkIsLoginTouchBtn()) {
          return;
        }
        this.onShowNode("activity", false);
        break;
      case "AT_KefuBtn":
        Global.UI.openView(MainKeFuPanel);
        break;
      case "AT_MainBtn":
        this.onShowNode("main", false);
        break;
    }
  }

  private checkIsLoginTouchBtn() {
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


  createChildren() {
    super.createChildren();
    this.AT_GridList.active = this.AT_Search.active = false
  }

  currentActiveNode: Node;
  public onShowNode(nodeName: string, needAni: boolean = true) {
    if (this.currentActiveNode) {
      this.nodeOutScreen(this.currentActiveNode);
    }
    for (let i = 0; i < this.AT_Content.children.length; i++) {
      let child = this.AT_Content.children[i];
      if (child.name == nodeName) {
        this.nodeInScreen(child);
      } else {
        this.nodeOutScreen(child);
      }
    }
  }

  public nodeOutScreen(node: Node) {
    if (node.position.x != 720) {
      tween(node).to(0.15, {
        position: v3(720, 0)
      }).call(() => {
        node.active = false;
      }).start();
    } else {
      if (node.active) {
        node.active = false;
      }
    }
  }

  public nodeInScreen(node: Node) {
    if (!node.active) {
      node.active = true
    }
    if (node.position.x != 0) {
      tween(node).to(0.15, {
        position: v3(0, 0)
      }).start();
    }
  }

  @PiterDirector.AUTO_BIND(Node)
  AT_Search: Node

  @PiterDirector.AUTO_BIND(Node)
  AT_GridList: Node


  onMainMenuTouch1(data) {
    if (!this.checkIsLoginTouchBtn()) {
      return;
    }
    if (data.key == "search") {
      this.AT_Search.active = true;
      this.scheduleOnce(() => {
        this.AT_Search.getComponent(MainSearchContent).onShow();
      })
      // this.onShowNode("search");
    } else if (data.key == "show_gird") {
      this.AT_GridList.active = true;
      this.AT_GridList.getComponent(GirdGameContent).showGridList(data.config);
    }
  }

  AT_HBHDBtnTouch() {
    Global.UI.openView(ActivityTGLJPanel)
  }


  public onAdded() {
    super.onAdded();
    Global.EVENT.on("main_bottom_tab_touch", this.onMainMenuTouch1, this);
  }

  public onRemoved() {
    super.onRemoved();
    Global.EVENT.off("main_bottom_tab_touch", this.onMainMenuTouch1, this);
  }
}
