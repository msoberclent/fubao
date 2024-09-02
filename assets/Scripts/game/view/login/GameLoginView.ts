
import { Label, Node, Sprite, UIOpacity, _decorator, director, game, sys, tween } from 'cc';
import { LogUtils } from '../../../../Piter.Framework/BaseKit/Util/LogUtils';
import { PiterDirector } from '../../../../Piter.Framework/PiterDirector';
import Global from '../../../../Piter.Framework/PiterGlobal';
import PiterView from '../../../../Piter.Framework/UIKit/Base/PiterView';
import { DefaultAlertView } from '../../../../Piter.Framework/UIKit/Example/DefaultAlertView';
import { BundlesInfo } from '../../../bundles';
import { MainDirConst } from '../../constant/GameResConst';
import { ServerConfig } from '../../constant/ServerConst';
import { GamePlayerManager } from '../../manager/GamePlayerManager';
import { APPView } from '../main/APPView';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * FileBasename = ExampleLogin.ts
 * FileBasenameNoExtension = ExampleLogin
 * URL = db://assets/Bundles/example/scripts/view/ExampleLogin.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('GameLoginView')
export class GameLoginView extends PiterView {

  protected static prefabUrl = "login/prefabs/GameLoginView";

  protected static className = "GameLoginView";

  @PiterDirector.AUTO_BIND(Sprite)
  AT_loadingFill: Sprite;

  @PiterDirector.AUTO_BIND(Label)
  AT_ProgressLabel: Label;

  @PiterDirector.AUTO_BIND(Node)
  AT_LoadingGroup: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_BgGroup: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_LoginGroup: Node;

  /**
    * 是否加载完成
    */
  private _loadOver: boolean = false;
  /**
   * 是否登录完成
   */
  private _loginOver: boolean = false;

  public createChildren() {
    super.createChildren();
    this.showClientInfo();
    if (sys.isNative) {
      this.AT_BgGroup.active = false;
      this.doNativeLoading();
    } else {
      this.doWebLoading();
    }
  }

  private reqTimes: number = 0;
  private async getGameConfig() {
    this.setLoadingText("正在读取游戏资源...");
    let resp = await GamePlayerManager.instance.getAllGameConfigs() as any;
    if (resp.code != 200) {
      if (this.reqTimes > 5) {
        DefaultAlertView.addAlert("获取游戏列表失败,请重新进入游戏", () => {
          game.restart();
        });
        return;
      } else {
        this.scheduleOnce(() => {
          this.reqTimes++;
          this.getGameConfig();
        }, 4);
      }
      return;
    }
    this._loginOver = true;
    this.checkOvering();
  }

  public loadBackGroup() {
    let loadingGroup = [];
    loadingGroup.push(MainDirConst.promotion);
    loadingGroup.push(MainDirConst.usercenter);
    loadingGroup.push(MainDirConst.bank);
  }

  public onLoadOver() {
    this._loadOver = true;
    this.goMainView();
  }

  private async goMainView() {
    this.setLoadingText("OK");

    Global.UI.hideTopLayer();
    Global.UI.closeView(GameLoginView);

  }

  private checkOvering() {
    if (this._loadOver && this._loginOver) {
      this.onLoadOver();
    }
  }

  onRemoved() {
    super.onRemoved();
    this.removeHotUpdate();
  }


  @PiterDirector.AUTO_BIND(Label)
  AT_ClientVersionLabel: Label;

  showClientInfo() {
    this.AT_ClientVersionLabel.string = Global.VERSION.CLIENT;
  }

  public removeHotUpdate() {
    if (sys.isNative) {
      let node = Global.UI.uIRoot.node.getChildByPath("BottomLayer/HotUpdateView")
      if (node) {
        node.removeFromParent();
        node.destroy();
      }
    }
  }

  protected closeView() {
    let scene = director.getScene();
    scene.getComponent(UIOpacity);
    this.onRemoved();
    this.node.destroy();
    Global.UI.openView(APPView);
  }


  /**
   * 网页模式加载流程
   */
  public doWebLoading() {
    this.getGameConfig();
    let loadingGroup = [];
    loadingGroup.push(MainDirConst.hall);
    loadingGroup.push(MainDirConst.common);
    this.AT_LoadingGroup.active = true;
    Global.RES.loadBundleDirs(BundlesInfo.game_main, loadingGroup, (loaded: number, total: number) => {
      this.AT_loadingFill.fillRange = loaded / total;
      let percent = Math.floor(loaded / total * 100);
      this.AT_ProgressLabel.string = `正在加载本地资源中...` + `${percent}%`;
    }, () => {
      this._loadOver = true;
      this.checkOvering();
    })
  }


  /**
   * native加载流程
   */
  public doNativeLoading() {
    this.getGameConfig();
    let loadingGroup = [];
    loadingGroup.push(MainDirConst.hall);
    loadingGroup.push(MainDirConst.common);
    Global.RES.loadBundleDirs(BundlesInfo.game_main, loadingGroup, (loaded: number, total: number) => {
    }, () => {
      this.loadBackGroup();
      this.setLoadingPercentAni(1, 0.01, () => {
        this.scheduleOnce(() => {
          this._loadOver = true;
          this.checkOvering();
        }, 0.2)
      });
    })
  }

  /**
   * 设置加载语言描述
   * @param text 
   */
  public setLoadingText(text: string) {
    this.AT_ProgressLabel.string = text;
  }

  /**
   * 设置加载流程动画
   * @param percent 
   * @param animationTime 
   */
  public setLoadingPercentAni(percent: number, animationTime: number, callback: Function) {
    this.AT_LoadingGroup.active = true;
    tween(this.AT_loadingFill).delay(0.1).to(animationTime, {
      fillRange: percent
    }).call(() => {
      callback && callback();
    }).start();
  }
}
