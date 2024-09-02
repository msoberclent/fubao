import { Label, Node, Sprite, _decorator, instantiate, v3 } from "cc";
import { PiterDirector } from "../../../../Piter.Framework/PiterDirector";
import Global from "../../../../Piter.Framework/PiterGlobal";
import PiterView from "../../../../Piter.Framework/UIKit/Base/PiterView";
import { DefaultToast } from "../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { ServerConfig } from "../../constant/ServerConst";
import { ActivityDetailPanel } from "./ActivityDetailPanel";
import { ActivityItem } from "./ActivityItem";
import { DuiHuanPanel } from "./hall/DuiHuanPanel";



const { ccclass, property } = _decorator;
@ccclass('ActivityPanel')
export class ActivityPanel extends PiterView {
    protected static prefabUrl = "activity/prefabs/ActivityPanel";

    protected static className = "ActivityPanel";

    // protected static layerZIndex: number = 2;
    @PiterDirector.AUTO_BIND(Node)
    AT_activityLayout: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_activityTypeItem: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_activityContent: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_ActivityCZHBPanel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_activityImg: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_ActivityListsc: Node;

    activityList = [];
    allActivityList = [];
    chooseActivityData = null;
    activityCategory: Object = {};

    public createChildren(): void {
        super.createChildren();
        this.requestActivity();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    /**
     * 拉去活动
     */
    async requestActivity() {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/activity-list", { page: 0, pageLength: 999 });
        if (data.code == 200) {
            this.AT_activityLayout.destroyAllChildren();
            let list = data.data.list;
            this.allActivityList = list;
            this.activityCategory = {};

            let v = instantiate(this.AT_activityTypeItem);
            v.getChildByPath("no/name").getComponent(Label).string = "全部优惠";
            v.getChildByPath("select/name").getComponent(Label).string = "全部优惠";
            v.active = true;
            v[`idx`] = "all";
            v.setParent(this.AT_activityLayout);
            v.setPosition(v3(0, 0));

            for (let i = 0; i < list.length; i++) {
                if (this.activityCategory.hasOwnProperty(list[i].category)) {
                    this.activityCategory[list[i].category].push(list[i]);
                } else {
                    let arr = [list[i]];
                    this.activityCategory[list[i].category] = arr;
                    let v = instantiate(this.AT_activityTypeItem);
                    v.getChildByPath("no/name").getComponent(Label).string = list[i].categoryName;
                    v.getChildByPath("select/name").getComponent(Label).string = list[i].categoryName;
                    v.active = true;
                    v[`idx`] = list[i].category;
                    v.setParent(this.AT_activityLayout);
                    v.setPosition(v3(0, 0));
                }
            }
            this.activityList = this.allActivityList;
            this.freshActivityList(this.activityList);
        }
    }

    onActivityCategroyClick(e) {
        let node = e.target;
        let idx = node[`idx`];
        if (idx == "all") {
            this.activityList = this.allActivityList;
            this.freshActivityList(this.activityList);
        } else {
            this.activityList = this.activityCategory[idx];
            this.freshActivityList(this.activityList);
        }
    }

    freshActivityList(list: Array<any>) {
        this.AT_activityContent.destroyAllChildren();
        for (let i = 0; i < list.length; i++) {
            let v = instantiate(this.AT_activityImg);
            v.setPosition(v3(0, 0));
            v.setParent(this.AT_activityContent);
            v.getComponent(ActivityItem).updateItem(list[i], i);
            v.active = true;
        }
        // this.AT_ActivityListsc.getComponent(List).numItems = list.length;
    }

    onActivityClick(e) {
        let node = e.target;
        let data = node[`data`];
        this.chooseActivityData = data
        this.freshContent(this.chooseActivityData);
    }

    isLink = false;
    async freshContent(data) {
        Global.UI.openView(ActivityDetailPanel, data);
    }

    onListRender(item: Node, idx) {
        let data = this.activityList[idx];
        item.getComponent(ActivityItem).updateItem(data, idx);
    }


    async shenQingBtnClick(e, custom) {
        let data = this.chooseActivityData;
        ButtonUtils.setGray(this.node.getChildByPath("contentNode/shenqing").getComponent(Sprite), true);
        this.scheduleOnce(() => {
            ButtonUtils.setGray(this.node.getChildByPath("contentNode/shenqing").getComponent(Sprite), false);
        }, 5)
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/activity-apply", { id: data.id });
        if (resp.code == 200) {
            DefaultToast.instance.showText(resp.msg);
        } else {
            DefaultToast.instance.showText(resp.msg);
        }
    }

    canyuBtnClick(e, custom) {
        this.AT_ActivityCZHBPanel.active = true;
        // Global.UI.openView(RechargePanel);
    }

    lingquBtnClick() {
        Global.UI.openView(DuiHuanPanel);
    }
}