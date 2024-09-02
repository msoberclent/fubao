import { Label, Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { GridItemAni } from "../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { GameRecordItem } from "./GameRecordItem";


const { ccclass, property } = _decorator;

@ccclass('GameRecordPanel')
export class GameRecordPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "usercenter/prefabs/GameRecordPanel";

    protected static className = "GameRecordPanel";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.usercenter]
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_stateLbl: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_typeLbl: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_dayLbl: Node;

    @property(Node)
    scList: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_NoRecord: Node;


    listData: any[] = [];
    state = 0;
    type = "0";
    day = 0;
    para = null;

    createChildren() {
        super.createChildren();
        this.initList();
    }

    initList() {
        this.requestRecord();
        // this.scList.getComponent(List).numItems = this.listData.length;
        // if (this.listData.length == 0) {
        //     this.node.getChildByName("contentNode").getChildByName("cm_nodata").active = true;
        // } else {
        //     this.node.getChildByName("contentNode").getChildByName("cm_nodata").active = false;
        // }
        // if (this.para.totalPage == 0) {
        //     this.para.totalPage = 1;
        // }
        // this.totalPage = this.para.totalPage;
        // this.node.getChildByName("contentNode").getChildByName("pages").getComponent(Label).string = this.para.page + "/" + this.para.totalPage;
        // this.node.getChildByName("contentNode").getChildByName("pages").getComponent(Label).string = this.para.page + "/" + this.para.totalPage;
        // if (this.para.loseWin) {
        //     this.showStatusLabel(this.para.loseWin);
        //     this.node.getChildByName("contentNode").getChildByName("sy").getComponent(Label).string = GoldUtils.formatGold(this.para.loseWin);
        // } else {
        //     this.showStatusLabel(0);
        //     this.node.getChildByName("contentNode").getChildByName("sy").getComponent(Label).string = "0";
        // }
    }

    // public showStatusLabel(value) {
    //     let label = this.node.getChildByName("content").getChildByName("right").getChildByName("sy").getComponent(Label)
    //     if (value > 0) {
    //         label.color = new Color().fromHEX(ColorConst.RED)
    //     } else {
    //         label.color = new Color().fromHEX(ColorConst.GREEN)
    //     }
    // }

    onTypeStateClick(e, custom) {
        this.onXialaClick(null, "0");
        if (this.state == Number(custom)) return;
        this.state = Number(custom);
        this.AT_stateLbl.getComponent(Label).string = this.getstateStr(custom);
        this.curPage = 0;
        this.requestRecord();
    }

    getstateStr(str) {
        switch (str) {
            case "0":
                return "全部状态";
            case "1":
                return "未结算";
            case "2":
                return "已结算";
            case "3":
                return "已取消";
        }
    }

    onXialaClick(e, custom) {
        if (custom == "0") {
            let node = this.contentNode.getChildByName("content").getChildByName("status");
            node.getChildByName("lakai").active = !node.getChildByName("lakai").active;
        } else if (custom == "1") {
            let node = this.contentNode.getChildByName("content").getChildByName("type");
            node.getChildByName("lakai").active = !node.getChildByName("lakai").active;
        } else if (custom == "2") {
            let node = this.contentNode.getChildByName("content").getChildByName("time");
            node.getChildByName("lakai").active = !node.getChildByName("lakai").active;
        }
    }
    onTypeTypeClick(e, custom) {
        this.onXialaClick(null, "1");
        if (this.type == custom) return;
        this.type = custom;
        this.AT_typeLbl.getComponent(Label).string = this.getTypeStr(custom);
        // this.node.getChildByName("content").getChildByName("typeall").getComponent(Label).string = this.getTypeStr(custom);
        this.curPage = 0;
        this.requestRecord();
    }

    getTypeStr(str) {
        switch (str) {
            case "0":
                return "全部类型";
            case "PVP":
                return "棋牌";
            case "LOTT":
                return "彩票";
            case "FISH":
                return "捕鱼";
            case "RNG":
                return "电子";
            case "LIVE":
                return "真人";
            case "SPORT":
                return "体育";
            case "ESPORT":
                return "电竞";
            case "HOT":
            case "JINSHU":
                return "热门";

        }
    }

    onTypeTimeClick(e, custom) {
        this.onXialaClick(null, "2");
        if (this.day == Number(custom)) return;
        this.day = Number(custom);
        this.AT_dayLbl.getComponent(Label).string = this.getDayStr(custom);
        // this.node.getChildByName("content").getChildByName("right").getChildByName("timeday").getComponent(Label).string = this.getDayStr(custom);
        this.curPage = 0;
        this.requestRecord();
    }

    getDayStr(str) {
        switch (str) {
            case "0":
                return "今日";
            case "1":
                return "昨日";
            case "2":
                return "最近7天";
            case "3":
                return "最近30天";
        }
    }

    async requestRecord() {
        this.scList.getComponent(List).content.removeAllChildren();
        let reqdata;
        let state = this.state;
        if (state == 0) {
            state = null;
        }
        if (this.type == "0") {
            reqdata = { allStatus: state, timeStatus: this.day, page: this.curPage, pageLength: 99 }
        } else {
            reqdata = { allStatus: state, timeStatus: this.day, page: this.curPage, pageLength: 99, classCode: this.type }
        }
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/game-record", reqdata);
        if (resp.code == 200) {
            this.curPage = resp.data.page;
            if (resp.data.totalPage == 0) {
                resp.data.totalPage = 1;
            }
            // this.node.getChildByName("content").getChildByName("pages").getComponent(Label).string = resp.data.page + "/" + resp.data.totalPage;
            this.listData = resp.data.list;
            this.totalPage = resp.data.totalPage;
            // if (resp.data.loseWin) {
            //     // this.showStatusLabel(resp.data.loseWin);
            //     // this.node.getChildByName("content").getChildByName("right").getChildByName("sy").getComponent(Label).string = GoldUtils.formatGold(resp.data.loseWin);
            // } else {
            //     // this.showStatusLabel(0);
            //     // this.node.getChildByName("content").getChildByName("right").getChildByName("sy").getComponent(Label).string = "0";
            // }
            this.AT_NoRecord.active = this.listData.length == 0;
            this.scList.getComponent(List).numItems = this.listData.length;
        } else {
            DefaultToast.instance.showText(resp.msg);
        }
    }

    public onListRender(item: Node, idx) {
        let data = this.listData[idx];
        item.getComponent(GameRecordItem).updateItem(data, idx);
        item.getComponent(GridItemAni).startAnimation(0);
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(GameRecordPanel);
    }


    totalPage = 1;
    curPage = 1;
    // /**
    //  * 上一页
    //  */
    // AT_zhuanshuLastBtnTouch() {
    //     this.curPage -= 1;
    //     if (this.curPage < 1) {
    //         this.curPage += 1;
    //         return;
    //     }
    //     this.requestRecord();
    // }

    // /**
    //  * 下一页
    //  */
    // AT_zhuanshuNextBtnTouch() {
    //     this.curPage += 1;
    //     if (this.curPage > this.totalPage) {
    //         this.curPage -= 1;
    //         return;
    //     }
    //     this.requestRecord();
    // }
}