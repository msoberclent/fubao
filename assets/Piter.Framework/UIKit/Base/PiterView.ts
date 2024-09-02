
import { BlockInputEvents, Button, Camera, Label, Node, Widget, _decorator, sys, v2, v3 } from 'cc';
import { TweenUtils } from '../../BaseKit/Animation/TweenUtils';
import { BaseConstant } from '../../BaseKit/Constant/BaseConstant';
import { BaseEvent } from '../../BaseKit/Constant/BaseEvent';
import { GoldUtils } from '../../BaseKit/Util/GoldUtils';
import { PiterDirector } from '../../PiterDirector';
import Global from '../../PiterGlobal';
import { PiterUI } from './PiterUI';
const { ccclass, property } = _decorator;

export interface ViewClass<T extends PiterView> {
    new(): T;
    getUrl(): string;
    getName(): string;
    getZIndex(): number;
    getLayerName(): string;
    getResConfig(): UIResConfig;
}

export interface UIResConfig {
    bundleName: string;
    dirNames: string[];
}

@ccclass("PiterView")
export default abstract class PiterView extends PiterUI {

    protected static prefabUrl;

    protected static className;

    protected static layerName = "bottom";

    protected static uiResConfig: UIResConfig;

    protected mTag: any;

    protected messageQuene: any[] = [];

    protected static layerZIndex: number = 1;

    public get tag(): any {
        return this.mTag;
    }
    public set tag(value: any) {
        this.mTag = value;
    }

    /**
   * 得到prefab的路径，相对于resources目录
   */
    public static getResConfig(): UIResConfig {
        return this.uiResConfig;
    }

    /**
    * 得到prefab的路径，相对于resources目录
    */
    public static getUrl(): string {
        return this.prefabUrl;
    }

    public static getZIndex(): number {
        return this.layerZIndex;
    }

    /**
     * 类名，用于给UI命名
     */
    public static getName(): string {
        return this.className;
    }

    public static getLayerName(): string {
        return this.layerName;
    }

    protected paramsData;
    init(paramsData) {
        if (!paramsData) {
            paramsData = {};
        }
        this.paramsData = paramsData;
    }

    onLoad() {
        super.onLoad();
        if (!this.node.getComponent(BlockInputEvents)) {
            this.node.addComponent(BlockInputEvents)
        }
        this.fullscrennTrans();
    }

    start() {
        super.start();
    }

    public fullscrennTrans() {
        let widget = this.node.getComponent(Widget);
        if (!widget) {
            widget = this.node.addComponent(Widget);
        }
        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.bottom = 0;
        widget.updateAlignment();
    }

    public onAdded() {
        super.onAdded();
        Global.EVENT.on(BaseEvent.EVENT_RESIZE, this.fullscrennTrans, this);
        Global.EVENT.on(BaseEvent.GOLD_FLUSH, this.flushGold, this)
    }

    public onRemoved() {
        super.onRemoved();
        // if (this.AT_PMDNode) {
        //     Global.PMD.node.parent = null;
        //     Global.PMD.node.active = false;
        // }
        Global.EVENT.off(BaseEvent.EVENT_RESIZE, this.fullscrennTrans, this);
        Global.EVENT.off(BaseEvent.GOLD_FLUSH, this.flushGold, this)
    }

    protected checkAddPmd() {
        if (this.AT_PMDNode && Global.PMD.node) {
            Global.PMD.node.active = Global.PMD.IsPlay
            Global.PMD.node.parent = this.AT_PMDNode;
            Global.PMD.node.position = v3(0, 0);
        }
    }

    public createChildren() {
        super.createChildren();
        this.showPlayerInfo();
        this.checkAddPmd();
        this.flushGold();
        this.addMaskTouch();
    }

    public showPlayerInfo() {
        if (!Global.PLAYER) {
            return;
        }
        if (this.AT_GoldLabel) {
            this.AT_GoldLabel.string = GoldUtils.formatGold(Global.PLAYER.player.gold)
        }
        if (this.AT_NameLabel) {
            this.AT_NameLabel.string = Global.PLAYER.player.simpleUser.nick;
        }
    }

    onDestroy() {

    }

    protected closeView() {
        this.onRemoved();
        this.node.destroy();
    }

    protected addMaskTouch() {
        let mask = this.node.getChildByName("bgMask") as Node;
        if (mask) {
            mask.addComponent(BlockInputEvents);
        }
    }

    protected getTouchPoint(event, mainCamera) {
        let touchPos = event.touch.getLocation();
        let targetPos = v2();
        mainCamera.getComponent(Camera).getScreenToWorldPoint(touchPos, targetPos);
        return targetPos;
    }

    private taskQuene: any[] = [];
    protected doMessageQuene(data, messageName: string) {
        if (sys.isNative && BaseConstant.RUNING_BACK) {
            return;
        }
        let funcName = "s_" + messageName.toLocaleLowerCase();
        if (this.isLoadedOver) {
            this[funcName] && this[funcName](data);
        } else {
            this.taskQuene.push({ funcName: funcName, data: data });
        }
    }

    public update(dt: number) {
        while (this.isLoadedOver && this.taskQuene.length > 0) {
            let taskFunc = this.taskQuene.shift();
            this[taskFunc.funcName](taskFunc.data);
        }
    }

    protected onNotify(message: string, callback: Function, thisObj) {
        Global.EVENT.on(message, this.doMessageQuene, thisObj);
    }


    protected offNotify(message: string, callback: Function, thisObj) {
        Global.EVENT.off(message, this.doMessageQuene, thisObj);
    }

    protected addTouchBg2Close() {
        let touchBg = this.node.getChildByName("touchCloseBg");
        if (touchBg) {
            touchBg.getComponent(Button).interactable = true;
            let touchCloseTips = this.node.getChildByName("touchCloseTips");
            if (touchCloseTips) {
                touchCloseTips.active = true;
                TweenUtils.blink(touchCloseTips, 4);
            }
        }
    }

    @PiterDirector.AUTO_BIND(Label)
    public AT_GoldLabel: Label;

    @PiterDirector.AUTO_BIND(Label)
    public AT_NameLabel: Label;

    @PiterDirector.AUTO_BIND(Node)
    public AT_PMDNode: Node;

    public flushGold() {
        if (this.AT_GoldLabel) {
            this.AT_GoldLabel.string = GoldUtils.formatGold(Global.PLAYER.player.gold)
        }
    }

    AT_BackBtnTouch() {

    }

    updateMineUIInfo() {

    }
}

