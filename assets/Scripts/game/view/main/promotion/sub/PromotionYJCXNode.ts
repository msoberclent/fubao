
import { Label, Node, ScrollView, _decorator, instantiate, v3 } from 'cc';
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { ButtonSpriteChange } from '../../../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange';
import { GridItemAni } from '../../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
import { PromotionBaseNode } from "./PromotionBaseNode";
const { ccclass, property } = _decorator;
/**
 * 业绩查询
 */
@ccclass('PromotionYJCXNode')
export class PromotionYJCXNode extends PromotionBaseNode {

  @PiterDirector.AUTO_BIND(Node)
  AT_YejiItem2: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_yejiSc: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_yjLabel: Node

  public async init() {
    this.requestMyShouyi();
  }

  createChildren() {
    super.createChildren();
    this.AT_YejiItem2.active = false;
  }

  yjType = 0;
  onYJlakaiClick() {
    let node = this.node.getChildByName("out").getChildByName("select").getChildByName("lakai");
    node.active = !node.active;
  }

  changeYJTypeClick(e, custom) {
    if (this.yjType == Number(custom)) return;
    this.yjType = Number(custom);
    this.requestMyShouyi(this.yjType);
    this.AT_yjLabel.getComponent(Label).string = this.getYjType(this.yjType);
    this.onYJlakaiClick();
  }

  getYjType(type) {
    switch (type) {
      case 0:
        return "最近7天";
      case 1:
        return "最近15天";
      case 2:
        return "最近30天";
    }
  }

  onbtnYJDetailClick(e) {
    let node = e.target.parent;
    let info = node[`info`];
    if (node[`idx`] == 0) {
      this.freshYJDetail(info, true);
    } else {
      this.freshYJDetail(info);
    }
  }


  /**
     * 业绩查询详情
     * @param {*} data
     */
  async freshYJDetail(data, sum = false) {
    let resp;
    if (sum) {
      resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-performance-detail", { sum: this.yjType }, true);
    } else {
      resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-performance-detail", { day: data.dayStr }, true);
    }
    if (resp.code == 200) {
      this.node.getChildByName("out").active = false;
      this.node.getChildByName("in").active = true;
      let layout = this.node.getChildByName("in").getComponent(ScrollView).content;
      let con1 = layout.getChildByName("content1");
      let con2 = layout.getChildByName("content2");
      let cont3 = layout.getChildByName("content3");

      con1.getChildByName("time").getComponent(Label).string = resp.data.dayStart + "-" + resp.data.dayEnd;
      if (resp.data.dayStart == resp.data.dayEnd) {
        con1.getChildByName("time").getComponent(Label).string = resp.data.dayStart;
      }
      con1.getChildByName("teamnum").getComponent(Label).string = resp.data.teamNum + "(" + resp.data.teamNumNew + ")";
      con1.getChildByName("zsnum").getComponent(Label).string = resp.data.directNum + "(" + resp.data.directNumNew + ")";
      con1.getChildByName("zyj").getComponent(Label).string = GoldUtils.formatGold(resp.data.totalPerfomance);
      con1.getChildByName("yjze").getComponent(Label).string = GoldUtils.formatGold(resp.data.totalEffect);
      let list = resp.data.directs;
      cont3.getChildByName("layout").destroyAllChildren();
      if (!list || list.length == 0) {
        cont3.getChildByName("cm_nodata").active = true;
      } else {
        for (let i = 0; i < list.length; i++) {
          let vM = instantiate(cont3.getChildByName("phb_4"));
          vM.active = true;
          vM.setPosition(v3(0, 0));
          vM.setParent(cont3.getChildByName("layout"));
          vM.getChildByName("main").getChildByName("nick").getComponent(Label).string = list[i].nick;
          vM.getChildByName("main").getChildByName("id").getComponent(Label).string = list[i].uid + "";
          vM.getChildByName("main").getChildByName("rs").getComponent(Label).string = list[i].teamNum + "";
          vM.getChildByName("main").getChildByName("mwfy").getComponent(Label).string = list[i].effectRate + "";
          for (let j = 0; j < list[i].directList.length; j++) {
            let v = instantiate(vM.getChildByName("resultItem"));
            v.active = true;
            v.setPosition(v3(0, 0));
            v.setParent(vM.getChildByName("dirctor"));
            v.getChildByName("leix").getComponent(Label).string = list[i].directList[j].flowTypeName;
            v.getChildByName("zyyj").getComponent(Label).string = GoldUtils.formatGold(list[i].directList[j].directPerformance, 0);
            v.getChildByName("tdyj").getComponent(Label).string = GoldUtils.formatGold(list[i].directList[j].teamPerformance, 0);
            v.getChildByName("mwfy").getComponent(Label).string = list[i].effectRate + "";
          }
        }
        this.scheduleOnce(() => {
          cont3.active = false;
          cont3.active = true;
        }, .5)
        if (cont3.getChildByName("layout").children.length == 0) {
          cont3.getChildByName("cm_nodata").active = true;
        } else {
          cont3.getChildByName("cm_nodata").active = false;
        }
      }
      con2.getChildByName("layout").destroyAllChildren();
      if (resp.data.summary) {
        let item = con2.getChildByName("phx");
        for (let i = 0; i < resp.data.summary.length; i++) {
          let l = instantiate(item);
          l.active = true;
          l.setParent(con2.getChildByName("layout"));
          l.setPosition(v3(0, 0));
          l.getChildByName("lx").getComponent(Label).string = resp.data.summary[i].flowTypeName;
          l.getChildByName("zyj").getComponent(Label).string = GoldUtils.formatGold(resp.data.summary[i].totalPerfomance, 0);
          l.getChildByName("zsyj").getComponent(Label).string = GoldUtils.formatGold(resp.data.summary[i].directPerfomance, 0);
          l.getChildByName("tdyj").getComponent(Label).string = GoldUtils.formatGold(resp.data.summary[i].teamPerfomance, 0);
          l.getChildByName("mwfy").getComponent(Label).string = resp.data.summary[i].effectRate + "";
          l.getChildByName("zyj1").getComponent(Label).string = GoldUtils.formatGold(resp.data.summary[i].totalEffect, 0);
          if (sum) {
            l.getChildByName("mwfy").getComponent(Label).string = "-"
          }
          l.getComponent(GridItemAni).startAnimation(i);
          // l.getChildByName("zyj").getComponent(Label).string = GoldUtils.formatGold(resp.data.summary[i].totalEffect, 0);
        }
      }
    } else {
      return DefaultToast.instance.showText(resp.msg);
    }
  }

  onZhiShuXQDirtor(e) {
    return;
    let node = e.target;
    node.parent.getChildByName("dirctor").active = !node.parent.getChildByName("dirctor").active;
  }


  /**
     *业绩查询
     */
  async requestMyShouyi(type = 0) {
    this.node.active = true;
    this.AT_yejiSc.getComponent(ScrollView).content.destroyAllChildren();
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-performance-query", { type: type }, true);
    if (data.code == 200) {
      this.node.getChildByName("out").active = true;
      this.node.getChildByName("in").active = false;
      let list = data.data.records;
      if (!list || list.length == 0) {
        this.node.getChildByName("out").getChildByName("cm_nodata").active = true;
      } else {
        this.node.getChildByName("out").getChildByName("cm_nodata").active = false;
      }
      let sum = data.data.summary;
      if (sum) {
        let item = instantiate(this.AT_YejiItem2);
        item.setPosition(v3(0, 0));
        item.active = true;
        item[`idx`] = 0;
        item.getChildByName("time").getComponent(Label).string = "合计";
        item.getChildByName("qpmoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectPvp, 0);
        item.getChildByName("cpmoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectLott, 0);
        item.getChildByName("bymoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectFish, 0);
        item.getChildByName("dzmoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectRng, 0);
        item.getChildByName("zrmoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectLive, 0);
        item.getChildByName("tymoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectSport, 0);
        item.getChildByName("djmoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectEsport, 0);
        item.getChildByName("rmmoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectJinshu, 0);
        item.getChildByName("allmoney").getComponent(Label).string = GoldUtils.formatGold(sum.effectTotal, 0);
        // item.getChildByName("yjcx_an_001").active = false;
        item.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
        this.AT_yejiSc.getComponent(ScrollView).content.addChild(item);
      }
      for (let i = 0; i < list.length; i++) {
        let v = instantiate(this.AT_YejiItem2);
        v[`info`] = list[i];
        v[`idx`] = i + 1;
        v.setPosition(v3(0, 0));
        v.active = true;
        v.getChildByName("time").getComponent(Label).string = list[i].dayStr;
        v.getChildByName("qpmoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectPvp, 0);
        v.getChildByName("cpmoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectLott, 0);
        v.getChildByName("bymoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectFish, 0);
        v.getChildByName("dzmoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectRng, 0);
        v.getChildByName("zrmoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectLive, 0);
        v.getChildByName("tymoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectSport, 0);
        v.getChildByName("rmmoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectJinshu, 0);
        v.getChildByName("djmoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectEsport, 0);
        v.getChildByName("allmoney").getComponent(Label).string = GoldUtils.formatGold(list[i].effectTotal, 0);
        if (i % 2 == 0) {
          v.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
        } else {
          v.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
        }
        this.AT_yejiSc.getComponent(ScrollView).content.addChild(v);
        v.getComponent(GridItemAni).startAnimation(i);
      }
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }


  getrewardType(type) {
    if (type == 1) {
      return "业绩"
    } else if (type == 2) {
      return "分红"
    }
  }
}