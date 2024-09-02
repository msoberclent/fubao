import { Component, _decorator } from "cc";
const { ccclass, property } = _decorator;
/**
 * Predefined variables
 * Name = DateTimeManager
 * DateTime = Mon Oct 18 2021 13:40:20 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * 时间管理器
 */

@ccclass('DateTimeManager')
export class DateTimeManager extends Component {
    static _instance: DateTimeManager;

    onLoad() {
        DateTimeManager._instance = this;
    }

    public static get instance(): DateTimeManager {
        return DateTimeManager._instance;
    }

    public update(dt: number) {
        this.playingTime += dt;
    }
    /**
     * 服务器延迟时间
     */
    private delayTime: number = 0;

    private playingTime: number = 0;

    public updateServerTime(val: number) {
        this.delayTime = Date.now() - val;
    }

    public get now() {
        return Math.floor(Date.now() - this.delayTime);
    }

    public get dayPlayGamingTime() {
        return this.playingTime;
    }

    public clearPlayingTime() {
        this.playingTime = 0;
    }
}