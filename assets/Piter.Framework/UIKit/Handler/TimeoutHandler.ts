import { BaseConstant } from "../../BaseKit/Constant/BaseConstant";

/**
 * 超时管理器
 */
export class TimeoutHandler {
    //暂停方法 {fn: xx, thisobj};
    private mPauseFns: any = [];
    //定时器list
    private autoTimeoutList = [];
    public constructor() {
    }
    /**
     * 游戏APP暂停调用
     */
    public onPause() {
        this.execAllPauseFn();
        this.execAllAutoTimeout();
    }
    public onResume() {
    }
    /**
     * 添加暂停后调用的函数（后台运行立即执行）
     */
    public addPauseFn(fn: Function, thisObj) {
        if (BaseConstant.RUNING_BACK) {
            fn.call(thisObj);
        }
        else {
            this.mPauseFns.push({ fn: fn, fnThis: thisObj });
        }
    }
    /**
     * 移除暂停函数
     */
    public removePauseFn(fn: Function, thisObj) {
        for (var i = this.mPauseFns, a = i.length - 1; a >= 0; a--)
            i[a].fn == fn && i[a].fnThis == thisObj && i.splice(a, 1);
    }
    /**
     * 清除所有暂停函数
     */
    public clearAllPauseFn() {
        if (this.mPauseFns) {
            this.mPauseFns.length = 0;
        }
    }
    /**
     * 执行所有暂停函数
     */
    public execAllPauseFn() {

        if (this.mPauseFns) {
            for (var e = this.mPauseFns, t = 0; t < e.length; t++) {
                var i = e[t];
                i.fn.call(i.fnThis);
            }
            e.length = 0;
        }
    }
    /**
     * 添加延迟函数(后台则立即执行)
     * @param  {} fn
     * @param  {} thisObj
     * @param  {} time
     */
    public setAutoTimeout(fn, thisObj, time) {
        if (!this.autoTimeoutList) {
            return;
        }
        time = time * 1000;
        for (var n = this, s = [], r = 3; r < arguments.length; r++)
            s[r - 3] = arguments[r];
        var o = -1;
        return BaseConstant.RUNING_BACK ? fn.apply(thisObj, s) : (o = setTimeout(function () {
            n.clearAutoTimeout(o), fn.apply(thisObj, s);
        }, time), this.autoTimeoutList.push({ timeId: o, listener: fn, thisObj: thisObj, param: s })), o;
    }
    /**
     * 清除延迟函数
     * @param  {} timeId
     */
    public clearAutoTimeout(timeId) {
        clearTimeout(timeId);
        for (var t = this.autoTimeoutList, i = 0; i < t.length; i++)
            if (t[i].timeId == timeId) {
                t.splice(i, 1);
                break;
            }
    }
    /**
     * 执行延迟函数
     * @param  {} timeId
     */
    public execAutoTimeout(timeId) {
        if (this.autoTimeoutList)
            for (var t = this.autoTimeoutList, i = void 0, a = 0; a < t.length; a++)
                if (i = t[a], i.timeId == timeId) {
                    clearTimeout(i.timeId), i.listener.call(i.thisObj, i.param), t.splice(a, 1);
                    break;
                }
    }
    /**
     * 执行所有延迟函数
     */
    public execAllAutoTimeout() {
        if (this.autoTimeoutList) {
            for (var e = this.autoTimeoutList, t = void 0, i = 0; i < e.length; i++)
                t = e[i], clearTimeout(t.timeId), t.listener.call(t.thisObj, t.param);
            e.length = 0;
        }
    }
    /**
     * 清除所有延迟函数
     */
    public clearAllAutoTimeout() {
        if (this.autoTimeoutList) {
            for (var e = 0, t = this.autoTimeoutList; e < t.length; e++) {
                var i = t[e];
                clearTimeout(i.timeId);
            }
            this.autoTimeoutList.length = 0;
        }
    }
    /**
     * 销毁
     */
    public destroy() {
        this.clearAllAutoTimeout(), this.autoTimeoutList = null, this.clearAllPauseFn(), this.mPauseFns = null;
    }
}
