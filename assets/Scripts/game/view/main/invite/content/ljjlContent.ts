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
import { DateSelectNode } from '../../hall/DateSelectNode';
const { ccclass, property } = _decorator;

/**
 * 礼金记录
 */
@ccclass('ljjlContent')
export class ljjlContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_StartTimeEdit: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_EndTimeEdit: Node

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
        this.AT_PageTool.getComponent(PageTools).setPageData(this, ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-direct", 1, this.pageSize, false);
        this.AT_PageTool.getComponent(PageTools).setCallFuncName(`onPageData`, `getReqData`)
        this.requestMyDcirect();
    }

    AT_ClearBtnTouch() {
        this.AT_EndTimeEdit.getComponent(DateSelectNode).initNowTime()
        this.AT_StartTimeEdit.getComponent(DateSelectNode).initNowTime()
    }

    AT_CXBtnTouch() {
        this.requestMyDcirect();
    }

    getReqData(page: number = null, pageLength: number = null, type = -1) {
        let reqData: any = {
            page: page, pageLength: pageLength,
            type: type
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

    /**
     * 请求直属
     */
    public async requestMyDcirect(type = -1) {
        this.AT_PageTool.getComponent(PageTools).getPageBySelfData(this.getReqData(1, this.pageSize, type));
    }

    onPageData(resp) {
        let list = resp.list;
        this.AT_NoRecord.active = list.length == 0;
        for (let i = 0, itemIndex = 1; i < this.pageSize; i++, itemIndex++) {
            let itemNode = this.AT_ListLayout.getChildByName(`item${itemIndex}`);
            let itemData = list[i];
            if (itemData) {
                itemNode.active = true;
                //
            } else {
                itemNode.active = false;
            }
        }
    }
}
