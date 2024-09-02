import { _decorator, Prefab, Node, instantiate, NodePool, Component, Pool } from "cc";
import Global from "../../PiterGlobal";
const { ccclass, property } = _decorator;
/**
 * Predefined variables
 * Name = UIManager
 * DateTime = Mon Oct 18 2021 11:41:05 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * Description = 对象池
 */

@ccclass("PoolManager")
export class PoolManager extends Component {
    private cacheDict: Object = {};
    start() {
        Global.POOL = this;
    }

    /**生产*/
    public produce(cacheName: string, clazz: any) {
        if (!this.cacheDict[cacheName]) {
            this.cacheDict[cacheName] = [];
        }
        if (this.cacheDict[cacheName].length > 0) {
            let one = this.cacheDict[cacheName].shift();
            return one;
        } else {
            return null;
        }
    }
    /**回收*/
    public reclaim(cacheName: string, obj: Node, val: number = 20): void {
        if (!this.cacheDict[cacheName]) {
            this.cacheDict[cacheName] = [];
        }
        if (this.cacheDict[cacheName].length > val) {
            obj.destroy && obj.destroy();
            obj = null;
            return;
        }
        if (this.cacheDict[cacheName].indexOf(obj) > -1) {
            return;
        }
        this.scheduleOnce(() => {
            this.cacheDict[cacheName] && this.cacheDict[cacheName].push(obj);
        }, 0)
    }
    /**
     * 对象池数量
     * @param  {} cacheName
     */
    public objectChildrenNum(cacheName) {
        return this.cacheDict[cacheName].length;
    }
    /**
     * 注销对象池
     * @param  {} cacheName
     */
    public cancelPool(cacheName) {
        this.cacheDict[cacheName] = null;
    }

    public clearPool() {
        this.cacheDict = {};
    }
}
