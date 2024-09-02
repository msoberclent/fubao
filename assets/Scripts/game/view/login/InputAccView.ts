import { EditBox, Node, Sprite, _decorator, sys } from 'cc';
import { BaseEvent } from '../../../../Piter.Framework/BaseKit/Constant/BaseEvent';
import { LocalStorageData } from '../../../../Piter.Framework/BaseKit/Data/LocalStorageData';
import NetLoadingView from '../../../../Piter.Framework/NetKit/NetLoadingView';
import { PiterDirector } from '../../../../Piter.Framework/PiterDirector';
import Global from '../../../../Piter.Framework/PiterGlobal';
import { ImageUtils } from '../../../../Piter.Framework/UIKit/Util/ImageUtils';
import { ServerConfig } from '../../constant/ServerConst';
import { GameUtils } from '../../utils/GameUtils';
import { ScrollToBottomInPanel } from '../panel/ScrollToBottomInPanel';
import { GameFindPasswardPanel } from './GameFindPasswardPanel';
import { GameSignInPanel } from './GameSignInPanel';
const { ccclass, property } = _decorator;

@ccclass('InputAccView')
export class InputAccView extends ScrollToBottomInPanel {
    protected static prefabUrl = "login/prefabs/InputAccView";

    protected static className = "InputAccView";

    @PiterDirector.AUTO_BIND(EditBox)
    AT_inputID: EditBox;

    @PiterDirector.AUTO_BIND(EditBox)
    AT_inputPass: EditBox;

    @PiterDirector.AUTO_BIND(Node)
    AT_gou: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_seePasswordBtn: Node;
    recordAcc = true;

    public createChildren(): void {
        super.createChildren();
        let name = LocalStorageData.getItem("user_name") || "";
        let pass = LocalStorageData.getItem("user_pass") || "";
        let rec = LocalStorageData.getItem("auto_login");
        if (rec == "0") {
            this.recordAcc = false;
            this.AT_gou.active = false;
        } else if (rec == "1") {
            this.recordAcc = true;
            this.AT_gou.active = true;
        } else {
            this.recordAcc = true;
            this.AT_gou.active = true;
        }
        if (name) {
            this.AT_inputID.string = name;
            if (pass) {
                this.AT_inputPass.string = pass;
            }
        }
    }

    public onAdded(): void {
        super.onAdded();

    }

    public onRemoved(): void {
        super.onRemoved();
    }

    //关闭
    AT_closeBtnTouch() {
        Global.UI.closeView(InputAccView);
    }

    AT_ForgetBtnTouch() {
        Global.UI.openView(GameFindPasswardPanel);
        Global.UI.closeView(InputAccView);
    }

    AT_accLoginBtnTouch() {
        if (this.AT_inputID.string != "" && this.AT_inputPass.string != "") {
            ServerConfig.DEFAULT_NAME = this.AT_inputID.string;
            ServerConfig.DEFAULT_PASS = this.AT_inputPass.string;
            LocalStorageData.setItem("user_name", this.AT_inputID.string);
            if (this.recordAcc) {
                LocalStorageData.setItem("auto_login", "1");
                LocalStorageData.setItem("user_pass", this.AT_inputPass.string);
            } else {
                LocalStorageData.removeItem("user_pass");
                LocalStorageData.setItem("auto_login", "0");
            }
            NetLoadingView.instance.show(`AT_accLoginBtnTouch`);
            Global.EVENT.dispatchEvent(BaseEvent.DO_MAIN_LOGIN);
            Global.UI.closeView(InputAccView);
        }
    }

    AT_seePasswordBtnTouch() {
        let _editState = this.AT_inputPass.getComponent(EditBox).inputFlag;
        if (_editState == 0) {
            this.AT_inputPass.getComponent(EditBox).inputFlag = 5;
            ImageUtils.showImage(this.AT_seePasswordBtn.getComponentInChildren(Sprite), "login/res/login_see_password2")
        } else {
            this.AT_inputPass.getComponent(EditBox).inputFlag = 0;
            ImageUtils.showImage(this.AT_seePasswordBtn.getComponentInChildren(Sprite), "login/res/login_see_password")
        }
    }

    AT_autoSignBtnTouch() {
        this.AT_gou.active = !this.AT_gou.active;
        this.recordAcc = this.AT_gou.active;
    }

    AT_GGBtnTouch() {
        Global.UI.closeView(InputAccView);
    }

    AT_ZhuceBtnTouch() {
        Global.UI.openView(GameSignInPanel);
        Global.UI.closeView(InputAccView);
    }

    async AT_kefuBtnTouch() {
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
