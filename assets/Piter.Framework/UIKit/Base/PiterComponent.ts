
import { _decorator, Component, Node, Label, Button, Sprite, sys } from 'cc';
import { BaseEvent } from '../../BaseKit/Constant/BaseEvent';
import Global from '../../PiterGlobal';
import PiterAutoBind from '../AutoBind/PiterAutoBind';
import { TimeoutHandler } from '../Handler/TimeoutHandler';
import ButtonUtils from '../Util/ButtonUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BaseComponent
 * DateTime = Mon Oct 18 2021 11:59:27 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * 框架基础组件
 */

@ccclass('PiterComponent')
export class PiterComponent extends Component {

    public start() {
        //设置节点上的Label为国际化文本
        this.createChildren();

    }

    protected isLoadedOver: boolean = false;

    public onLoad() {
        if (Global.LANG) {
            Global.LANG.resetLabels(this.node.getComponentsInChildren(Label));
        }
        ButtonUtils.addButtonEffect(this.node.getComponentsInChildren(Button), this);
        ButtonUtils.addSpriteButton(this.node.getComponentsInChildren(Sprite), this);
        this.autoBingComp = this.node.getComponent(PiterAutoBind);
        this.onAdded();

    }

    public onDestroy() {
        this.onRemoved();
    }

    /**
     * 绑定变量
     */
    private bindAutoMember() {

    }

    public onAdded() {
        Global.EVENT.on(BaseEvent.RUN_BACKEND, this.parseGame, this);
        Global.EVENT.on(BaseEvent.RUN_FORTEND, this.remuseGame, this);
    }

    public onRemoved() {
        Global.EVENT.off(BaseEvent.RUN_BACKEND, this.parseGame, this);
        Global.EVENT.off(BaseEvent.RUN_FORTEND, this.remuseGame, this);
        this.pauseHandler.destroy();
    }

    public createChildren() {
        this.isLoadedOver = true;
    }


    public pauseHandler: TimeoutHandler = new TimeoutHandler();
    private tweenList: any[] = [];
    /**
    * 添加延迟函数(后台则立即执行)
    * @param  {} fn
    * @param  {} thisObj
    * @param  {} time 秒
    */
    protected setAutoTimeout(fn, thisObj, time: number) {
        for (var a = [], n = 3; n < arguments.length; n++) a[n - 3] = arguments[n];
        return (s = this.pauseHandler).setAutoTimeout.apply(s, [fn, thisObj, time].concat(a));
        var s
    }


    protected parseGame() {
        this.execAllPauseFn();
        this.execAllAutoTimeout();
    }
    protected remuseGame() {
        // this.removeAllAnimation(), 
        this.removeAllEffectList();
        // this.removeAllTimeList(), this.removeAllIntervalList();
    }

    public removeAllEffectList() {
        if (!this.tweenList) {
            return;
        }
    }

    /**
     * 移除暂停函数
     */
    protected removePauseFn(fn: Function, thisObj) {
        this.pauseHandler && this.pauseHandler.removePauseFn(fn, thisObj);
    }

    /**
     * 执行所有暂停函数
     */
    protected execAllPauseFn() {
        this.pauseHandler && this.pauseHandler.execAllPauseFn();
    }

    /**
     * 游戏APP暂停调用
     */
    protected onPause() {
        this.pauseHandler && this.pauseHandler.onPause();
    }

    /**
         * 清除延迟函数
         * @param  {} timeId
         */
    protected clearAutoTimeout(timeId) {
        this.pauseHandler && this.pauseHandler.clearAutoTimeout(timeId);
    }

    /**
     * 执行延迟函数
     * @param  {} timeId
     */
    protected execAutoTimeout(timeId) {
        this.pauseHandler && this.pauseHandler.execAutoTimeout(timeId);
    }

    /**
     * 执行所有延迟函数
     */
    protected execAllAutoTimeout() {
        this.pauseHandler && this.pauseHandler.execAllAutoTimeout();
    }

    /**
     * 清除所有延迟函数
     */
    protected clearAllAutoTimeout() {
        this.pauseHandler && this.pauseHandler.clearAllAutoTimeout();
    }


    //---------自动绑定----------

    private __autobindComp__: PiterAutoBind;

    set autoBingComp(v) {
        if (!v) {
            return;
        }
        let self = this as any;
        this.__autobindComp__ = v;
        for (let k of Object.keys(this)) {
            if (this.__AUTOBINDS__[k]) {
                self[k] = v.get(self.__BINDNAMES__[k] || k, this.__AUTOBINDS__[k]);
            }
        }
    }

    get autoBingComp() {
        return this.__autobindComp__;
    }

    get __AUTOBINDS__() {
        let self = this as any;
        return self.__autobind__ || {};
    }

    get __BINDNAMES__() {
        let self = this as any;
        return self.__bindname__ || {};
    }
}


