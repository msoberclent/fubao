/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { Label, Node, _decorator } from 'cc';
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { PiterUI } from '../../../../../../Piter.Framework/UIKit/Base/PiterUI';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
const { ccclass, property } = _decorator;

/**
 * 下级概览
 */
@ccclass('MXJL_XJLBContent')
export class MXJL_XJLBContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_OpenBtn: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Info: Node;

    public createChildren(): void {
        super.createChildren();
        this.init();
    }

    OpenBtnTouch() {
        this.AT_Info.active = !this.AT_Info.active;
        if (this.AT_Info.active) {
            this.init();
        }
    }

    isInit: boolean = false;
    public async init() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        //请求哪里
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-extension-new", {}, true);
        if (resp.code != 200) {
            DefaultToast.instance.showText(resp.msg);
            return;
        }
        this.showLabels(resp.data);
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
            let node = this.AT_Info.getChildByPath(item.label);
            if (node && item.name) {
                if (item.divGold) {
                    node.getComponent(Label).string = GoldUtils.formatGold(respData[item.name]);
                } else {
                    node.getComponent(Label).string = respData[item.name]
                }
            }
        }

    }
}
