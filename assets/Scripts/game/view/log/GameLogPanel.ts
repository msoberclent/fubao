import { Component, Label, Node, Sprite, _decorator, log } from "cc";
import Global from "../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../Piter.Framework/UIKit/Base/PiterPanel";
import List from "../../../../Piter.Framework/UIKit/Component/list/List";
import { GameLogItem } from "./GameLogItem";

const { ccclass, property } = _decorator;
@ccclass('GameLogPanel')
export class GameLogPanel extends PiterPanel {
    protected static prefabUrl = "common/prefabs/GameLogPanel";

    protected static className = "GameLogPanel";
    @property(List)
    sclist: List = null;


    public createChildren(): void {
        super.createChildren();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    showLog() {
        this.sclist.numItems = GameLogData.dataList.length;
    }

    onListRender(item: Node, idx) {
        let data = GameLogData.dataList[idx];
        item.getComponent(GameLogItem).updateItem(data, idx);
    }

    onbtnHide() {
        this.node.active = false;
    }

    setActive() {
        this.node.active = true;
        this.showLog();
    }

    onBtnclear() {
        GameLogData.dataList = [];
        this.sclist.numItems = GameLogData.dataList.length;
    }

    //关闭
    AT_closeBtnTouch() {
        Global.UI.closeView(GameLogPanel);
    }

}

export class GameLogData {
    static dataList = [];

    static pushLog(str) {
        let item = { data: str };
        this.dataList.push(item);
    }
}