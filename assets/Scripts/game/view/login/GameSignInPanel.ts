import { EditBox, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D, _decorator, isValid, macro, sys } from 'cc';
import { LocalStorageData } from '../../../../Piter.Framework/BaseKit/Data/LocalStorageData';
import { PiterDirector } from '../../../../Piter.Framework/PiterDirector';
import Global from '../../../../Piter.Framework/PiterGlobal';
import { DefaultToast } from '../../../../Piter.Framework/UIKit/Example/DefaultToast';
import ButtonUtils from '../../../../Piter.Framework/UIKit/Util/ButtonUtils';
import { ImageUtils } from '../../../../Piter.Framework/UIKit/Util/ImageUtils';
import { ServerConfig } from '../../constant/ServerConst';
import { GamePlayerManager } from '../../manager/GamePlayerManager';
import { GameUtils } from '../../utils/GameUtils';
import { ScrollToBottomInPanel } from '../panel/ScrollToBottomInPanel';
import { InputAccView } from './InputAccView';
const { ccclass, property } = _decorator;

@ccclass('GameSignInPanel')
export class GameSignInPanel extends ScrollToBottomInPanel {
    protected static prefabUrl = "login/prefabs/GameSignInPanel";

    protected static className = "GameSignInPanel";

    @PiterDirector.AUTO_BIND(EditBox)
    AT_input1: EditBox;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input2: EditBox;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input3: EditBox;
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input4: EditBox;
    @PiterDirector.AUTO_BIND(Node)
    AT_input5: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_sendBtn: Node;

    @PiterDirector.AUTO_BIND(EditBox)
    AT_ImageInput: EditBox;

    @PiterDirector.AUTO_BIND(Sprite)
    AT_ImageCapta: Sprite
    @PiterDirector.AUTO_BIND(Node)
    AT_seePasswordBtn: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_seePassword2Btn: Node;

    phonenum = "";

    useType: number = 1;

    captId = "";

    public lockReq: boolean = false;
    private async flushCapta() {
        if (this.lockReq) {
            return;
        }
        this.lockReq = true
        let requst = await Global.HTTP.sendGetRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/tool/captchaImage?t=" + Date.now(), {});
        if (requst.code == 200) {
            let imageStr = "data:image/png;base64," + requst.data.img;
            let image = new Image();
            image.src = imageStr;
            image.onload = (ev) => {
                if (isValid(this.AT_ImageCapta)) {
                    this.AT_ImageCapta.spriteFrame = null;
                    let texture = new Texture2D();
                    texture.image = new ImageAsset(image);
                    let spriteFrame = new SpriteFrame();
                    spriteFrame.texture = texture;
                    this.AT_ImageCapta.spriteFrame = spriteFrame
                    this.lockReq = false
                }
                //测试下载

            }
            this.captId = requst.data.uuid;
        } else {
            this.lockReq = false
        }
    }

    AT_seePasswordBtnTouch() {
        let _editState = this.AT_input4.getComponent(EditBox).inputFlag;
        if (_editState == 0) {
            this.AT_input4.getComponent(EditBox).inputFlag = 5;
            ImageUtils.showImage(this.AT_seePasswordBtn.getComponentInChildren(Sprite), "login/res/login_see_password2")
        } else {
            this.AT_input4.getComponent(EditBox).inputFlag = 0;
            ImageUtils.showImage(this.AT_seePasswordBtn.getComponentInChildren(Sprite), "login/res/login_see_password")
        }
    }

    AT_seePassword2BtnTouch() {
        let _editState = this.AT_input2.getComponent(EditBox).inputFlag;
        if (_editState == 0) {
            this.AT_input2.getComponent(EditBox).inputFlag = 5;
            ImageUtils.showImage(this.AT_seePassword2Btn.getComponentInChildren(Sprite), "login/res/login_see_password2")
        } else {
            this.AT_input2.getComponent(EditBox).inputFlag = 0;
            ImageUtils.showImage(this.AT_seePassword2Btn.getComponentInChildren(Sprite), "login/res/login_see_password")
        }
    }
    public locationData = {
        j: 0,
        w: 0
    };
    public async createChildren() {
        super.createChildren();
        //获取定位权限
        let inviteData = GamePlayerManager.instance.inviteData;
        if (GamePlayerManager.instance.allowSendCode) {
            this.node.getChildByPath("contentNode/common_tk_bg/vicode").active = true;
            // this.node.getChildByName("contentNode").getChildByName("imagecode").active = false;
            this.useType = 1;
        } else {
            this.node.getChildByPath("contentNode/common_tk_bg/imagecode").active = true
            // this.node.getChildByName("contentNode").getChildByName("vicode").active = false;
            this.useType = 2;
            this.flushCapta();
        }
        let code = ""
        if (inviteData && inviteData.bindData && inviteData.bindData.inviteCode) {
            code = inviteData.bindData.inviteCode;
        }
        // if (code) {
        //     this.AT_input5.getComponent(Label).string = Global.LANG.getLang(126) + code;
        // } else {
        //     this.AT_input5.getComponent(Label).string = "";//Global.LANG.getLang(127);
        // }
        let locationData = await GameUtils.getPlayerLocation();
        this.locationData = locationData;
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    //关闭
    AT_closeBtnTouch() {
        Global.UI.closeView(GameSignInPanel);
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

    async AT_submitBtnTouch() {
        if (this.AT_input1.string == "") {
            DefaultToast.instance.showText("请输入账户名");
            return;
        }
        // if (this.AT_input2.string == "") {
        //     DefaultToast.instance.showText("请输入验证码");
        //     return;
        // }
        if (this.AT_input4.string == "") {
            DefaultToast.instance.showText("请输入密码");
            return;
        }
        if (this.AT_input4.string.length < 6) {
            DefaultToast.instance.showText("密码至少6位");
            return;
        }
        if (this.AT_input2.string != this.AT_input4.string) {
            DefaultToast.instance.showText("密码不一致");
            return;
        }

        let chapta = this.AT_ImageInput.string.trim();
        if (this.useType == 2 && chapta == "") {
            DefaultToast.instance.showText("请输入图形验证码");
            return
        }


        let inviteData = GamePlayerManager.instance.inviteData;
        let code = ""
        if (inviteData && inviteData.bindData && inviteData.bindData.inviteCode) {
            code = inviteData.bindData.inviteCode;
        }
        let loginData: any = {
            loginName: this.AT_input1.string,
            phone: "",
            code: this.AT_input3.string,
            pwd: this.AT_input4.string,
            realName: "",
            invitedCode: code,
            captchaCode: chapta,
            type: 2,
            captchaId: this.captId
        };
        let osType = "H5";
        if (sys.os == sys.OS.ANDROID) {
            osType = "Android";
        } else if (sys.os == sys.OS.IOS) {
            osType = "IOS";
        }
        let deviceInfo = await GameUtils.getDeviceInfo()
        let dv = await GameUtils.getUniId();
        let deviceData = {
            deviceName: deviceInfo.model || "",
            deviceCode: dv,
            devicePlat: osType
        }
        loginData.deviceInfo = deviceData;
        if (this.locationData) {
            loginData.longitude = this.locationData.j;
            loginData.latitude = this.locationData.w;
        } else {
            loginData.longitude = 0;
            loginData.latitude = 0;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/user-regist", loginData);
        if (data.code == 200) {
            DefaultToast.instance.showText("注册成功", data.msg);
            LocalStorageData.setItem("user_name", this.AT_input1.string);
            LocalStorageData.setItem("user_pass", this.AT_input3.string);
            Global.UI.openView(InputAccView, this.paramsData);
            Global.UI.closeView(GameSignInPanel);
        } else {
            this.flushCapta();
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
}
