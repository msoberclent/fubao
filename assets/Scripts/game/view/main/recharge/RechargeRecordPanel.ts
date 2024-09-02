import { Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { GridItemAni } from "../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { ServerConfig } from "../../../constant/ServerConst";
import { PageTools } from "../../component/PageTools";
import { FullScreenView } from "../FullScreenView";
import { RechargeRecordItem } from "./RechargeRecordItem";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * 充值记录Panel
 */
@ccclass('RechargeRecordPanel')
export class RechargeRecordPanel extends FullScreenView {

  protected static prefabUrl = "bank/prefabs/RechargeRecordPanel";

  protected static className = "RechargeRecordPanel";

  @PiterDirector.AUTO_BIND(Node)
  AT_List: Node;

  @PiterDirector.AUTO_BIND(PageTools)
  AT_PageTool: PageTools;

  @PiterDirector.AUTO_BIND(Node)
  AT_NoRecord: Node;

  listData: any[] = [];
  public async createChildren() {
    super.createChildren();
    this.AT_PageTool.setPageData(this, ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge/list-by-page", 1, 99);
  }

  onPageData(data) {
    this.listData = data.list;
    this.AT_List.getComponent(List).numItems = this.listData.length;
    this.AT_List.getComponent(List).updateAll();
    if (this.listData.length == 0) {
      this.AT_NoRecord.active = true;
    } else {
      this.AT_NoRecord.active = false;
    }
  }

  AT_closeBtnTouch() {
    Global.UI.closeView(RechargeRecordPanel)
  }

  public onListRender(item: Node, idx) {
    let data = this.listData[idx];
    item.getComponent(RechargeRecordItem).updateItem(data, idx);
    item.getComponent(GridItemAni).startAnimation(0);
  }
}