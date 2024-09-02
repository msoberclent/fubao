import { Label, Node, Sprite, Toggle, _decorator, instantiate, v3 } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { FullScreenView } from "../FullScreenView";
import { VIPItem } from "./VIPItem";

const { ccclass, property } = _decorator;
@ccclass('VIPDetailPanel')
export class VIPDetailPanel extends FullScreenView {
    protected static prefabUrl = "vip/prefabs/VIPDetailPanel";

    protected static className = "VIPDetailPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_VipList: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_vipItem: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_vipListItem: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_Lijin: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Hongbao: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_JIajie: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_tabel: Node;
    father = null;

    public createChildren(): void {
        super.createChildren();
        this.initUI();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    init(param) {
        this.father = param;
    }

    initUI() {
        let vipcfg = this.father.vipCfg;
        for (let i = 0; i < vipcfg.length; i++) {
            let v = instantiate(this.AT_vipItem);
            v.getChildByPath("no/Node").getComponent(Label).string = "VIP" + vipcfg[i].vipLevel;
            v.getChildByPath("select/Node").getComponent(Label).string = "VIP" + vipcfg[i].vipLevel;
            v.getComponent(Toggle).checkEvents[0].customEventData = i + "";
            v.active = true;
            v.setParent(this.AT_VipList);
            v.setPosition(v3(0, 0));
        }
        this.freshDetailInfo(null, "0");
    }

    freshDetailInfo(e, custom) {
        let data = this.father.vipCfg[custom];
        let ext = JSON.parse(data.vipExt);
        this.AT_vipListItem.getComponent(VIPItem).setParam(this.father.curLevel, this.father.curflow, this.father.curstore);
        this.AT_vipListItem.getComponent(VIPItem).updateItem(data, Number(custom));
        this.AT_Lijin.getComponent(Label).string = ext.upGiftMoney + "元";
        this.AT_JIajie.getComponent(Label).string = ext.dayGiftMoney + "元";
        this.AT_Hongbao.getComponent(Label).string = ext.redMoney + "元";
    }

    onTabelClick(e, custom) {
        ImageUtils.showImage(this.AT_tabel.getComponent(Sprite), "vip/res/vip_render_tabel" + custom);
    }

    AT_BackBtnTouch() {
        Global.UI.closeView(VIPDetailPanel);
    }
}