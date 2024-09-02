import { Camera, Component, Node, UITransform, Widget, _decorator, sys, view } from "cc";
import { GameUtils } from "../../Scripts/game/utils/GameUtils";
import { BaseConstant } from "../BaseKit/Constant/BaseConstant";
import Global from "../PiterGlobal";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UIRoot
 * DateTime = Mon Oct 18 2021 11:32:11 GMT+0800 (中国标准时间)
 * Author = 朝伟
 * FileBasename = UIRoot.ts
 * FileBasenameNoExtension = UIRoot
 * URL = db://assets/scripts/UIRoot.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 * PiterUI框架 根节点
 */

@ccclass('PiterUIRoot')
export class PiterUIRoot extends Component {

    @property({
        type: Node
    })
    public bottomLayer: Node = null;

    @property({
        type: Node
    })
    public panelLayer: Node = null;

    @property({
        type: Node
    })
    public tipLayer: Node = null;

    @property({
        type: Node
    })
    public loadingLayer: Node = null;

    @property({
        type: Node
    })
    public topLayer: Node = null;

    @property({
        type: Camera
    })
    public UICamrea: Camera = null;


    @property({
        type: Node
    })
    public DebugLayer: Node = null;

    @property({
        type: Node
    })
    public LeftMask: Node = null;

    @property({
        type: Node
    })
    public RightMask: Node = null;

    @property({
        type: Node
    })
    public outerLayer: Node = null;

    public hengpingValue: number = 1;
    public offersetValue = 0;
    onLoad() {
        let uiTrans = this.node.parent.getComponent(UITransform);
        BaseConstant.WINSIZE_WIDTH = uiTrans.width;
        BaseConstant.WINSIZE_BILI_HEIGHT = uiTrans.height;
        BaseConstant.WINSIZE_BILI_WIDTH = screen.width / BaseConstant.DESIGN_WIDTH;
        if (BaseConstant.WINSIZE_WIDTH > 2340) {
            this.RightMask.getComponent(Widget).left = BaseConstant.WINSIZE_WIDTH
            this.RightMask.getComponent(Widget).updateAlignment()
        }
        if (sys.isNative) {
            if (sys.os == sys.OS.ANDROID) {
                GameUtils.getNativeOrientation();
                view.on(`canvas-resize`, this.onResized, this);
            } else {
                view.on(`canvas-resize`, this.onResized, this);
                //    let safeArea = this.node.addComponent(SafeArea);
                //    safeArea.updateArea();
            }
        }
        if (CC_DEBUG) {
            return;
        }
        this.DebugLayer.parent = null;
    }

    public getOfferSetLeft() {
        if (this.hengpingValue == 1) {
            return 0;
        } else {
            return this.offersetValue;
        }
    }

    async onResized(arg1, arg2) {
        let direction = await GameUtils.getNativeOrientation();
        if (sys.os == sys.OS.IOS) {
            if (!Global.IN_OUTER) {
                GameUtils.fixOrientation();
            }
            //0竖屏 1横屏
            // this.node.parent.getChildByName("DirectionTip").active = direction == "0"
        }
    }


    public updateSafeAreaShu() {
        // if (sys.os == sys.OS.IOS) {
        //     return;
        // }
        if (!sys.isMobile) {
            return;
        }
        let visibleSize = view.getVisibleSize();
        let safeAire = sys.getSafeAreaRect();
        let val = visibleSize.height - safeAire.height;
        if (val > 0) {
            val -= safeAire.x;
            if (val > 60) {
                val = 60;
            }
            let widget = this.node.getComponent(Widget);
            widget.top = val;
            widget.updateAlignment();
        }
    }

    public updateSafeArea(value) {
        this.hengpingValue = value;
        if (sys.os == sys.OS.IOS) {
            return;
        }
        if (sys.isNative) {
            let visibleSize = view.getVisibleSize();
            let safeAire = sys.getSafeAreaRect();
            let val = visibleSize.width - safeAire.width;
            if (val > 0) {
                val -= safeAire.x;
                if (val > 100) {
                    val = 100;
                }
                this.offersetValue = val;
                let widget = this.node.getComponent(Widget);
                let leftWidget = this.LeftMask.getComponent(Widget);
                let rightWidget = this.RightMask.getComponent(Widget);
                if (value == 1 || value == "1") {
                    //有横屏
                    leftWidget.node.active = true;
                    leftWidget.left = -1280;
                    leftWidget.updateAlignment();

                    rightWidget.right = -1280
                    rightWidget.updateAlignment();

                    widget.left = null;
                    widget.right = val;
                    widget.updateAlignment();
                } else if (value == 0 || value == "0") {
                    //做横屏
                    leftWidget.node.active = true;
                    leftWidget.left = -1280;

                    rightWidget.right = -1280
                    rightWidget.updateAlignment();

                    leftWidget.updateAlignment();
                    widget.right = null;
                    widget.left = val;
                    widget.updateAlignment();
                }
            }
        }
    }

    public openDebug() {
        if (CC_DEBUG && sys.isBrowser) {
            this.DebugLayer.active = true;
        }
    }

    public showOuterLayer(flag: boolean) {
        this.outerLayer.active = flag;
    }
}
