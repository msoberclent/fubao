import { CCBoolean, CCString, Component, Label, Node, _decorator } from "cc";
import { PiterUI } from "../Base/PiterUI";
import { RedDotManager } from "./RedDotManager";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PiterStart
 * DateTime = Wed Jan 26 2022 10:50:57 GMT+0800 (中国标准时间)
 * Author = Piter
 * FileBasename = PiterStart.ts
 * FileBasenameNoExtension = PiterStart
 * URL = db://assets/Piter.Framework/PiterStart.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 * 普通造型 红点组件
 */
@ccclass('RedDotComp')
export class RedDotComp extends PiterUI {

    @property(Node)
    icon: Node = null;

    @property(Label)
    count: Label = null;

    @property({
        type: CCString,
        visible: function () { return this.rootDot }
    })
    dotPath: string = "";

    @property(CCBoolean)
    rootDot: boolean = true;

    onLoad() {
        this.node.name = "RedDot";
        if (this.rootDot && this.dotPath) {
            this.setDotPath(this.dotPath);
        }
    }

    public setDotPath(dotPath: string) {
        this.dotPath = dotPath;
        RedDotManager.redDotTree.registerCallback(dotPath, this.onRedDotStatsChange.bind(this));
    }

    public onRemoved() {
        super.onRemoved();
        if (this.dotPath) {
            RedDotManager.redDotTree.unRegisterCallback(this.dotPath);
        }
    }

    public onRedDotStatsChange(redNum: number) {
        this.node.active = redNum > 0;
    }

}