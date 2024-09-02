
import { _decorator, Component, error, Node } from 'cc';
import Global from '../../PiterGlobal';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = EventManager
 * DateTime = Mon Oct 18 2021 12:04:48 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * FileBasename = Global.EVENT.ts
 * FileBasenameNoExtension = EventManager
 * URL = db://assets/scripts/baseframework/managers/Global.EVENT.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

type EventCallback = (ename: string, data: any) => void;

interface EventValue {
    caller: any,
    func: EventCallback
}

@ccclass('EventManager')
export class EventManager extends Component {
    static instance: EventManager = null;

    private eventMap: Map<string, Array<EventValue>> = new Map<string, Array<EventValue>>();

    // LIFE-CYCLE CALLBACKS:
    start() {
        Global.EVENT = this;
    }

    on(eventName: string, func: any, caller: any) {
        if (!this.eventMap.has(eventName)) {
            this.eventMap.set(eventName, new Array<EventValue>());
        }
        var event_queue = this.eventMap.get(eventName);
        event_queue.push({
            caller: caller,
            func: func
        });
    }

    off(eventName: string, func: any, caller: any) {
        if (!this.eventMap.has(eventName)) {
            return;
        }

        var event_queue = this.eventMap.get(eventName);
        for (var i = 0; i < event_queue.length; i++) {
            var obj = event_queue[i];
            if (obj.caller == caller && obj.func == func) {
                event_queue.splice(i, 1);
                break;
            }
        }

        if (event_queue.length <= 0) {
            this.eventMap.delete(eventName);
        }
    }

    dispatchEvent(eventName: string, udata?: any) {
        if (this.eventMap == null) {
            return;
        }
        if (!this.eventMap.has(eventName)) {
            return;
        }

        var event_queue = this.eventMap.get(eventName);
        for (var i = 0; i < event_queue.length; i++) {
            var obj = event_queue[i];
            obj.func.call(obj.caller, udata, eventName);
        }
    }
}


