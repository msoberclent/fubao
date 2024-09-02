import { Node, _decorator } from "cc";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { ActivityTGLJItem } from "./ActivityTGLJItem";

const { ccclass, property } = _decorator;
@ccclass('ActivityTGLJRecord')
export class ActivityTGLJRecord extends ScrollToLeftInPanel {

    protected static prefabUrl = "activity/prefabs/ActivityTGLJRecord";

    protected static className = "ActivityTGLJRecord";

    recordList = [];

    createChildren() {
        super.createChildren();
        this.initUI();
    }

    async initUI() {
        // let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge-red-pack/mylist", {}, true)
        // if (data.code == 200) {
        //     this.updateList(data)
        // } else {
        //     return DefaultToast.instance.showText(data.msg);
        // }
    }

    onListRender(item: Node, idx) {
        let data = this.recordList[idx];
        item.getComponent(ActivityTGLJItem).updateItem(data, idx);
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(ActivityTGLJRecord);
    }

}