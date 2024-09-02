import { Node, Toggle, Tween, UITransform, _decorator, instantiate, tween, v3 } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { GameUtils } from "../../../utils/GameUtils";
import { InputAccView } from "../../login/InputAccView";
import { NoticePanel } from "../notice/NoticePanel";
import { PromotionPanel } from "../promotion/PromotionPanel";
import { MainTabItem } from "./MainTabItem";

const { ccclass, property } = _decorator;

@ccclass('MainLeftTabNode')
export class MainLeftTabNode extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_InfoContent: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_InfoTab: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_TempTab2: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_AppDownloadBtn: Node;

    createChildren() {
        super.createChildren();
        // if (sys.isBrowser) {
        //     this.AT_AppDownloadBtn.active = true;
        // }
        this.initTabItems();
    }

    public onShowTabs() {
        this.node.active = true;
        let tabSelect = Global.ONCE_STORAGE[`lastSelectTab`];
        for (let i = 0; i < this.AT_InfoTab.children.length; i++) {
            let child = this.AT_InfoTab.children[i];
            if (child.name == tabSelect) {
                child.getComponent(Toggle).isChecked = true;
            }
        }
        this.scheduleOnce(() => {
            this.showAni(true);
        });
    }

    isRunning: boolean
    public showAni(isShow) {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true
        let width = this.AT_InfoContent.getComponent(UITransform).width;
        if (isShow) {
            this.AT_InfoContent.active = true;
            Tween.stopAllByTarget(this.AT_InfoContent);
            tween(this.AT_InfoContent).by(0.3, {
                position: v3(width, 0)
            }).call(() => {
                this.isRunning = false
            }).start();
        } else {
            Tween.stopAllByTarget(this.AT_InfoContent);
            tween(this.AT_InfoContent).by(0.3, {
                position: v3(-width, 0)
            }).call(() => {
                this.isRunning = false
                this.node.active = false;
            }).start();
        }
    }

    /**
     * 初始化左边
     */
    initTabItems() {
        let tabs = Global.PLAYER.allGameConfig["topClass"];
        let tabSelect = Global.ONCE_STORAGE[`lastSelectTab`];
        for (let i = 0; i < tabs.length; i++) {
            let tabKeys = tabs[i];
            let tabItem = instantiate(this.AT_TempTab2);
            tabItem.active = true;
            tabItem.name = tabKeys;
            tabItem.parent = this.AT_TempTab2.parent;
            tabItem.getComponent(MainTabItem).initByConfigData(tabKeys);
            if (tabSelect == undefined) {
                if (i == 0) {
                    tabItem.getComponent(Toggle).isChecked = true;
                }
            } else if (tabSelect == tabKeys) {
                tabItem.getComponent(Toggle).isChecked = true;
            }
        }
    }

    AT_HideBtnTouch() {
        this.showAni(false)
    }

    AT_ActivityBtnTouch() {
        if (!this.checkIsLoginTouchBtn()) {
            return
        }
        Global.UI.openView(NoticePanel)
    }

    AT_DailiBtnTouch() {
        if (!this.checkIsLoginTouchBtn()) {
            return
        }
        Global.UI.openView(PromotionPanel)
    }

    public onTabItemTouch(e, custorm) {
        let tabItem = e.target.getComponent(MainTabItem);
        let secoendData = {
            gameType: tabItem.tabKey,
            productCode: ""
        }
        Global.EVENT.dispatchEvent("main_bottom_tab_touch", { key: "show_gird", config: secoendData });
    }

    AT_AppDownloadBtnTouch() {
        GameUtils.goUrl("https://live.dw7777.online/");
    }


    private checkIsLoginTouchBtn() {
        if (Global.PLAYER.isLogin()) {
            return true;
        }
        DefaultAlertView.addAlert("您还没登陆游戏,请登陆", () => {
            Global.UI.openView(InputAccView);
        }, null, false);
        return false;
    }
}   