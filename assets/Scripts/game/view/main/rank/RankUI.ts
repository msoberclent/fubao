import { Label, Node, _decorator, isValid } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { GridItemAni } from "../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { RankUIItem } from "./RankUIItem";
const { ccclass, property } = _decorator;
@ccclass('RankUI')
export class RankUI extends PiterUI {
    // protected static prefabUrl = "rank/prefabs/RankUI";

    // protected static className = "RankUI";

    @PiterDirector.AUTO_BIND(Node)
    AT_leftItem: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_myRank: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_myWin: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_myReward: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_RankSc: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_rankItem: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_contentRank: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_contentRuler: Node;

    defaultRankType = "0";
    listData = [];

    createChildren() {
        super.createChildren();
        // this.requestRank(this.defaultRankType);
    }

    async requestRank(type) {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/game-win-rank", { type: type });
        if (!isValid(this.node)) {
            return;
        }
        if (resp.code == 200) {
            this.listData = resp.data.list;
            this.AT_RankSc.getComponent(List).numItems = this.listData.length;
            if (resp.data.my) {
                this.AT_myRank.getComponent(Label).string = resp.data.my.rank;
                this.AT_myWin.getComponent(Label).string = GoldUtils.formatGold(resp.data.my.win);
                this.AT_myReward.getComponent(Label).string = GoldUtils.formatGold(resp.data.my.prize);
            } else {
                this.AT_myRank.getComponent(Label).string = "未上榜";
                this.AT_myWin.getComponent(Label).string = "--";
                this.AT_myReward.getComponent(Label).string = "--";
            }
        } else {
            DefaultToast.instance.showText(resp.msg);
        }
    }

    public onListRender(item: Node, idx) {
        let data = this.listData[idx];
        item.getComponent(RankUIItem).updateItem(data, idx);
        item.getComponent(GridItemAni).startAnimation(0);
    }

    /**
     * @param {*} e
     * @param {*} custom
     */
    onTopPageItemTouch(e, custom) {
        switch (custom) {
            case "0": case "1":
                this.AT_contentRank.active = true;
                this.AT_contentRuler.active = false;
                this.requestRank(custom);
                break;
            case "2":
                this.AT_contentRank.active = false;
                this.AT_contentRuler.active = true;
                break;
        }
    }

    // AT_closeBtnTouch() {
    //     Global.UI.closeView(RankUI);
    // }

}