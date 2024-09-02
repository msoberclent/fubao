/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { EditBox, Label, Node, _decorator, isValid } from 'cc';
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import { TimeUtils } from '../../../../../../Piter.Framework/BaseKit/Util/TimeUtils';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { PiterUI } from '../../../../../../Piter.Framework/UIKit/Base/PiterUI';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
import { PageTools } from '../../../component/PageTools';
import { DateSelectNode } from '../../hall/DateSelectNode';
import { KSFHZSItem } from '../item/KSFHZSItem';
const { ccclass, property } = _decorator;

/**
 * 数据列表
 */
@ccclass('PromotionMemberContent')
export class PromotionMemberContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_OpenBtn: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Content: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_InfoContent: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_ListLayout: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_PageTool: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_NoRecord: Node;

    pageSize: number = 13;

    OpenBtn2Touch() {
        this.AT_InfoContent.getChildByPath("content2/info").active = !this.AT_InfoContent.getChildByPath("content2/info").active;
        this.AT_InfoContent.getChildByPath("content1/info").active = !this.AT_InfoContent.getChildByPath("content2/info").active;
    }

    OpenBtn1Touch() {
        this.AT_InfoContent.getChildByPath("content1/info").active = !this.AT_InfoContent.getChildByPath("content1/info").active;
        this.AT_InfoContent.getChildByPath("content2/info").active = !this.AT_InfoContent.getChildByPath("content1/info").active;
    }

    public createChildren() {
        super.createChildren();
        this.AT_PageTool.getComponent(PageTools).model = 2;
        this.AT_PageTool.getComponent(PageTools).setPageData(this, ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-ext-direct-list", 1, this.pageSize, false);
        this.AT_PageTool.getComponent(PageTools).setCallFuncName(`onPageData`, `getReqData`)
        this.onTabItemTouch(null, "1");

    }

    public currentSelectType: number;
    public onTabItemTouch(e, cus) {
        let type = Number(cus);
        if (this.currentSelectType == type) {
            return;
        }
        this.currentSelectType = type;
        this.AT_StartTimeEdit.getComponent(DateSelectNode).initNowTime();
        this.AT_EndTimeEdit.getComponent(DateSelectNode).initNowTime();
        this.AT_UIDEdit.getComponent(EditBox).string = "";
        this.requestMyDcirect();
        this.sendRequestData();
    }

    /**
     * 请求直属
     */
    public async requestMyDcirect() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-extension-new", {
            type: this.currentSelectType
        }, true);
        if (resp.code != 200) {
            DefaultToast.instance.showText(resp.msg);
            return;
        }
        this.showLabels(resp.data);
    }

    public onAdded() {
        super.onAdded();
        Global.EVENT.on("FLUSH_PROMIOTION_BAODI", this.sendRequestData, this);
    }

    public onRemoved() {
        super.onRemoved();
        Global.EVENT.off("FLUSH_PROMIOTION_BAODI", this.sendRequestData, this);
    }


    public showLabels(respData) {
        let labels = [
            { name: "directMemberCount", label: "xjcytj", desc: "下级成员统计", divGold: false },
            { name: "monthReg", label: "byzc", desc: "本月注册", divGold: false },
            { name: "monthActive", label: "byhy", desc: "本月活跃", divGold: false },
            { name: "validAdd", label: "byxz", desc: "本月新增", divGold: false },
            { name: "directMemberCountNew", label: "jrzc", desc: "今日新增", divGold: false },
            { name: "dayActive", label: "jrhy", desc: "今日活跃", divGold: false },
            { name: "monthTopUp", label: "byck", desc: "本月存款", divGold: true },
            { name: "dayTopUp", label: "jrck", desc: "今日存款", divGold: true },
        ];
        for (let i = 0; i < labels.length; i++) {
            let item = labels[i];
            let node = this.AT_InfoContent.getChildByPath(`content1/info/` + item.label);
            if (node && item.name) {
                if (item.divGold) {
                    node.getComponent(Label).string = GoldUtils.formatGold(respData[item.name]);
                } else {
                    node.getComponent(Label).string = respData[item.name]
                }
            }
        }
    }

    //--------------------------------下级成员列表------------------------------

    @PiterDirector.AUTO_BIND(Node)
    AT_StartTimeEdit: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_EndTimeEdit: Node

    @PiterDirector.AUTO_BIND(Node)
    AT_UIDEdit: Node

    AT_ClearBtnTouch() {
        this.AT_UIDEdit.getComponent(EditBox).string = "";
    }

    AT_CXBtnTouch() {
        this.sendRequestData();
    }

    getReqData(page: number = null, pageLength: number = null) {
        let idInput = this.AT_UIDEdit.getComponent(EditBox).string;
        let reqData: any;
        if (idInput && idInput != "") {
            reqData = { uid: idInput, page: page, pageLength: pageLength };
        } else {
            reqData = { page: page, pageLength: pageLength };
        }
        reqData.type = this.currentSelectType
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
    public async sendRequestData() {
        this.AT_PageTool.getComponent(PageTools).getPageBySelfData(this.getReqData(1, this.pageSize));
    }

    onPageData(resp) {
        let list = resp.list || [];
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
                item.setItemData(list[i], i, this.currentSelectType);
            } else {
                v.active = false;
            }
        }
    }
}
