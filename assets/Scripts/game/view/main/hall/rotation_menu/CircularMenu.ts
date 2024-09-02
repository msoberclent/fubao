import { Component, Prefab, Toggle, _decorator, instantiate, warn } from 'cc';
import { BaseEvent } from '../../../../../../Piter.Framework/BaseKit/Constant/BaseEvent';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { config_game_menu, MainTabItem } from '../MainTabItem';
import { CircularItem } from './CircularItem';
const { ccclass, property } = _decorator;
const MIN_INTERVAL = 0
const MAX_INTERVAL = 1
@ccclass('CircularMenu')
export class CircularMenu extends Component {

    @property(Prefab) prefab: Prefab = null
    items: CircularItem[] = []
    private _radius: number = 335
    private _interval: number = 0.88//0.84
    private _maxItemCount: number
    private currentMinIndex: number
    private currentMaxIndex: number
    private currentInfo: any
    private config: any = []

    public get radius() { return this._radius }
    public get interval() { return this._interval }
    public get maxItemCount() { return this._maxItemCount }

    onLoad() {

    }


    public initByTest() {
        // 初始化 模拟数据
        for (let i = 0; i < 8; i++) {
            this.config.push({ name: i })
        }
        // 限制间隔在允许范围内
        this._interval = Math.max(this._interval, MIN_INTERVAL)
        this._interval = Math.min(this._interval, MAX_INTERVAL)
        // 限制预制体最大可创建数量
        this._maxItemCount = this.config.length > 9 ? 9 : this.config.length
        for (let i = 0; i < this.maxItemCount; i++) {
            const info = this.config[i];
            var item = this.getItem()
            item.node.name = i.toString()
            item.show(i, info, this)
            this.items.push(item)
        }
        this.currentMinIndex = 0
        this.currentMaxIndex = this.maxItemCount - 1
        // 模拟一次点击
        var index = 1
        this.items[index].onClick()
    }

    public initCircleMenu() {
        let tabs = Global.PLAYER.allGameConfig["topClass"];
        let tabList: config_game_menu[] = [];
        for (let i = 0; i < tabs.length; i++) {
            let item: config_game_menu = {
                type: tabs[i],
                key: tabs[i],
                zIndex: i + 1
            }
            tabList.push(item);
        }
        // 初始化 模拟数据
        let tabSelect = Global.ONCE_STORAGE[`lastSelectTab`];
        let index = 0;
        this._maxItemCount = tabList.length
        for (let i = 0; i < tabList.length; i++) {
            this.config.push(tabList[i]);
        }
        for (let i = 0; i < tabList.length; i++) {
            let tabKeys = tabList[i] as config_game_menu;
            const info = this.config[i];
            var item = this.getItem()
            item.node.name = i.toString()
            item.show(i, info, this)
            this.items.push(item)
            item.getComponent(MainTabItem).initByConfigData(tabKeys);
            if (tabSelect == undefined) {
                if (i == 0) {
                    item.getComponent(Toggle).isChecked = true;
                    index = 0;
                }
            } else if (tabSelect == tabKeys.key) {
                item.getComponent(Toggle).isChecked = true;
                index = i;
            }
        }
        this.currentMinIndex = 0
        this.currentMaxIndex = this.maxItemCount - 1
        // 模拟一次点击
        this.items[index] && this.items[index].onClick()
    }

    onClick(target: CircularItem) {
        if (this.currentInfo === target.info) {
            warn("不能重复点击")
            return
        }
        this.currentInfo = target.info
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            item.follow(target)
        }
        Global.EVENT.dispatchEvent(BaseEvent.CIRCULAR_MENU_TOUCH, {
            node: target.node,
            info: this.currentInfo
        });
    }
    onCenter(info: any) {
        // log("刷新", info)
    }
    getItem(): CircularItem {
        var obj = instantiate(this.prefab)
        this.node.addChild(obj)
        var item = obj.getComponent(CircularItem)
        return item
    }
    addIndexs(item: any) {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].addIndex(item)
        }
        this.currentMinIndex--
        this.currentMaxIndex--
        if (this.currentMinIndex < 0) {
            this.currentMinIndex = this.config.length - 1
        }
        if (this.currentMaxIndex < 0) {
            this.currentMaxIndex = this.config.length - 1
        }
        item.refreshItem(this.config[this.currentMinIndex])
    }
    remIndexs(item: any) {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].remIndex(item)
        }
        this.currentMaxIndex++
        this.currentMinIndex++
        if (this.currentMaxIndex >= this.config.length) {
            this.currentMaxIndex = 0
        }
        if (this.currentMinIndex >= this.config.length) {
            this.currentMinIndex = 0
        }
        item.refreshItem(this.config[this.currentMaxIndex])
    }
}


