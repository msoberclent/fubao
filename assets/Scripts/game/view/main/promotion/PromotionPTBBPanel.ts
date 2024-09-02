import { EditBox, Node, _decorator, isValid } from "cc";
import { TimeUtils } from "../../../../../Piter.Framework/BaseKit/Util/TimeUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { DateSelectNode } from "../hall/DateSelectNode";

const { ccclass, property } = _decorator;

@ccclass('PromotionPTBBPanel')
export class PromotionPTBBPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "promotion/prefabs/PromotionPTBBPanel";

    protected static className = "PromotionPTBBPanel";

    public createChildren(): void {
        super.createChildren();
        this.showList();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionPTBBPanel);
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_StartTimeEdit: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_EndTimeEdit: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_List: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_NoRecord: Node;

    getReqData() {
        let reqData: any = {
        };
        let startTime = this.AT_StartTimeEdit.getComponent(EditBox).string.trim();
        let endTime = this.AT_EndTimeEdit.getComponent(EditBox).string.trim();
        if (startTime) {
            reqData.startTime = startTime;
        }
        if (endTime) {
            reqData.endTime = endTime;
        }
        if (TimeUtils.compareTime(startTime, endTime)) {
            DefaultToast.instance.showText("开始时间不能大于结束时间")
            return;
        }
        if (!isValid(this.node)) {
            return;
        }
        return reqData
    }

    async showList() {
        let reqData = this.getReqData();
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-ext-platfee", reqData);
        if (resp.code == 200) {
            let list = resp.data;
        }
    }

    listData: any[];
    public onListRender(item: Node, idx: number) {

    }


    AT_ClearBtnTouch() {
        this.AT_EndTimeEdit.getComponent(DateSelectNode).initNowTime()
        this.AT_StartTimeEdit.getComponent(DateSelectNode).initNowTime()
    }

    AT_CXBtnTouch() {
        this.showList();
    }
}
