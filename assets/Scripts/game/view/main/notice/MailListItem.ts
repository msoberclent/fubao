import { Component, Label, _decorator } from 'cc';
import { ButtonSpriteChange } from './../../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange';
const { ccclass, property } = _decorator;

@ccclass('MailListItem')
export class MailListItem extends Component {

    itemData: MSG_MailItem;

    info: any;

    setItemData(itemData: MSG_MailItem, i) {
        this.itemData = itemData;
        this.node.getChildByName("title").getComponent(Label).string = itemData.mailTitle;
        this.flushUI();
    }

    public flushUI(){
        let status = this.node.getChildByName("status");
        if (this.itemData.readed == 1) {
            status.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
        } else {
            status.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
        }
    }
}


export interface MSG_MailItem {
    createStamp: string;
    dayStr: string;
    id: number
    mailAddDiamond: number
    mailAddGold: number
    mailAddSafety: number
    mailDesc: string
    mailGoldChangeType: number
    mailGoldChangeTypeDesc: string
    mailReceiverUid: number
    mailSenderName: string
    mailSenderUid: number
    mailTitle: string
    mailType: string
    readed: number
}





