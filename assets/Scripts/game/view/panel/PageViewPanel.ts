import { Label, Layout, Node, Prefab, Toggle, _decorator, instantiate, v3 } from 'cc';
import { PiterDirector } from '../../../../Piter.Framework/PiterDirector';
import Global from '../../../../Piter.Framework/PiterGlobal';
import PiterView from '../../../../Piter.Framework/UIKit/Base/PiterView';
import { CommonTabItem } from '../component/CommonTabItem';
const { ccclass, property } = _decorator;

@ccclass('PageViewPanel')
export class PageViewPanel extends PiterView {

    protected maskNode: Node;

    protected contentNode: Node;

    protected static layerName = "panel";

    @PiterDirector.AUTO_BIND(Node)
    AT_PageBottomTab: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Bottom: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Top: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Content: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Title: Node;

    tabData: any = {};

    private currentName: string;
    createChildren() {
        super.createChildren();
    }

    public createBottomTabs(tabList: any[], layoutConfig?: LayoutConfig) {
        if (layoutConfig) {
            let layout = this.AT_Bottom.getComponent(Layout);
            if (layoutConfig.padding_left != undefined) {
                layout.paddingLeft = layoutConfig.padding_left
            }
            if (layoutConfig.padding_right != undefined) {
                layout.paddingRight = layoutConfig.padding_right
            }
            if (layoutConfig.spacingX != undefined) {
                layout.spacingX = layoutConfig.spacingX
            }
            layout.updateLayout(true);
        }
        tabList = _.sortBy(tabList, (item) => {
            return item.zIndex;
        })
        for (let i = 0; i < tabList.length; i++) {
            let tabItem = instantiate(this.AT_PageBottomTab);
            tabItem.active = true;
            tabItem.parent = this.AT_Bottom;
            tabItem.setPosition(v3(0, 0));
            tabItem.getComponent(Toggle).clickEvents[0].customEventData = tabList[i].contentName + ""
            let imgUrl = tabList[i].imageUrl;
            tabItem.getComponent(CommonTabItem).setImage(`${imgUrl}1`, `${imgUrl}2`);
            this.tabData[tabList[i].contentName] = tabList[i];
        }
        this.onBottomTabTouch(null, tabList[0].contentName);
    }

    public onBottomTabTouch(e, contentName) {
        if (this.currentName == contentName) {
            return;
        }
        this.currentName = contentName
        let data = this.tabData[contentName];
        if (data && data.title) {
            this.AT_Title.getComponent(Label).string = data.title;
        }
        let hasChild = false;
        for (let i = 0; i < this.AT_Content.children.length; i++) {
            if (this.AT_Content.children[i].name == contentName) {
                hasChild = true;
                this.AT_Content.children[i].active = true;
            } else {
                this.AT_Content.children[i].active = false;
            }
        }
        if (!hasChild) {
            if (data.prefabUrl) {
                Global.RES.loadAsset(data.prefabUrl, Prefab, (prefab: Prefab) => {
                    let node = instantiate(prefab);
                    node.parent = this.AT_Content;
                    node.active = true;
                })
            }
        }
    }
}


export interface LayoutConfig {
    padding_left?: number
    padding_right?: number
    spacingX?: number
}