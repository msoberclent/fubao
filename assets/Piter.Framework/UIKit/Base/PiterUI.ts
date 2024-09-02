
import { Label, _decorator, isValid } from 'cc';
import { BaseEvent } from '../../BaseKit/Constant/BaseEvent';
import Global from '../../PiterGlobal';
import { PiterComponent } from './PiterComponent';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BaseComponent
 * DateTime = Mon Oct 18 2021 11:59:27 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * PiterUI 非全屏界面使用
 */

@ccclass('PiterUI')
export class PiterUI extends PiterComponent {

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    public onAdded() {
        super.onAdded();
        Global.EVENT.on(BaseEvent.CHANGE_LANGUAGE, this.changeLanguage, this);
    }

    public onRemoved() {
        super.onRemoved();
        Global.EVENT.off(BaseEvent.CHANGE_LANGUAGE, this.changeLanguage, this);
    }

    public changeLanguage() {
        if (this.node && isValid(this.node)) {
            Global.LANG.resetLabels(this.node.getComponentsInChildren(Label));
        }
    }

    public createChildren() {
        super.createChildren();
    }
}


