import { Color, Label, Node, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ColorConst } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";

const { ccclass, property } = _decorator;

@ccclass('PromotionLQJLPanel')
export class PromotionLQJLPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "promotion/prefabs/PromotionLQJLPanel";

    protected static className = "PromotionLQJLPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_List: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_NoRecord: Node;

    public createChildren(): void {
        super.createChildren();
        this.showList();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionLQJLPanel);
    }


    async showList() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/gain-reward-log", {});
        if (resp.code == 200) {
            let list = resp.data.list as any[];
            this.AT_NoRecord.active = list.length == 0
            this.listData = list;
            this.AT_List.getComponent(List).numItems = this.listData.length;
        } else {
            DefaultToast.instance.showText(resp.msg);
        }
    }


    listData: any[];
    public onListRender(item: Node, idx: number) {
        let itemData = this.listData[idx];
        item.getChildByName("time").getComponent(Label).string = itemData.dayStr;
        item.getChildByName("ddh").getComponent(Label).string = itemData.id;
        item.getChildByName("money").getComponent(Label).string = GoldUtils.formatGold(itemData.effectExtract);
        item.getChildByName("status").getComponent(Label).string = this.getState(itemData.auditState);
        item.getChildByName("status").getComponent(Label).color = this.getstateColor(itemData.auditState);
    }

    getState(state) {
        if (state == 0) {
            return "待审核"
        } else if (state == 1) {
            return "通过"
        } else if (state == 2) {
            return "拒绝"
        } else {
            return "未知状态"
        }
    }

    getstateColor(num) {
        if (num == 0) {
            return new Color().fromHEX(ColorConst.NORMAL);
        } else if (num == 1) {
            return new Color().fromHEX(ColorConst.GREEN);
        } else {
            return new Color().fromHEX(ColorConst.RED);
        }
    }
}
