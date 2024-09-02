import { Label, Node, _decorator, instantiate, v3 } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";

const { ccclass, property } = _decorator;
@ccclass('KuiSunDetailUI')
export class KuiSunDetailUI extends PiterPanel {
    protected static prefabUrl = "prefabs/KuiSunDetailUI";

    protected static className = "KuiSunDetailUI";

    @PiterDirector.AUTO_BIND(Node)
    AT_dataItem: Node;

    @property(Node)
    AT_layout: Node = null;

    info = null;
    totalPage = 1;
    curPage = 1;

    public createChildren(): void {
        super.createChildren();
        this.requestList();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    init(paramsData: any): void {
        this.info = paramsData.data;
    }

    async requestList() {
        let id = this.info;
        let page = this.curPage;
        let pageLen = 6;
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/kuishun-detail", { id: id, page: page, pageLength: pageLen });
        if (data.code != 200) {
            DefaultToast.instance.showText(data.msg);
        } else {
            this.totalPage = data.data.totalPage;
            this.contentNode.getChildByName("pages").getComponent(Label).string = data.data.page + "/" + data.data.totalPage;
            this.initList(data.data.list);
        }
    }

    initList(arr) {
        this.AT_layout.children.forEach((v) => {
            v.active = false;
        })
        for (let i = 0; i < arr.length; i++) {
            let item = this.AT_layout.children[i];
            if (!item) {
                item = instantiate(this.AT_dataItem);
                item.setParent(this.AT_layout);
                item.setPosition(v3(0, 0));
            }
            item.active = true;
            item.getChildByName("id").getComponent(Label).string = arr[i].uid;
            item.getChildByName("recharge").getComponent(Label).string = GoldUtils.formatGold(arr[i].chargeTotal);
            item.getChildByName("bet").getComponent(Label).string = GoldUtils.formatGold(arr[i].betTotal);
            item.getChildByName("jiesuan").getComponent(Label).string = GoldUtils.formatGold(arr[i].gameChangeTotal);
            item.getChildByName("yeji").getComponent(Label).string = GoldUtils.formatGold(arr[i].flowTotal);
            item.getChildByName("yeji-001").getComponent(Label).string = GoldUtils.formatGold(arr[i].rewardTotal);
        }
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(KuiSunDetailUI);
    }

    /**
     * 首页
     */
    AT_firstPageBtnTouch() {
        if (this.curPage == 1) return;
        this.curPage = 1;
        this.requestList();
    }

    /**
     * 尾页
     */
    AT_lastPageBtnTouch() {
        if (this.curPage == this.totalPage) return;
        this.curPage = this.totalPage;
        this.requestList();
    }

    /**
     * 上一页
     */
    AT_zhuanshuLastBtnTouch() {
        this.curPage -= 1;
        if (this.curPage < 1) {
            this.curPage += 1;
            return;
        }
        this.requestList();
    }

    /**
     * 下一页
     */
    AT_zhuanshuNextBtnTouch() {
        this.curPage += 1;
        if (this.curPage > this.totalPage) {
            this.curPage -= 1;
            return;
        }
        this.requestList();
    }
}