/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { Node, Prefab, Toggle, Widget, _decorator, instantiate, v3 } from 'cc';
import { BaseObject } from '../../../../../Piter.Framework/BaseKit/Constant/BaseObject';
import { PiterDirector } from '../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../Piter.Framework/PiterGlobal';
import { UIResConfig } from '../../../../../Piter.Framework/UIKit/Base/PiterView';
import { BundlesInfo } from '../../../../bundles';
import { MainDirConst } from '../../../constant/GameResConst';
import { GamePlayerManager } from '../../../manager/GamePlayerManager';
import { CommonTabItem } from '../../component/CommonTabItem';
import { FullScreenView } from '../FullScreenView';
import { PromotionBaseNode } from './sub/PromotionBaseNode';
const { ccclass, property } = _decorator;

@ccclass('PromotionPanel')
export class PromotionPanel extends FullScreenView {
    protected static prefabUrl = "promotion/prefabs/PromotionPanel";

    protected static className = "PromotionPanel";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.promotion]
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_Tab: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Content: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_TempTab: Node;

    tabData: BaseObject<PromotionContentData> = {}
    public createChildren(): void {
        super.createChildren();
        // Global.SOUND.playEffectPauseMusic(BaseConstant.ONE_DAY_TIME, "back/sound/tuiguangtishi", 6);
        this.showList();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionPanel);
    }

    currentContentName: string;
    public Toggle_tabTouch(e, contentName) {
        if (contentName == this.currentContentName) {
            return;
        }
        let contentNode: Node;
        for (let i = 0; i < this.AT_Content.children.length; i++) {
            if (this.AT_Content.children[i].name == contentName) {
                contentNode = this.AT_Content.children[i];
                this.AT_Content.children[i].active = true;
            } else {
                this.AT_Content.children[i].active = false;
            }
        }
        this.currentContentName = contentName;
        if (!contentNode) {
            let data = this.tabData[contentName];
            if (data.prefabUrl) {
                Global.RES.loadAsset(data.prefabUrl, Prefab, (prefab: Prefab) => {
                    let node = instantiate(prefab);
                    node.parent = this.AT_Content;
                    node.active = true;
                    node.position = v3(0, 0);
                    node.getComponent(Widget).left = node.getComponent(Widget).right = 0;
                    node.getComponent(Widget).updateAlignment();
                    node.getComponent(PromotionBaseNode).setRoot(this);
                    node.getComponent(PromotionBaseNode).init();
                })
            }
        } else {
            contentNode.getComponent(PromotionBaseNode).setRoot(this);
            contentNode.getComponent(PromotionBaseNode).init();
        }
    }

    showList() {
        let tabList: PromotionContentData[] = [
            { prefabUrl: "promotion/prefabs/sub/wdtgContent", contentName: "wdtgContent", zIndex: 1, tabName: "wdtg", title: "我的推广" },
            { prefabUrl: "promotion/prefabs/sub/wdzsContent", contentName: "wdzsContent", zIndex: 2, tabName: "wdzs", title: "我的直属" },
            { prefabUrl: "promotion/prefabs/sub/yjcxContent", contentName: "yjcxContent", zIndex: 3, tabName: "yjcx", title: "业绩查询" },
            { prefabUrl: "promotion/prefabs/sub/mrsyContent", contentName: "mrsyContent", zIndex: 5, tabName: "mrsy", title: "每日收益" },
            { prefabUrl: "promotion/prefabs/sub/ksfhRuleContent", contentName: "ksfhRuleContent", zIndex: 6, tabName: "tgsm", title: "推广说明" }
        ]
        if (GamePlayerManager.instance.player.kuishunFanyongbi) {
            tabList.push({ prefabUrl: "promotion/prefabs/sub/ksfhContent", contentName: "ksfhContent", zIndex: 4, tabName: "ksfh", title: "亏损分红" })
        }
        tabList = _.sortBy(tabList, (item) => {
            return item.zIndex;
        })
        let tab0;
        for (let i = 0; i < tabList.length; i++) {
            let tabItem = instantiate(this.AT_TempTab);
            tabItem.active = true;
            tabItem.parent = this.AT_Tab;
            tabItem.getComponent(Toggle).clickEvents[0].customEventData = tabList[i].contentName + ""
            this.tabData[tabList[i].contentName] = tabList[i];
            tabItem.getComponent(CommonTabItem).setText(tabList[i].title);
            if (i == 0) {
                tab0 = tabItem
            }
        }
        tab0.getComponent(Toggle).isChecked = true;
        this.Toggle_tabTouch(null, tabList[0].contentName);
    }
}


export interface PromotionContentData {
    prefabUrl: string;
    contentName: string;
    zIndex: number;
    title: string;
    tabName: string
}
