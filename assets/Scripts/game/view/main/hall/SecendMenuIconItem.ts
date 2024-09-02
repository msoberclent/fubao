import { UIOpacity, _decorator, tween, v3 } from "cc";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { SecondIconItem } from "../../../message/GameMessage";

const { ccclass, property } = _decorator;

@ccclass('SecendMenuIconItem')
export class SecendMenuIconItem extends PiterUI {


    config: SecondIconItem

    index: number;
    onTouchTap() {
        if (this.config.status == 3) {
            return;
        }
        Global.EVENT.dispatchEvent("main_bottom_tab_touch", { key: "show_gird", config: this.config });
    }

    public createChildren(): void {
        super.createChildren();
    }

    init(config: SecondIconItem, index) {
        this.config = config;
        this.index = index;
        this.node.getChildByName("content").active = true;
        this.initUI();
    }

    initUI() {
        let gameType = this.config.gameType.replace(/\s/g, '');
        let platName = this.config.productCode.replace(/\s/g, '');
        let iconUrl = `icon/GAME/${gameType}/${platName}`;
        let node = this.node.getChildByPath("content/AT_GameIcon");
        ImageUtils.showNodeSprite(node, iconUrl);
        this.node.getChildByPath("content/AT_WatingImage").active = this.config.status == 3
    }

    public showInitAni(index) {
        let node = this.node.getChildByName("content");
        let uIOpacity = node.getComponent(UIOpacity);
        uIOpacity.opacity = 0;
        let time = 0.1;
        let jiangeTime = 0.01
        this.scheduleOnce(() => {
            tween(uIOpacity).to(time, {
                opacity: 255
            }).start();
            node.position = v3(0, -200);
            tween(node).to(time, {
                position: v3(0, 0)
            }).start();
        }, index * jiangeTime);
        return time + index * jiangeTime;
    }
}