import { Node, Toggle, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { FullScreenView } from "../FullScreenView";
import { AccountRecordPanel } from "./AccountRecordPanel";
import { GameRecordPanel } from "./GameRecordPanel";

const { ccclass, property } = _decorator;
@ccclass('UserProfileUI')
export class UserProfileUI extends FullScreenView {
    protected static prefabUrl = "usercenter/prefabs/UserProfileUI";

    protected static className = "UserProfileUI";

    @PiterDirector.AUTO_BIND(Node)
    AT_GameRecordPanel: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_AccountRecordPanel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_HeadSwitch: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_UserInfoPanel: Node;
    type = null;

    public createChildren(): void {
        super.createChildren();
        this.onHeadSwitchClick(null, this.type);
    }

    init(type?) {
        if (type) {
            this.type = type;
        }
    }

    onHeadSwitchClick(e, custom) {
        if (!custom) return;
        this.AT_UserInfoPanel.active = this.AT_GameRecordPanel.active = this.AT_AccountRecordPanel.active = false;
        this.AT_HeadSwitch.getChildByName(`item${custom}`).getComponent(Toggle).isChecked = true;
        switch (custom) {
            case "1":
                // this.AT_UserInfoPanel.active = true;
                // this.AT_UserInfoPanel.getComponent(UserInfoNode).initUI();
                break;
            case "2":
                this.AT_GameRecordPanel.active = true;
                this.AT_GameRecordPanel.getComponent(GameRecordPanel).initList();
                break;
            case "3":
                this.AT_AccountRecordPanel.active = true;
                this.AT_AccountRecordPanel.getComponent(AccountRecordPanel).initList();
                break
        }
    }

    AT_CloseBtnTouch() {
        Global.UI.closeView(UserProfileUI);
    }

}