import { EditBox, Label, Node, Toggle, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PrograssBarUtils } from "../../../../../Piter.Framework/CompKit/PrograssBarUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";

const { ccclass, property } = _decorator;
@ccclass('SecretBoxPanel')
export class SecretBoxPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "secretbox/prefabs/SecretBoxPanel";

    protected static className = "SecretBoxPanel";
    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.secretbox]
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_content0: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_content1: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_content2: Node;
    // @PiterDirector
    @PiterDirector.AUTO_BIND(Node)
    AT_prograss: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_bar: Node;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_inputcnt: EditBox;
    @PiterDirector.AUTO_BIND(Node)
    AT_takeMoney: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_saveMoney: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_prograss2: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_bar2: Node;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_inputcnt2: EditBox;
    @PiterDirector.AUTO_BIND(Node)
    AT_takeMoney2: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_saveMoney2: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_inputcnt1: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_inputID1: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_inputmm1: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_confirmZZBtn: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_takefreshMoney: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_savefreshMoney2: Node;


    public createChildren(): void {
        super.createChildren();
        this.initTabList();
        this.initUI();
        // Global.SOUND.playEffectPauseMusic(BaseConstant.ONE_DAY_TIME, `back/sound/baoxianxiang_tishi`, 4)
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    tabIndex: number[];

    @PiterDirector.AUTO_BIND(Node)
    AT_TempNode: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Tab: Node

    public initTabList() {
        // this.tabIndex = [1, 2, 3];
        // // this.tabIndex = [1, 2]
        // let str = ["存款", "取款", "金币划转"];
        // for (let i = 0; i < this.tabIndex.length; i++) {
        //     let tabIndex = this.tabIndex[i];
        //     let tabItem = instantiate(this.AT_TempNode);
        //     tabItem.active = true;
        //     tabItem.parent = this.AT_Tab;
        //     tabItem.getComponent(Toggle).clickEvents[0].customEventData = tabIndex + ""
        //     tabItem.getComponent(CommonTabItem).setText(str[i]);
        // }
        let index = this.paramsData.tabIndex || "1";
        this.onBtnSwitchPage(null, index);
    }

    initUI() {
        this.AT_saveMoney.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.safety);
        this.AT_takeMoney.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
        this.AT_takefreshMoney.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
        this.AT_saveMoney2.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.safety);
        this.AT_savefreshMoney2.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.safety);
        this.AT_takeMoney2.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
        this.AT_Tab.getChildByName("item3").active = GamePlayerManager.instance.clientConfig.CLENT_USER_HUAZHUAN_SWITCH == "1";
        this.AT_content2.getChildByPath("hdzx_1/common_mask/curyue").getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.safety)
        this.AT_prograss.getComponent(PrograssBarUtils).init(() => {
            let pro = this.AT_prograss.getComponent(PrograssBarUtils).getPrograss();
            if (!pro) return;
            this.AT_inputcnt.string = GoldUtils.formatGold(pro * GamePlayerManager.instance.player.gold);
        })
        this.AT_prograss2.getComponent(PrograssBarUtils).init(() => {
            let pro = this.AT_prograss2.getComponent(PrograssBarUtils).getPrograss();
            if (!pro) return;
            this.AT_inputcnt2.string = GoldUtils.formatGold(pro * GamePlayerManager.instance.player.safety);
        })
    }

    onBtnSwitchPage(e, custom) {
        this.AT_content0.active = this.AT_content1.active = this.AT_content2.active = false;
        if (custom == "1") {
            this.AT_content0.active = true;
            if (GamePlayerManager.instance.player.gold <= 0) {
                this.AT_prograss.getComponent(PrograssBarUtils).enabled = false;
            } else {
                this.AT_prograss.getComponent(PrograssBarUtils).enabled = true;
            }
        } else if (custom == "2") {
            this.AT_content1.active = true;
            if (GamePlayerManager.instance.player.safety <= 0) {
                this.AT_prograss2.getComponent(PrograssBarUtils).enabled = false;
            } else {
                this.AT_prograss2.getComponent(PrograssBarUtils).enabled = true;
            }
        }
        else if (custom == "3") {
            this.AT_content2.active = true;
            this.AT_content2.getChildByPath("hdzx_1/common_mask/curyue").getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold)
        }

        this.AT_Tab.getChildByName(`item${custom}`).getComponent(Toggle).isChecked = true;
    }

    AT_saveclearBtnTouch() {
        this.AT_inputcnt.string = "0";
        this.AT_prograss.getComponent(PrograssBarUtils).setPrograss(0);
    }

    AT_savemaxBtnTouch() {
        this.AT_inputcnt.string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
        this.AT_prograss.getComponent(PrograssBarUtils).setPrograss(1);
    }

    AT_saveclearBtn2Touch() {
        this.AT_inputcnt2.string = "0";
        this.AT_prograss2.getComponent(PrograssBarUtils).setPrograss(0);
    }

    AT_savemaxBtn2Touch() {
        this.AT_inputcnt2.string = GoldUtils.formatGold(GamePlayerManager.instance.player.safety);
        this.AT_prograss2.getComponent(PrograssBarUtils).setPrograss(1);
    }

    async AT_saveBtnTouch() {
        let savemoney = Number(this.AT_inputcnt.string);
        if (savemoney == 0) {
            DefaultToast.instance.showText("请输入金额");
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/safety-op", { change: savemoney / GoldUtils.GOLD_RATE });
        if (data.code == 200) {
            DefaultToast.instance.showText("存入成功", data.msg);
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    oninput1EditEnd() {
        let str: any = this.AT_inputcnt.string;
        if (Number(str) * 100 > GamePlayerManager.instance.player.gold) {
            str = GamePlayerManager.instance.player.gold * GoldUtils.GOLD_RATE;
            this.AT_inputcnt.string = GamePlayerManager.instance.player.gold * GoldUtils.GOLD_RATE + ""
        }
        let pro = Number(str) / (GamePlayerManager.instance.player.gold * GoldUtils.GOLD_RATE);
        this.AT_prograss.getComponent(PrograssBarUtils).setPrograss(pro);
    }

    oninput2EditEnd() {
        let str: any = this.AT_inputcnt2.string;
        if (Number(str) * 100 > GamePlayerManager.instance.player.safety) {
            str = GamePlayerManager.instance.player.safety * GoldUtils.GOLD_RATE;
            this.AT_inputcnt2.string = GamePlayerManager.instance.player.safety * GoldUtils.GOLD_RATE + ""
        }
        let pro = Number(str) / (GamePlayerManager.instance.player.safety * GoldUtils.GOLD_RATE);
        this.AT_prograss2.getComponent(PrograssBarUtils).setPrograss(pro);
    }

    async flushGold() {
        this.initUI();
    }

    async AT_confirmZZBtnTouch() {
        let zhJine = this.AT_inputcnt1.getComponent(EditBox).string;
        let yhId = this.AT_inputID1.getComponent(EditBox).string;
        let xjMM = this.AT_inputmm1.getComponent(EditBox).string;
        if (!zhJine || zhJine == "") {
            return DefaultToast.instance.showText("请输入划转金额");
        }
        if (!yhId || yhId == "") {
            return DefaultToast.instance.showText("请输入用户ID");
        }
        if (!xjMM || xjMM == "") {
            return DefaultToast.instance.showText("请输入现金密码");
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/safety-transfer-accounts", { change: Number(zhJine) / GoldUtils.GOLD_RATE, payPwd: xjMM, targetId: yhId });
        if (data.code == 200) {
            let player = GamePlayerManager.instance.player;
            // player.gold = data.data.userAccount.gold;
            player.gold = player.gold - Number(zhJine) / GoldUtils.GOLD_RATE;
            this.AT_inputcnt1.getComponent(EditBox).string = "0";
            DefaultToast.instance.showText("划转成功", data.msg);
            this.initUI();
        } else {
            DefaultToast.instance.showText(data.msg);
        }

    }

    async AT_saveBtn2Touch() {
        let savemoney = Number(this.AT_inputcnt2.string);
        if (savemoney == 0) {
            DefaultToast.instance.showText("请输入金额");
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/safety-op", { change: -savemoney / GoldUtils.GOLD_RATE });
        if (data.code == 200) {
            let player = GamePlayerManager.instance.player;
            player.gold = data.data.userAccount.gold;
            player.safety = data.data.userAccount.safety;
            DefaultToast.instance.showText("取出成功", data.msg);
            this.initUI();
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    onBtnwithdrawRecord() {
        // RESLoading.instance.loadGroup([BundlesInfo.main_withdraw], () => {
        // Global.UI.openView(WithdrawRecordPanel);
        // });
    }

    async onBtnFreshYue() {
        await GamePlayerManager.instance.updatePlayerInfo(true);
        this.AT_takefreshMoney.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
    }

    async onBtnFreshQainbao() {
        await GamePlayerManager.instance.updatePlayerInfo(true);
        this.AT_savefreshMoney2.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
    }

    async AT_closeBtnTouch() {
        Global.UI.closeView(SecretBoxPanel)
    }


}