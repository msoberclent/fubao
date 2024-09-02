/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { _decorator,Node } from 'cc';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import { PiterUI } from '../../../../../../Piter.Framework/UIKit/Base/PiterUI';
const { ccclass, property } = _decorator;

@ccclass('MXJLContent')
export class MXJLContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_ActivityLayout: Node;

    public createChildren(): void {
        super.createChildren();
    }

    onEnable() {

    }

    onDisable() {

    }

}
