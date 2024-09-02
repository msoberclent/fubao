
const { ccclass, property } = _decorator;

import { _decorator, Component, Sprite } from "cc";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";


@ccclass('MainTabItem')
export class MainTabItem extends Component {

    public tabKey: string;

    public initByConfigData(tabKey: string) {
        this.tabKey = tabKey;
        this.showTabImage();
    }

    public showTabImage() {
        let select1 = this.node.getChildByName("tab1").getComponent(Sprite);
        let select2 = this.node.getChildByPath("select/tab2").getComponent(Sprite);
        ImageUtils.showImage(select1, `altas/main/tabs/main_tab_${this.tabKey}_1`)
        ImageUtils.showImage(select2, `altas/main/tabs/main_tab_${this.tabKey}_2`)
    }
}

export interface config_game_menu {
    /**
     *  类型
     */
    type: string;
    /**
     *  客户端类型
     */
    key: string;
    /**
     *  排序
     */
    zIndex: number;
}