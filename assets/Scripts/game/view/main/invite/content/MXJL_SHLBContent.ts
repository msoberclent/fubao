/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { Node, _decorator } from 'cc';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import { PiterUI } from '../../../../../../Piter.Framework/UIKit/Base/PiterUI';
const { ccclass, property } = _decorator;

/**
 * 数据列表
 */
@ccclass('MXJL_SHLBContent')
export class MXJL_SHLBContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_OpenBtn: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Tab: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Info: Node;

    OpenBtnTouch() {
        this.AT_Info.active = !this.AT_Info.active;
    }

    public onTabItemTouch(e, index) {
        if (index == "1") {
            this.AT_Info.getChildByPath("ljjlContent").active = true;
            this.AT_Info.getChildByPath("hymxContent").active = false;
        } else {
            this.AT_Info.getChildByPath("ljjlContent").active = false;
            this.AT_Info.getChildByPath("hymxContent").active = true;
            this.requestMyDcirect();
        }
    }

    /**
     * 请求直属
     */
    public requestMyDcirect() {

    }

    public createChildren(): void {
        super.createChildren();
        this.onTabItemTouch(null, "2");
    }

}
