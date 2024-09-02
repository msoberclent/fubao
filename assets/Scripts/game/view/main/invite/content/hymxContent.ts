/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { EditBox, Node, _decorator, isValid } from 'cc';
import { TimeUtils } from '../../../../../../Piter.Framework/BaseKit/Util/TimeUtils';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import { PiterUI } from '../../../../../../Piter.Framework/UIKit/Base/PiterUI';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
import { PageTools } from '../../../component/PageTools';
import { KSFHZSItem } from '../../promotion/item/KSFHZSItem';
const { ccclass, property } = _decorator;

/**
 * 好友明细
 */
@ccclass('hymxContent')
export class hymxContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_StartTimeEdit: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_EndTimeEdit: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_UIDEdit: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_ListLayout: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_PageTool: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_NoRecord: Node;

    pageSize: number = 13;

    public createChildren() {
        super.createChildren();
        this.AT_PageTool.getComponent(PageTools).model = 2;
        this.AT_PageTool.getComponent(PageTools).setPageData(this, ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-ext-direct-list", 1, this.pageSize, false);
        this.AT_PageTool.getComponent(PageTools).setCallFuncName(`onPageData`, `getMyDirectReqData`)
        this.requestMyDcirect();
    }

    AT_ClearBtnTouch() {
        this.AT_UIDEdit.getComponent(EditBox).string = "";
    }

    AT_CXBtnTouch() {
        this.requestMyDcirect();
    }

    getMyDirectReqData(page: number = null, pageLength: number = null, type = 0) {
        let idInput = this.AT_UIDEdit.getComponent(EditBox).string;
        let reqData;
        if (idInput && idInput != "") {
            reqData = { uid: idInput, page: page, pageLength: pageLength, type: type };
        } else {
            reqData = { page: page, pageLength: pageLength, type: type };
        }
        let startTime = this.AT_StartTimeEdit.getComponent(EditBox).string.trim();
        let endTime = this.AT_EndTimeEdit.getComponent(EditBox).string.trim();
        if (TimeUtils.compareTime(startTime, endTime)) {
            DefaultToast.instance.showText("开始时间不能大于结束时间")
            return false;
        }
        if (startTime) {
            reqData.startTime = startTime;
        }
        if (endTime) {
            reqData.endTime = endTime;
        }
        if (!isValid(this.node)) {
            return false;
        }
        return reqData
    }

    /**
     * 请求直属
     */
    public async requestMyDcirect(type = 0) {
        this.AT_PageTool.getComponent(PageTools).getPageBySelfData(this.getMyDirectReqData(1, this.pageSize, type));
    }

    onPageData(resp) {
        let list = resp.list;
        this.AT_NoRecord.active = list.length == 0;
        for (let i = 0, itemIndex = 1; i < this.pageSize; i++, itemIndex++) {
            let v = this.AT_ListLayout.getChildByName(`item${itemIndex}`);
            let itemData = list[i];
            if (itemData) {
                v.active = true;
                let item = v.getComponent(KSFHZSItem);
                let info = {
                    fanyongbi: resp.platMaxFanyongbiVal ? resp.platMaxFanyongbiVal : resp.fanyongbiVal,
                    fanyongbiVal: resp.fanyongbiVal,
                    from: "promotion",
                    hisfanyong: list[i].fanyongbi,
                    id: list[i].nick,
                    fatherid: list[i].uid
                };
                item.info = info;
                item.setItemData(list[i], i);
            } else {
                v.active = false;
            }
        }
    }
}
