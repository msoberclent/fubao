import { Component, Label, Sprite, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ServerConfig } from "../../../constant/ServerConst";
const { ccclass, property } = _decorator;

@ccclass('FindYueItem')
export class FindYueItem extends Component {

    nodeindex = null;
    platname = "";
    public updateItem(itemData, index) {
        ImageUtils.showImage(this.node.getChildByName("icon").getComponent(Sprite),"icon/GAME/LOGO/outer_logo_"+ itemData.platName);
        this.node.getChildByName("name").getComponent(Label).string = itemData.platName;
        this.platname = itemData.platName
        this.node.getChildByName("yue").getComponent(Label).string = GoldUtils.formatGold(itemData.balance);
    }

    async onNodeFreshClick(){
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/plat-balance-get-single", {platName:this.platname});
        if (resp.code == 200) {
            ImageUtils.showImage(this.node.getChildByName("icon").getComponent(Sprite),"icon/GAME/LOGO/outer_logo_"+ resp.data.platName);
            this.node.getChildByName("name").getComponent(Label).string = resp.data.gameName;
            this.node.getChildByName("yue").getComponent(Label).string = GoldUtils.formatGold(resp.data.balance);
        } else {
            return DefaultToast.instance.showScrollText(resp.msg);
        }
    }

}

