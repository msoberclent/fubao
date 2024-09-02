import { EditBox, Label, Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameEvent } from "../../../model/event/GameEvent";
import { GameUtils } from "../../../utils/GameUtils";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
const { ccclass, property } = _decorator;
@ccclass('ThirdPayAddPanel')
export class ThirdPayAddPanel extends ScrollToLeftInPanel {

    protected static prefabUrl = "bank/prefabs/ThirdPayAddPanel";

    protected static className = "ThirdPayAddPanel";

    protected lockReq: boolean = false;

    protected curSelectType: string = ""

    protected cardType: number = 2;

    protected mineClass: any = ThirdPayAddPanel;

    @PiterDirector.AUTO_BIND(EditBox)
    AT_CardEdit: EditBox
    @PiterDirector.AUTO_BIND(Node)
    AT_WalletLabel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_XialaBtn: Node;
    config = null;

    payMathod = ["", "", "OKPay", "TOPay", "万币钱包", "K豆支付", "币通钱包"]

    public createChildren(): void {
        super.createChildren();
        for (let i = 2; i < this.payMathod.length; i++) {
            if (this.config.withdrawalOpen.indexOf(i + "") == -1) {
                this.AT_XialaBtn.getChildByPath(`lakai/item${i - 1}`).active = false;
            }
        }
    }

    init(param) {
        this.config = param;
    }

    public onToggleTouch(e, curstorm) {
        this.curSelectType = curstorm;
    }

    AT_BackBtnTouch() {
        Global.UI.closeView(this.mineClass);
    }

    public async AT_ZTBtnTouch() {
        let str = await GameUtils.getClipBoardStr();
        if (!str) {
            return;
        }
        this.AT_CardEdit.string = str;
    }

    async AT_EnterBtnTouch() {
        let card = this.AT_CardEdit.string;
        if (card.trim().length < 1) {
            DefaultToast.instance.showText("请输入正确的收款地址");
            return;
        }
        let withdrawMethod = await GamePlayerManager.instance.getMineWithdrawMethodByType(this.cardType);
        let data = {
            type: this.cardType,
            realName: "",
            provider: this.payMathod[this.cardType],
            notes: "",
            accountAddr: card,
            isdefault: withdrawMethod.length == 0 ? 1 : 0
        }
        if (this.lockReq) {
            return;
        }
        this.lockReq = true;
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/cash-account-add", data, true);
        if (resp.code == 200) {
            DefaultToast.instance.showText("添加成功", resp.msg);
            let all = await GamePlayerManager.instance.getMineWithdrawMethod();
            all.push(resp.data);
            Global.EVENT.dispatchEvent(GameEvent.WITH_METHOD_UPDATE);
            Global.UI.closeView(this.mineClass)
        } else {
            this.lockReq = false;
            DefaultToast.instance.showText(resp.msg)
        }
    }

    onMathodClick(e, custom) {
        this.cardType = Number(custom);
        this.AT_WalletLabel.getComponent(Label).string = this.payMathod[Number(custom)];
        this.AT_XialaBtn.getChildByName("lakai").active = false;
    }

    xialaBtnClick() {
        this.AT_XialaBtn.getChildByName("lakai").active = !this.AT_XialaBtn.getChildByName("lakai").active;
    }


}