import { Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { GridItemAni } from "../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { ServerConfig } from "../../../constant/ServerConst";
import { PageTools } from "../../component/PageTools";
import { WIthdrawRecordItem } from "./WIthdrawRecordItem";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * 充值记录Panel
 */
@ccclass('WithdrawRecordPanel')
export class WithdrawRecordPanel extends PiterUI {

  @PiterDirector.AUTO_BIND(List)
  AT_List: List;

  @PiterDirector.AUTO_BIND(PageTools)
  AT_PageTool: PageTools;
  @PiterDirector.AUTO_BIND(Node)
  AT_NoRecord: Node;

  listData: any[] = [];

  onInit() {
    this.AT_PageTool.setPageData(this, ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/order-list", 1, 50);
  }
  public async createChildren() {
    super.createChildren();
  }

  onPageData(data) {
    this.listData = data.list;
    this.AT_List.numItems = this.listData.length;
    this.AT_List.updateAll();
    if (this.listData.length == 0) {
      this.AT_NoRecord.active = true;
    } else {
      this.AT_NoRecord.active = false;
    }
  }


  public onListRender(item: Node, idx) {
    let data = this.listData[idx];
    item.getComponent(WIthdrawRecordItem).updateItem(data, idx);
    item.getComponent(GridItemAni).startAnimation(0);
  }
}