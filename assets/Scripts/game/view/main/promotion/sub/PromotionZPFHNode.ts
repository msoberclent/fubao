
import { Label, Node, ScrollView, Sprite, _decorator, instantiate, v3 } from 'cc';
import { PromotionFHRecordPanel } from '../PromotionFHRecordPanel';
import { PromotionBaseNode } from "./PromotionBaseNode";
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import ButtonUtils from '../../../../../../Piter.Framework/UIKit/Util/ButtonUtils';
import { ServerConfig } from '../../../../constant/ServerConst';
const { ccclass, property } = _decorator;
/**
 * 整盘分红
 */
@ccclass('PromotionZPFHNode')
export class PromotionZPFHNode extends PromotionBaseNode {

  @PiterDirector.AUTO_BIND(Node)
  private AT_fenhong_head_yestoday: Node;
  @PiterDirector.AUTO_BIND(Node)
  private AT_fenhong_head_today: Node;
  private fenhongType = 0;
  @PiterDirector.AUTO_BIND(Node)
  private AT_yestodayLQBtn: Node;

  @PiterDirector.AUTO_BIND(Node)
  private AT_chajiToday1: Node;
  @PiterDirector.AUTO_BIND(Node)
  private AT_chajiyestoday: Node;
  @PiterDirector.AUTO_BIND(Node)
  private AT_fenhongSc: Node;
  @PiterDirector.AUTO_BIND(Node)
  private AT_chajiToday2: Node

  @property(Node)
  mainBackground: Node = null;

  public async init() {
    this.requestFenhong();
  }

  /**
   *整盘分红
   */
  async requestFenhong() {
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/zhengpan-fenhong", { type: this.fenhongType });
    if (data.code == 200 && this.node.active) {
      let nodes = this.node.getChildByName("sc").getComponent(ScrollView).content;
      nodes.getChildByName("typesc").active = true;
      this.node.getChildByName("typeruler").active = false;
      this.node.getChildByName("typetip").active = false;
      if (this.fenhongType == 1) {
        this.AT_fenhong_head_today.active = false;
        this.AT_fenhong_head_yestoday.active = true;
        if (data.data.canReceive) {
          ButtonUtils.setGray(this.AT_yestodayLQBtn.getComponent(Sprite), false);
        } else {
          ButtonUtils.setGray(this.AT_yestodayLQBtn.getComponent(Sprite), true);
        }
        this.showCJdata(this.AT_chajiyestoday, data.data);
      } else {
        this.AT_fenhong_head_today.active = true;
        this.AT_fenhong_head_yestoday.active = false;
        this.showCJdata(this.AT_chajiToday1, data.data);
      }
      let list = data.data.directStocks;
      if (!list || list.length == 0) {
        nodes.getChildByName("typesc").getChildByName("cm_nodata").active = true;
      } else {
        nodes.getChildByName("typesc").getChildByName("cm_nodata").active = false;
      }
      this.AT_fenhongSc.getComponent(ScrollView).content.destroyAllChildren();
      for (let i = 0; i < list.length; i++) {
        let v = instantiate(this.AT_chajiToday2);
        v.setPosition(v3(0, 0));
        v.active = true;
        v.getChildByName("nick").getComponent(Label).string = list[i].nick;
        v.getChildByName("id").getComponent(Label).string = list[i].uid;
        v.getChildByName("yj").getComponent(Label).string = GoldUtils.formatGold(list[i].totalFlow);
        v.getChildByName("level").getComponent(Label).string = list[i].levelStr;
        v.getChildByName("mwgf").getComponent(Label).string = list[i].perTenThousandStock;
        v.getChildByName("zgf").getComponent(Label).string = list[i].totalStock;
        this.AT_fenhongSc.getComponent(ScrollView).content.addChild(v);
      }
      // }
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }

  showCJdata(node: Node, data) {
    node.getChildByName("zgf").getComponent(Label).string = data.platTatalStock;
    node.getChildByName("zfh").getComponent(Label).string = GoldUtils.formatGold(data.platDividend);
    node.getChildByName("szwl").getComponent(Label).string = GoldUtils.formatGold(data.unReceiveLastWeek);
    node.getChildByName("mgjz").getComponent(Label).string = GoldUtils.formatGold(data.perStockValue);
    node.getChildByName("wodegf").getComponent(Label).string = data.myStock;
    node.getChildByName("wodefh").getComponent(Label).string = GoldUtils.formatGold(data.myDividend);
    node.getChildByName("mwzg").getComponent(Label).string = data.perTenThousandStock;
    node.getChildByName("tdxj").getComponent(Label).string = data.teamLevelStr;
    node.getChildByName("tdyj").getComponent(Label).string = GoldUtils.formatGold(data.teamPerformance);
    node.getChildByName("wdgf").getComponent(Label).string = data.myStock2;
    node.getChildByName("xjgf").getComponent(Label).string = data.subStock;
    node.getChildByName("tdzgf").getComponent(Label).string = data.teamStock;
  }


  async requestFenhongRuler() {
    let nodes = this.node.getChildByName("sc").getComponent(ScrollView).content;
    nodes.getChildByName("typesc").active = false;
    this.node.getChildByName("typeruler").active = true;
    this.node.getChildByName("typetip").active = false;
    let data = await Global.HTTP.sendGetRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/query-fenhong-config", {});
    if (data.code == 200) {
      let list = data.data.configList;
      this.node.getChildByName("typeruler").getChildByName("zpfh_0030").getChildByName("rulersc").getComponent(ScrollView).content.destroyAllChildren();
      for (let i = 0; i < list.length; i++) {
        let v = instantiate(this.node.getChildByName("typeruler").getChildByName("zpfh_0030").getChildByName("rulerItem"));
        v.setParent(this.node.getChildByName("typeruler").getChildByName("zpfh_0030").getChildByName("rulersc").getComponent(ScrollView).content);
        v.setPosition(v3(0, 0));
        v.active = true;
        v.getChildByName("xj").getComponent(Label).string = list[i].lv;
        v.getChildByName("name").getComponent(Label).string = list[i].name;
        v.getChildByName("yj").getComponent(Label).string = list[i].flow;
        v.getChildByName("zg").getComponent(Label).string = list[i].bonus;
      }
    }
  }


  /**
     *
     *分红昨日type=1，今日type=0
     * @param {*} e
     * @param {*} custom
     */
  onBtnTodaySwitch(e, custom) {
    if (this.fenhongType == Number(custom)) return;
    this.mainBackground.active = false;
    this.node.getChildByName("sc").getComponent(ScrollView).enabled = true;
    if (custom == "0") {
      this.AT_fenhong_head_today.active = true;
      this.AT_fenhong_head_yestoday.active = false;
    } else if (custom == "1") {
      this.AT_fenhong_head_today.active = false;
      this.AT_fenhong_head_yestoday.active = true;
    } else if (custom) {
      this.mainBackground.active = true;
      this.AT_fenhong_head_today.active = false;
      this.AT_fenhong_head_yestoday.active = false;
      this.node.getChildByName("sc").getComponent(ScrollView).enabled = false;
    }
    this.fenhongType = Number(custom);
    if (this.fenhongType == 2) {
      let nodes = this.node.getChildByName("sc").getComponent(ScrollView).content;
      nodes.getChildByName("typesc").active = false;
      this.node.getChildByName("typeruler").active = true;
      this.node.getChildByName("typetip").active = false;
      this.requestFenhongRuler();
    } else if (this.fenhongType == 0 || this.fenhongType == 1) {
      let nodes = this.node.getChildByName("sc").getComponent(ScrollView).content;
      nodes.getChildByName("typesc").active = true;
      this.node.getChildByName("typeruler").active = false;
      this.node.getChildByName("typetip").active = false;
      this.requestFenhong();
    } else {
      let nodes = this.node.getChildByName("sc").getComponent(ScrollView).content;
      nodes.getChildByName("typesc").active = false;
      this.node.getChildByName("typeruler").active = false;
      this.node.getChildByName("typetip").active = true;
    }
  }

  onbtnFreshFenhong() {
    this.requestFenhong();
  }


  async shouyiBtnTouch(e, custom) {
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/gain-reward", { rewardType: Number(custom) });
    if (data.code == 200) {
      DefaultToast.instance.showText("领取成功,请注意查收", data.msg);
      // if (custom == 1) {
      //   this.requestMyTuiguang();
      // } else {
      //   this.requestMyShouyi(this.yjType);
      // }
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }

  /**
    * 分红记录
    * @return {*} 
    */
  async fenhongRecord() {
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/zhengpan-fenhong-log", {});
    if (data.code == 200) {
      let info = data.data;
      Global.UI.openView(PromotionFHRecordPanel, info)
    } else {
      return DefaultToast.instance.showText(data.msg);
    }
  }
}