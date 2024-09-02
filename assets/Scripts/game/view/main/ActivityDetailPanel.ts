import { Label, Node, Sprite, _decorator } from "cc";
import { PiterDirector } from "../../../../Piter.Framework/PiterDirector";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { ImageUtils } from "../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ServerConfig } from "../../constant/ServerConst";
import { ScrollToLeftInPanel } from "../panel/ScrollToLeftInPanel";
import { DuiHuanPanel } from "./hall/DuiHuanPanel";



const { ccclass, property } = _decorator;
@ccclass('ActivityDetailPanel')
export class ActivityDetailPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "activity/prefabs/ActivityDetailPanel";

    protected static className = "ActivityDetailPanel";

    // protected static layerZIndex: number = 2;
    @PiterDirector.AUTO_BIND(Node)
    AT_HDTitle: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_img: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_ActivityCZHBPanel: Node;

    activityData = null;

    public createChildren(): void {
        super.createChildren();
        this.initActivity();
    }

    init(param) {
        this.activityData = param;
    }

    initActivity() {
        this.AT_ActivityCZHBPanel.active = false;
        this.AT_HDTitle.getComponent(Label).string = this.activityData.title;
        if (this.activityData.image != "") {
            ImageUtils.showRemoteHeader(this.AT_img.getComponent(Sprite), this.activityData.image, () => {
                this.node.getChildByPath("contentNode/shenqing").active = false;
                this.node.getChildByPath("contentNode/canyu").active = false;
                this.node.getChildByPath("contentNode/lingqu").active = false;
                switch (this.activityData.type) {
                    case 0:
                        break;
                    case 2000:
                        this.node.getChildByPath("contentNode/canyu").active = true;
                        break;
                    case 1500:
                        this.node.getChildByPath("contentNode/lingqu").active = true;
                        break;
                    default:
                        this.node.getChildByPath("contentNode/shenqing").active = true;
                        break;

                }
            });
        }
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(ActivityDetailPanel)
    }

    lingquBtnTouch() {
        Global.UI.openView(DuiHuanPanel);
    }

    canyuBtnTouch() {

    }

    async shenqingBtnTouch() {
        let data = this.activityData;
        ButtonUtils.setGray(this.node.getChildByPath("contentNode/shenqing").getComponent(Sprite), true);
        this.scheduleOnce(() => {
            ButtonUtils.setGray(this.node.getChildByPath("contentNode/shenqing").getComponent(Sprite), false);
        }, 5)
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/activity-apply", { id: data.id });
        if (resp.code == 200) {
            DefaultToast.instance.showText(resp.msg);
        } else {
            DefaultToast.instance.showText(resp.msg);
        }
    }

}