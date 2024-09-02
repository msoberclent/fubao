import { EditBox, Label, Node, Sprite, _decorator, macro, sys } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameUtils } from "../../../utils/GameUtils";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { BindPhonePanel } from "../BindPhonePanel";

const { ccclass, property } = _decorator;
@ccclass('SafeModifyXJMMPanel')
export class SafeModifyXJMMPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "usercenter/prefabs/SafeModifyXJMMPanel";

    protected static className = "SafeModifyXJMMPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_PassWordEdit: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_RePassWordEdit: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_CodeEdit: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_SendBtn: Node;

    father = null;

    public createChildren(): void {
        super.createChildren();
    }

    init(paramsData: any): void {
        if (paramsData && paramsData.father) {
            this.father = paramsData.father;
        }
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(SafeModifyXJMMPanel);
    }


    async AT_SendBtnTouch() {
        let phone = GamePlayerManager.instance.player.phone;
        if (phone == "" || phone.length != 11) {
            // DefaultToast.instance.showText("手机号码不正确");
            DefaultAlertView.addOnlyAlert(`请先绑定手机号码`, () => {
                Global.UI.openView(BindPhonePanel);
            })
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/tool/send-code", { phone: phone });
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
        let passWord = this.AT_RePassWordEdit.getComponent(EditBox).string.trim();//新密码
        let rePassWord = this.AT_CodeEdit.getComponent(EditBox).string.trim();//确认新密码
        let code = this.AT_PassWordEdit.getComponent(EditBox).string.trim(); //原密码
        // if (!Global.PLAYER.player.phone) {
        //     DefaultAlertView.addOnlyAlert(`请先绑定手机号码`, () => {
        //         Global.UI.openView(BindPhonePanel);
        //     })
        //     return;
        // }
        if (!passWord || !rePassWord || passWord != rePassWord) {
            DefaultToast.instance.showText("两次密码输入不一致");
            return;
        }

        if (passWord.length < 6) {
            DefaultToast.instance.showText("密码至少6位");
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/update-payPwd-new", { payPwd: passWord, oldPayPwd: code });
        if (data.code == 200) {
            DefaultToast.instance.showText("修改成功", data.msg);
            Global.UI.closeView(SafeModifyXJMMPanel);
            Global.PLAYER.player.payPwdSeted = true;
            if (this.father) {
                this.father.updateXJMMStatus();
            }
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    async AT_KefuBtnTouch() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/customer-service/list", {});
        if (resp.code == 200) {
            let data = resp.data;
            if (data.length > 0) {
                let url = data[0][`line`];
                if (sys.isBrowser) {
                    window.open(url);
                } else {
                    GameUtils.goUrl(url);
                }
            }
        }
    }

}
