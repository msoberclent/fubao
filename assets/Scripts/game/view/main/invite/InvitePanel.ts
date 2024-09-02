/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { _decorator } from 'cc';
import Global from '../../../../../Piter.Framework/PiterGlobal';
import { UIResConfig } from '../../../../../Piter.Framework/UIKit/Base/PiterView';
import { BundlesInfo } from '../../../../bundles';
import { MainDirConst } from '../../../constant/GameResConst';
import { ScrollToLeftInPanel } from '../../panel/ScrollToLeftInPanel';
import { InviteUrlPanel } from './InviteUrlPanel';
const { ccclass, property } = _decorator;

@ccclass('InvitePanel')
export class InvitePanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "invite/prefabs/InvitePanel";

    protected static className = "InvitePanel";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.invite]
    }


    public createChildren(): void {
        super.createChildren();
        this.showList();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(InvitePanel);
    }

    showList() {
        let tabList: any[] = [
            { imageUrl: "invite/res/tabs/yqlj", contentName: "yqljContent", zIndex: 1, title: "邀请链接" },
            { imageUrl: "invite/res/tabs/ljjs", contentName: "ljjsContent", zIndex: 2, title: "礼金介绍" },
            { imageUrl: "invite/res/tabs/mxjl", contentName: "mxjlContent", zIndex: 3, title: "明细记录" },
        ]
        this.createBottomTabs(tabList, {
            padding_left: 70,
            spacingX: 140
        });
    }

    AT_ShareBtnTouch() {
        Global.UI.openView(InviteUrlPanel);
    }
}
