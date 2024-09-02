import { EditBox, Label, Node, Sprite, _decorator, macro } from 'cc';
import { LocalStorageData } from '../../../../Piter.Framework/BaseKit/Data/LocalStorageData';
import { PiterDirector } from '../../../../Piter.Framework/PiterDirector';
import Global from '../../../../Piter.Framework/PiterGlobal';
import { DefaultToast } from '../../../../Piter.Framework/UIKit/Example/DefaultToast';
import ButtonUtils from '../../../../Piter.Framework/UIKit/Util/ButtonUtils';
import { ServerConfig } from '../../constant/ServerConst';
import { GameUtils } from '../../utils/GameUtils';
import { ScrollToLeftInPanel } from '../panel/ScrollToLeftInPanel';
const { ccclass, property } = _decorator;

@ccclass('GameFindPasswardPanel')
export class GameFindPasswardPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "login/prefabs/GameFindPasswardPanel";

    protected static className = "GameFindPasswardPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_sendBtn: Node;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input1: EditBox;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input2: EditBox;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input3: EditBox;

    phonenum = "";
    public createChildren(): void {
        super.createChildren();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    shucdetime = 0;
    startSchudule() {
        this.shucdetime = 60;
        this.AT_sendBtn.getChildByName("txt").getComponent(Label).string = this.shucdetime + "s后重新发送";
        this.schedule(this._countdown, 1, macro.REPEAT_FOREVER);
    }

    _countdown() {
        if (this.shucdetime < 0) return;
        this.shucdetime -= 1;
        if (this.shucdetime <= 0) {
            ButtonUtils.setGray(this.AT_sendBtn.getComponent(Sprite), false);
            this.AT_sendBtn.getChildByName("txt").active = false;
            this.AT_sendBtn.getChildByName("sign_txt1").active = true;
            this.unschedule(this._countdown);
        }
        this.AT_sendBtn.getChildByName("txt").getComponent(Label).string = this.shucdetime + "s后重新发送";
    }


    //关闭
    AT_closeBtnTouch() {
        Global.UI.closeView(GameFindPasswardPanel);
    }

    async AT_sendBtnTouch() {
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
            this.AT_sendBtn.getChildByName("txt").active = true;
            this.AT_sendBtn.getChildByName("sign_txt1").active = false;
            ButtonUtils.setGray(this.AT_sendBtn.getComponent(Sprite), true);
        } else {
            DefaultToast.instance.showText(data.msg);
        }
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
            DefaultToast.instance.showText("请输入密码");
            return;
        }
        if (this.AT_input3.string.length < 6) {
            DefaultToast.instance.showText("密码至少6位");
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/forget-pwd", { phone: this.AT_input1.string, code: this.AT_input2.string, pwd: this.AT_input3.string });
        if (data.code == 200) {
            DefaultToast.instance.showText("绑定成功", data.msg);
            LocalStorageData.setItem("user_name", this.AT_input1.string);
            LocalStorageData.setItem("user_pass", this.AT_input3.string);
            Global.UI.closeView(GameFindPasswardPanel);
            // Global.UI.openView(InputAccView, { father: Global.UI.getUI(GameLoginView).getComponent(GameLoginView) })
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    //输入手机号
    onPhoneNumEdit(e, custom) {

    }

    //输入验证码
    onValiCodeEdit(e, custom) {

    }

    //输入密码
    onPassWordEdit(e, custom) {

    }

    //验证密码
    onPassWordComfirmEdit(e, custom) {

    }

    async AT_kefuBtnTouch() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/customer-service/list", {});
        if (resp.code == 200) {
            let data = resp.data;
            if (data.length > 0) {
                let url = data[0][`line`];
                GameUtils.goUrl(url);
                // Global.UI.openView(MainKeFuPanel, {
                //   url: url
                // });
            }
        }
    }
}
