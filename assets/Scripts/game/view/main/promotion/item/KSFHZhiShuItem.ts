import { Color, Component, Label, _decorator } from 'cc';
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { ColorConst } from '../../../../constant/GameResConst';
import { FenHongInfoPanel } from '../fenhong/FenHongInfoPanel';
import { ModifyFenHongPanel } from '../fenhong/ModifyFenHongPanel';
const { ccclass, property } = _decorator;

@ccclass('KSFHZhiShuItem')
export class KSFHZhiShuItem extends Component {

    itemData: any;

    info: any;

    setItemData(itemData, i) {
        if (itemData.weekRecharge < 0) {
            itemData.weekRecharge = 0;
        }
        this.itemData = itemData;
        this.flushUI();
    }


    public flushUI() {
        let v = this.node;
        v.getChildByPath("idNode/id").getComponent(Label).string = this.itemData.uid; //ID
        //分红
        v.getChildByPath("gxfhNode/gxfh").getComponent(Label).string = GoldUtils.formatGold(this.itemData.yujiKuishun || 0); //分红
        v.getChildByPath("gxfhNode/gxfh").getComponent(Label).color = this.itemData.yujiKuishun > 0 ? new Color().fromHEX(ColorConst.RED) : new Color().fromHEX(ColorConst.GREEN);
        //充值
        v.getChildByPath("bqczNode/bqcz").getComponent(Label).string = GoldUtils.formatGold(this.itemData.allRecharge || 0); //充值
        v.getChildByPath("bqtxNode/bqtx").getComponent(Label).string = GoldUtils.formatGold(this.itemData.allWithdraw || 0); //提现

        //重提差
        // v.getChildByPath("ctc").getComponent(Label).string = GoldUtils.formatGold(this.itemData.weekRecharge - this.itemData.weekWithdraw) + `(${GoldUtils.formatGold(this.itemData.chongTiChaOne || 0)})`;; //重提差
        // v.getChildByPath("ctc").getComponent(Label).color = this.itemData.weekRecharge - this.itemData.weekWithdraw > 0 ? new Color().fromHEX(ColorConst.RED) : new Color().fromHEX(ColorConst.GREEN);
        //会员层级
        v.getChildByPath("hycjNode/hycj").getComponent(Label).string = this.itemData.nick;
        let addfanyong = this.itemData.addFanyong ? "+" + Number(new Big(this.itemData.addFanyong).mul(100)) + "%" : "";
        let baseFanYong = Number(new Big(this.itemData.baesFanyong).mul(100));
        //比例
        v.getChildByPath("fhblNode/fhbl").getComponent(Label).string = `${baseFanYong}%${addfanyong}`;
        //库存
        // v.getChildByName("gongxian").getComponent(Label).string = GoldUtils.formatGold(this.itemData.goldStockCurrent || 0) + `${GoldUtils.formatGold(this.itemData.goldStockCurrent || 0)}`;
    }


    public onModifyFenHongBtnTouch() {
        Global.UI.openView(ModifyFenHongPanel, this.info);
    }


    public onLookXQBtnTouch() {
        Global.UI.openView(FenHongInfoPanel, { type: 1, info: this.itemData });
    }
}


