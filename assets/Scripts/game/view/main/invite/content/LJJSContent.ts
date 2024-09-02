/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { Node, _decorator, instantiate } from 'cc';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { PiterUI } from '../../../../../../Piter.Framework/UIKit/Base/PiterUI';
import { ServerConfig } from '../../../../constant/ServerConst';
import { ActivityItem } from '../../ActivityItem';
const { ccclass, property } = _decorator;

@ccclass('LJJSContent')
export class LJJSContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_ActivityLayout: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_ActivityItem: Node;

    public createChildren(): void {
        super.createChildren();
        this.getActivityList();
    }

    async getActivityList() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/activity-list", {
            page: 0,
            pageLength: 999,
            category: 1
        });
        if (resp.code == 200) {
            this.showList(resp.data.list);
        }
    }

    public showList(list) {
        for (let i = 0; i < list.length; i++) {
            let node = instantiate(this.AT_ActivityItem);
            node.parent = this.AT_ActivityLayout;
            node.active = true;
            node.getComponent(ActivityItem).updateItem2(list[i]);
        }
    }

}
