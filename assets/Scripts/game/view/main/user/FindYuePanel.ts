import { Label, Node, Sprite, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { FindYueItem } from "./FindYueItem";

const { ccclass, property } = _decorator;

@ccclass('FindYuePanel')
export class FindYuePanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "usercenter/prefabs/FindYuePanel";

    protected static className = "FindYuePanel";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.usercenter]
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_curyue: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_findBtn: Node;
    listData: any[] = [];

    createChildren() {
        super.createChildren();
        this.initList();
    }

    async initList() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/plat-balance-list", {});
        if (resp.code == 200) {
            this.listData = resp.data.list;
            this.AT_curyue.getComponent(Label).string = resp.data.balance;
            this.node.getChildByPath("contentNode/sc").getComponent(List).numItems = this.listData.length;
        } else {
            return DefaultToast.instance.showScrollText(resp.msg);
        }
    }

    async AT_findBtnTouch() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/plat-balance-find-all", {});
        this._startCountDown();
        ButtonUtils.setGray(this.AT_findBtn.getComponent(Sprite), true);
        if (resp.code == 200) {
            this.listData = resp.data.list;
            this.AT_curyue.getComponent(Label).string = resp.data.balance;
            this.node.getChildByPath("contentNode/sc").getComponent(List).numItems = this.listData.length;
            return DefaultToast.instance.showScrollText("找回成功");
        } else {
            return DefaultToast.instance.showScrollText(resp.msg);
        }
    }

    _startCountDown() {
        this.scheduleOnce(()=>{
            ButtonUtils.setGray(this.AT_findBtn.getComponent(Sprite), false);
        },8)
    }

    public onListRender(item: Node, idx) {
        let data = this.listData[idx];
        item.getComponent(FindYueItem).updateItem(data, idx);
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(FindYuePanel);
    }

}