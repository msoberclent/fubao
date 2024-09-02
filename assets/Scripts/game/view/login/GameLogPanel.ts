import { EditBox, Node, _decorator, sys } from 'cc';
import { BaseEvent } from '../../../../Piter.Framework/BaseKit/Constant/BaseEvent';
import NetLoadingView from '../../../../Piter.Framework/NetKit/NetLoadingView';
import { PiterDirector } from '../../../../Piter.Framework/PiterDirector';
import Global from '../../../../Piter.Framework/PiterGlobal';
import PiterPanel from '../../../../Piter.Framework/UIKit/Base/PiterPanel';
import { ServerConfig } from '../../constant/ServerConst';
import { GameFindPasswardPanel } from './GameFindPasswardPanel';
import { GameLogItem } from './GameLogItem';
import { tween } from 'cc';
import { UITransform } from 'cc';
import { v3 } from 'cc';
import { v2 } from 'cc';
import List from '../../../../Piter.Framework/UIKit/Component/list/List';
const { ccclass, property } = _decorator;

@ccclass('GameLogPanel')
export class GameLogPanel extends PiterPanel {
    protected static prefabUrl = "prefabs/GameLogPanel";

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