import { Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { ServerConfig } from "../../../constant/ServerConst";
import { ActivityCSDItem } from "./ActivityCSDItem";

/**
 * 财神到
 */
const { ccclass, property } = _decorator;
@ccclass('ActivityCSDPanel')
export class ActivityCSDPanel extends PiterPanel {

    protected static prefabUrl = "activity/prefabs/ActivityCSDPanel";

    protected static className = "ActivityCSDPanel";

    @PiterDirector.AUTO_BIND(List)
    AT_List: List = null;

    listData: any[]

    dataMap: any = {};

    curTabIndex: number = 0;

    serverData
    public async createChildren() {
        super.createChildren();
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + '/api/gate/mission-list-by-page', {
            page: 0,
            pageLength: 1000
        }, true);
        if (resp.code == 200) {
            this.dataMap = _.groupBy(resp.data.list, 'missionClass')
        }
        this.getItemList();
    }

    public async getItemList() {
        this.listData = []
        if (this.curTabIndex == 0) {
            this.listData = this.dataMap[1100];
        } else if (this.curTabIndex == 1) {
            this.listData = this.dataMap[2100];
        } else if (this.curTabIndex == 2) {
            this.listData = this.dataMap[3100];
        } else {
            this.listData = []
        }
        if (!this.listData) {
            this.listData = []
        }
        this.AT_List.numItems = this.listData.length;
        this.AT_List.scrollView.stopAutoScroll();
        this.AT_List.scrollView.scrollToTop(0.01, true)
    }

    public onTabItemChange(e, custData) {
        if (this.curTabIndex == custData) {
            return;
        }
        this.curTabIndex = Number(custData)
        this.getItemList();
    }

    public onListRender(item: Node, idx: number) {
        item.getComponent(ActivityCSDItem).updateItem(this.listData[idx])
    }

    public AT_CloseBtnTouch() {
        Global.UI.closeView(ActivityCSDPanel);
    }
}