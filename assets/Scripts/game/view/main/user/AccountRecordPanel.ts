import { Label, Node, ScrollView, _decorator, instantiate, v3 } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { GridItemAni } from "../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { AccountRecordItem, JINSHU_ACC_TYPE } from "./AccountRecordItem";

const { ccclass, property } = _decorator;

@ccclass('AccountRecordPanel')
export class AccountRecordPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "usercenter/prefabs/AccountRecordPanel";

    protected static className = "AccountRecordPanel";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.usercenter]
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_stateLbl: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_dayLbl: Node;

    @property(Node)
    scList: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_NoRecord: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_TempItem: Node;

    listData: any[] = [];
    state = 0;
    day = 0;
    para = null;

    createChildren() {
        super.createChildren();
        this.initList();
    }

    initList() {
        this.requestRecord();
        let node = this.node.getChildByPath("contentNode/content/status");
        let sc = node.getChildByName("lakai").getChildByName("sc");
        sc.getComponent(ScrollView).content.destroyAllChildren();
        let item = node.getChildByName("lakai").getChildByName("selectItem");
        let sumitem = instantiate(item);
        sumitem[`curtype`] = 0;
        sumitem.parent = sc.getComponent(ScrollView).content;
        sumitem.active = true;
        sumitem.getComponentInChildren(Label).string = "全部类型";
        sumitem.setPosition(v3(0, 0));
        for (let i = 0; i < Object.keys(JINSHU_ACC_TYPE).length; i++) {
            let key = Object.keys(JINSHU_ACC_TYPE)[i];
            let v = JINSHU_ACC_TYPE[key];
            let comitem = instantiate(item);
            comitem[`curtype`] = key;
            comitem.parent = sc.getComponent(ScrollView).content;
            comitem.getComponentInChildren(Label).string = v;
            comitem.active = true;
        }
        // if (this.para.totalPage == 0) {
        //     this.para.totalPage = 1;
        // }
        // this.totalPage = this.para.totalPage;
        // this.node.getChildByName("contentNode").getChildByName("pages").getComponent(Label).string = this.para.page + "/" + this.para.totalPage;
    }

    onTypeStateClick(e) {
        this.onXialaClick(null, "2");
        let custom = e.target[`curtype`];
        if (this.state == Number(custom)) return;
        this.state = Number(custom);
        this.AT_stateLbl.getComponent(Label).string = this.getChangeType(custom);
        this.curPage = 0;
        this.requestRecord();
    }

    getChangeType(type) {
        if (type in JINSHU_ACC_TYPE) {
            return JINSHU_ACC_TYPE[type];
        } else {
            return "全部类型";
        }
    }


    onXialaClick(e, custom) {
        if (custom == "1") {
            let node = this.node.getChildByPath("contentNode/content/time");
            node.getChildByName("lakai").active = !node.getChildByName("lakai").active;
        } else if (custom == "2") {
            let node = this.node.getChildByPath("contentNode/content/status");
            node.getChildByName("lakai").active = !node.getChildByName("lakai").active;
        }
    }

    onTypeTimeClick(e, custom) {
        this.onXialaClick(null, "1");
        if (this.day == Number(custom)) return;
        this.day = Number(custom);
        this.AT_dayLbl.getComponent(Label).string = this.getDayStr(custom);
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
        let reqdata;
        // if (this.type == "0") {
        if (this.state == 0) {
            reqdata = { timeStatus: this.day, page: this.curPage, pageLength: 7 }
        } else {
            reqdata = { changeType: this.state, timeStatus: this.day, page: this.curPage, pageLength: 7 }
        }
        // } else {
        //     reqdata = { allStatus: this.state, timeStatus: this.day, page: 0, pageLength: 50, classCode: this.type }
        // }
        this.node.getChildByPath("contentNode/content/sc").getComponent(ScrollView).content.destroyAllChildren();
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/account-details", reqdata);
        if (resp.code == 200) {
            if (resp.data.totalPage == 0) {
                resp.data.totalPage = 1;
            }
            // this.node.getChildByName("content").getChildByName("pages").getComponent(Label).string = resp.data.page + "/" + resp.data.totalPage;
            this.listData = resp.data.list;
            this.curPage = resp.data.page;
            this.totalPage = resp.data.totalPage;
            this.AT_NoRecord.active = this.listData.length == 0;
            for (let i = 0; i < this.listData.length; i++) {
                let v = instantiate(this.AT_TempItem);
                v.getComponent(AccountRecordItem).updateItem(this.listData[i], i);
                v.setPosition(v3(0, 0));
                v.active = true;
                v.setParent(this.node.getChildByPath("contentNode/content/sc").getComponent(ScrollView).content);
                v.getComponent(GridItemAni).startAnimation(i);
            }
            // this.scList.getComponent(List).numItems = this.listData.length;
        } else {
            DefaultToast.instance.showText(resp.msg);
        }
    }

    public onListRender(item: Node, idx) {
        let data = this.listData[idx];
        item.getComponent(AccountRecordItem).updateItem(data, idx);
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(AccountRecordPanel);
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