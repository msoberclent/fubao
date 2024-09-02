import { EditBox, Label, Node, Sprite, _decorator, macro } from "cc";
import { BaseEvent } from "../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { PiterDirector } from "../../../../Piter.Framework/PiterDirector";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { ServerConfig } from "../../constant/ServerConst";
import { GamePlayerManager } from "../../manager/GamePlayerManager";
import { ScrollToLeftInPanel } from "../panel/ScrollToLeftInPanel";

const { ccclass, property } = _decorator;

@ccclass('BindPhonePanel')
export class BindPhonePanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "hall/prefabs/BindPhonePanel";

    protected static className = "BindPhonePanel";

    @PiterDirector.AUTO_BIND(EditBox)
    AT_input1: EditBox;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input3: EditBox;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input4: EditBox;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input2: EditBox;
    @PiterDirector.AUTO_BIND(Node)
    AT_SendBtn: Node;
    phonenum = "";
    callback = null;
    father = null;

    public createChildren(): void {
        super.createChildren();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    init(paramsData: any): void {
        if (paramsData && paramsData.callback) {
            this.callback = paramsData.callback;
        }
        if (paramsData && paramsData.father) {
            this.father = paramsData.father;
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
        if (this.AT_input1.string == "" || this.AT_input1.string.length != 11) {
            DefaultToast.instance.showText("手机号码不正确");
            return;
        }
        if (this.AT_input2.string == "") {
            DefaultToast.instance.showText("请输入验证码");
            return;
        }
        if (this.AT_input3.string == "") {
            DefaultToast.instance.showText("请输入登录密码");
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/bind-phone", { phone: this.AT_input1.string, code: this.AT_input2.string, pwd: this.AT_input3.string });
        if (data.code == 200) {
            DefaultToast.instance.showText("绑定成功", data.msg);
            // if (this.father) {
            //     this.father.updatePhone(this.AT_input1.string);
            // }
            Global.EVENT.dispatchEvent(BaseEvent.USER_PHONE_UPDATE);
            GamePlayerManager.instance.player.phone = this.AT_input1.string.trim();
            // this.AT_closeBtnTouch();
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    async AT_SendBtnTouch() {
        if (this.shucdetime > 0) {
            return;
        }
        this.phonenum = this.AT_input1.string;
        if (this.phonenum == "" || this.phonenum.length != 11) {
            DefaultToast.instance.showText("手机号码不正确");
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

    AT_closeBtnTouch(): void {
        this.callback && this.callback();
        if (this.father && this.father.initUI) {
            this.father.initUI();
        }
        Global.UI.closeView(BindPhonePanel);
    }
}