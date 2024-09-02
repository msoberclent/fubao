import { Component } from "cc";
import { _decorator } from "cc";
import { tween } from "cc";
import { v3 } from "cc";
import { Node } from "cc";
import Global from "../PiterGlobal";
import { GameLogPanel } from "../../Scripts/game/view/log/GameLogPanel";

const { ccclass, property } = _decorator;

@ccclass('LogDebug')
export class LogDebug extends Component {

    ticket = 0;
    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.touchstart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    onDestroy() {

    }

    touchstart() {  
        this.ticket = 0;
    }

    touchMove() {
        this.ticket += 1;
        if (this.ticket >= 100) {
            this.onNodeTouch();
        }
    }

    touchEnd() {
        this.ticket = 0;
    }

    onNodeTouch() {
        if (!CC_DEBUG) return;
        let ui = Global.UI.getUI(GameLogPanel);
        if (!ui) {
            Global.UI.openView(GameLogPanel,null,()=>{
                Global.UI.getUI(GameLogPanel).getComponent(GameLogPanel).showLog();
            });
        } else {
            ui.getComponent(GameLogPanel).setActive();
        }
    }
}