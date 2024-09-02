
import { EditBox, Label, Node, _decorator, instantiate, isValid, v3 } from 'cc';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { GridItemAni } from '../../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
import { KSFHZSItem } from '../item/KSFHZSItem';
import { ModifyShuiShouPanel } from '../zhishu/ModifyShuiShouPanel';
import { PromotionBaseNode } from "./PromotionBaseNode";
const { ccclass, property } = _decorator;
/**
 * 我的直属
 */
@ccclass('PromotionWDZSNode')
export class PromotionWDZSNode extends PromotionBaseNode {
  @PiterDirector.AUTO_BIND(EditBox)
  AT_inputId: EditBox;
  @PiterDirector.AUTO_BIND(Node)
  AT_zhishuItem: Node;
  @PiterDirector.AUTO_BIND(Node)
  AT_zhishuLayout: Node;
  @PiterDirector.AUTO_BIND(Node)
  AT_chargeLabel: Node

  zhishutype = 0;
  zhishuCurPage = 1;
  zhishuTotalpage = 1;

  public async init() {
    this.resquestMyZhishu();
  }

  public onAdded() {
    super.onAdded();
    Global.EVENT.on("FLUSH_PROMIOTION_BAODI", this.resquestMyZhishu, this);
  }

  public onRemoved() {
    super.onRemoved();
    Global.EVENT.off("FLUSH_PROMIOTION_BAODI", this.resquestMyZhishu, this);
  }

  /**
   *查询直属,type =0 历史,type=1 今天
   */
  async resquestMyZhishu(type = 0) {
    let idInput = this.AT_inputId.string;
    let data;
    this.AT_zhishuLayout.destroyAllChildren();
    if (idInput && idInput != "") {
      data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-direct", { childId: idInput, page: this.zhishuCurPage, pageLength: 10, type: type }, true);
    } else {
      data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-direct", { page: this.zhishuCurPage, pageLength: 10, type: type }, true);
    }
    if (!isValid(this.node)) {
      return;
    }
    if (data.code == 200) {
      let list = data.data.list;
      if (!list || list.length == 0) {
        this.node.getChildByName("cm_nodata").active = true;
      } else {
        this.node.getChildByName("cm_nodata").active = false;
      }
      this.node.getChildByName("zhishucount").getComponent(Label).string = "直属玩家数量: " + list.length;
      this.zhishuCurPage = data.data.page;
      this.zhishuTotalpage = data.data.totalPage;
      this.node.getChildByName("pages").getComponent(Label).string = (data.data.page) + "/" + (data.data.totalPage);
      for (let i = 0; i < list.length; i++) {
        let v = instantiate(this.AT_zhishuItem);
        let item = v.getComponent(KSFHZSItem);
        let info = { fanyongbi: data.data.platMaxFanyongbiVal ? data.data.platMaxFanyongbiVal : data.data.fanyongbiVal, fanyongbiVal: data.data.fanyongbiVal, from: "promotion", hisfanyong: list[i].fanyongbi, id: list[i].nick, fatherid: list[i].uid };
        v.setPosition(v3(0, 0));
        v.active = true;
        item.info = info;
        item.setItemData(list[i], i);
        v.getChildByName("xiangqingBtn").active = data.data.fanyongbi;
        this.AT_zhishuLayout.addChild(v)
        v.getComponent(GridItemAni).startAnimation(i);
      }
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }

  /**
       *直属历史下一页
       */
  AT_zhuanshuNextBtnTouch() {
    this.zhishuCurPage += 1;
    if (this.zhishuCurPage > this.zhishuTotalpage) {
      this.zhishuCurPage -= 1
      return
    };
    this.resquestMyZhishu();
  }

  /**
    *直属历史上一页
    */
  AT_zhuanshuLastBtnTouch() {
    this.zhishuCurPage -= 1;
    if (this.zhishuCurPage <= 0) {
      this.zhishuCurPage += 1;
      return
    };
    this.resquestMyZhishu()
  }

  /**
     *直属历史查询
     */
  AT_zhishuQueryBtnTouch() {
    this.resquestMyZhishu(this.zhishutype);
  }

  /**
   *直属当日流水查询
   */
  AT_zhishuCurBtnTouch() {
    this.resquestMyZhishu();
  }

  changeZhishuLakaiType(e, custom) {
    if (this.zhishutype == Number(custom)) return;
    this.zhishutype = Number(custom);
    this.AT_chargeLabel.getComponent(Label).string = this.getchargeType(this.zhishutype);
    this.resquestMyZhishu(this.zhishutype);
    this.onZhishulakaiClick();
  }


  getchargeType(type) {
    switch (type) {
      case 0:
        return "全部";
      case 1:
        return "今日";
      case 2:
        return "昨日";
      case 3:
        return "本周";
      case 4:
        return "上周";
      case 5:
        return "本月";
    }
  }

  onZhishulakaiClick() {
    let node = this.node.getChildByName("select");
    node.getChildByName("lakai").active = !node.getChildByName("lakai").active;
  }

  /**
    * 设置保底
    * @param {*} e
    * @param {*} custom
    */
  onBtnShezhibaodi(e, custom) {
    let node = e.target.parent;
    if (node && node[`data`]) {
      Global.UI.openView(ModifyShuiShouPanel, node[`data`]);
    }
  }
}