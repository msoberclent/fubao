import { Component, Label, Node, Sprite, _decorator, log } from "cc";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * 龙虎斗玩家列表
 */
@ccclass('GameLogItem')
export class GameLogItem extends Component {

    @property(Label)
    lbl: Label = null;

    public updateItem(itemData, index) {
        this.lbl.string = itemData.data;
    }

}