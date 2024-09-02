import { EditBox, Label, Node, Sprite, _decorator, macro } from "cc";
import { LocalStorageData } from "../../../../../Piter.Framework/BaseKit/Data/LocalStorageData";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { BindPhonePanel } from "../BindPhonePanel";


const { ccclass, property } = _decorator;
@ccclass('SafeModifymmPanel')
export class SafeModifymmPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "usercenter/prefabs/SafeModifymmPanel";

    protected static className = "SafeModifymmPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_PassWordEdit: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_RePassWordEdit: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_default: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_CodeEdit: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_SendBtn: Node;

    openType = null;
    phonenum = "";


    public createChildren(): void {
        super.createChildren();
        if (this.openType) this.AT_default.active = true;
    }

    init(paramsData: any): void {
        this.openType = paramsData && paramsData.openType ? paramsData.openType : null;;
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(SafeModifymmPanel);
    }

    async AT_SendBtnTouch() {
        if (this.shucdetime > 0) {
            return;
        }
        this.phonenum = GamePlayerManager.instance.player.phone;
        if (this.phonenum == "" || this.phonenum.length != 11) {
            DefaultAlertView.addOnlyAlert(`请先绑定手机号码`, () => {
                Global.UI.openView(BindPhonePanel);
            })
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/tool/send-code", { phone: this.phonenum });
        if (data.code == 200) {
            DefaultToast.instance.showText("发送成功", data.msg);
            this.startSchudule();
            this.AT_SendBtn.getChildByName("txt").active = true;
            this.AT_SendBtn.getChildByName("sign_txt1").active = false;
            ButtonUtils.setGray(this.AT_SendBtn.getComponent(Sprite), true);
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    shucdetime = 0;
    startSchudule() {
        this.shucdetime = 60;
        this.AT_SendBtn.getChildByName("txt").getComponent(Label).string = this.shucdetime + "s后重新发送";
        this.schedule(this._countdown, 1, macro.REPEAT_FOREVER);
    }

    _countdown() {
        if (this.shucdetime < 0) return;
        this.shucdetime -= 1;
        if (this.shucdetime <= 0) {
            ButtonUtils.setGray(this.AT_SendBtn.getComponent(Sprite), false);
            this.AT_SendBtn.getChildByName("txt").active = false;
            this.AT_SendBtn.getChildByName("sign_txt1").active = true;
            this.unschedule(this._countdown);
        }
        this.AT_SendBtn.getChildByName("txt").getComponent(Label).string = this.shucdetime + "s后重新发送";
    }

    async AT_comfirmBtnTouch() {
        // if (!Global.PLAYER.player.phone) {
        //     DefaultAlertView.addOnlyAlert(`请先绑定手机号码`, () => {
        //         Global.UI.openView(BindPhonePanel);
        //     })
        //     return;
        // }
        if (this.AT_PassWordEdit.getComponent(EditBox).string != this.AT_RePassWordEdit.getComponent(EditBox).string) {
            DefaultToast.instance.showText("两次密码输入不一致");
            return;
        }
        if (this.AT_PassWordEdit.getComponent(EditBox).string == "" || this.AT_RePassWordEdit.getComponent(EditBox).string == "") {
            DefaultToast.instance.showText("密码不能为空");
            return;
        }

        if (this.AT_PassWordEdit.getComponent(EditBox).string.length < 6) {
            DefaultToast.instance.showText("密码至少6位");
            return;
        }

        if (this.AT_CodeEdit.getComponent(EditBox).string == "") {
            DefaultToast.instance.showText("请输入原密码");
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/update-pwd-new", { pwd: this.AT_PassWordEdit.getComponent(EditBox).string, oldPwd: this.AT_CodeEdit.getComponent(EditBox).string.trim() });
        if (data.code == 200) {
            DefaultToast.instance.showText("修改成功", data.msg);
            LocalStorageData.removeItem("user_token");
            Global.UI.closeView(SafeModifymmPanel);
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

}
