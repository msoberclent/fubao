import { ScrollToLeftInPanel } from './../../panel/ScrollToLeftInPanel';
/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { Node, _decorator, instantiate, v3 } from 'cc';
import { PiterDirector } from '../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../Piter.Framework/PiterGlobal';
import { GamePlayerManager } from '../../../manager/GamePlayerManager';
import { GameUtils } from '../../../utils/GameUtils';
import { PromotionKSFHNode } from './sub/PromotionKSFHNode';
import { UIResConfig } from '../../../../../Piter.Framework/UIKit/Base/PiterView';
import { BundlesInfo } from '../../../../bundles';
import { MainDirConst } from '../../../constant/GameResConst';
const { ccclass, property } = _decorator;

@ccclass('PromotionCenterView')
export class PromotionCenterView extends ScrollToLeftInPanel {
    protected static prefabUrl = "promotion/prefabs/PromotionCenterView";

    protected static className = "PromotionCenterView";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.promotion]
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_KSFHBtn: Node

    public createChildren(): void {
        super.createChildren();
        this.showList();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionCenterView);
    }

    showList() {
        let tabList: any[] = [
            { imageUrl: "altas/promotion/tabs/shouye", contentName: "mainContent", zIndex: 1, title: "代理中心" },
            { imageUrl: "altas/promotion/tabs/vip", contentName: "memberContent", zIndex: 2, title: "会员" },
            // { imageUrl: "altas/promotion/tabs/cwjl", contentName: "cwjlContent", zIndex: 3, title: "财务记录" },
            { imageUrl: "altas/promotion/tabs/tgsm", contentName: "tgsmContent", zIndex: 4, title: "推广说明" },
        ]
        this.createBottomTabs(tabList, {
            padding_left: 70,
            spacingX: 140
        });
        if (GamePlayerManager.instance.player.kuishunFanyongbi) {
            let node = instantiate(this.AT_KSFHBtn);
            node.setPosition(v3(0, 0));
            node.active = true;
            this.AT_Bottom.addChild(node);
            node.setSiblingIndex(2);
            this.createBottomTabs(tabList, {
                padding_left: 60,
                spacingX: 65
            });
        }
    }

    onBtnKSFHClick() {
        Global.UI.openView(PromotionKSFHNode)
    }

    AT_ShareBtnTouch() {
        GameUtils.setClipBordStr(Global.PLAYER.player.qrCodeUrl, "邀请码已复制");
    }
}
