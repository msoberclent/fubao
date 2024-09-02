import { Button, Label, Node, UITransform, _decorator, instantiate, v3 } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { ServerConfig } from "../../../constant/ServerConst";
import { GameUtils } from "../../../utils/GameUtils";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
const { ccclass, property } = _decorator;

@ccclass('MainKeFuPanel')
export class MainKeFuPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "common/prefabs/MainKeFuPanel";

    protected static className = "MainKeFuPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_QuestLayout: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_OnlineLayout: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Item: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_KefuItem: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_OpenBtn: Node;

    tabIndex: number[];

    @PiterDirector.AUTO_BIND(Node)
    AT_TempNode: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Tab: Node

    public createChildren(): void {
        super.createChildren();
        this.showKefuWebView();

    }

    async showKefuWebView() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/customer-service/list", {}, true);
        if (resp.code == 200) {
            let data = resp.data;
            this.AT_OpenBtn.active = this.AT_QuestLayout.active = true;
            this.showContents();
            for (let i = 0; i < data.length; i++) {
                let item = instantiate(this.AT_KefuItem)
                item.active = true;
                item.parent = this.AT_OnlineLayout
                item.getChildByName("name").getComponent(Label).string = data[i].name
                item.getChildByName("desc").getComponent(Label).string = data[i].subtitle
                item.getComponent(Button).clickEvents[0].customEventData = data[i].line;
            }
        }
    }

    async showContents() {
        let idStart = 1; let idEnd = 10;
        for (let i = idStart; i <= idEnd; i++) {
            this.showItem(i);
        }
    }

    onItemTouch(e, custom) {
        let answer = e.target.getChildByName("answer");
        answer.active = !answer.active;
        let button = e.target.getChildByPath("question/button") as Node;
        let labelNode = e.target.getChildByPath("answer/label") as Node;
        let height = labelNode.getComponent(UITransform).height;
        answer.getComponent(UITransform).height = height + 200;
        if (answer.active) {
            button.scale = v3(1, -1)
        } else {
            button.scale = v3(1, 1)
        }
    }


    onlineKefuItemTouch(e, url) {
        GameUtils.goUrl(url);
    }

    showItem(index: number) {
        let qId = 1100 + index;
        let aId = 2100 + index;
        let item = instantiate(this.AT_Item);
        let qStr = Global.LANG.getLang(qId);
        let aStr = Global.LANG.getLang(aId);
        item.getChildByPath("question/label").getComponent(Label).string = qStr;
        item.getChildByPath("answer/label").getComponent(Label).string = aStr;
        item.parent = this.AT_QuestLayout;
        item.active = true;
    }


    AT_closeBtnTouch() {
        Global.UI.closeView(MainKeFuPanel);
    }
}
