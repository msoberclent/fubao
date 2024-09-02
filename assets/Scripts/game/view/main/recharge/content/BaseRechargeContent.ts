import { EditBox, Label, Node, instantiate, v3 } from "cc";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { ServerConfig } from "../../../../constant/ServerConst";
import { RechargeMethodItem } from "../../../../message/GameMessage";

export class BaseRechargeContent extends PiterUI {

  public method: RechargeMethodItem;

  public channelList;

  public rechargeActivityVo = null;

  activityType = null;

  selectHuodongId = null;
  @PiterDirector.AUTO_BIND(Node)
  AT_GoldEditBox: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_huodong: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_stateLbl: Node;

  lockReq: boolean = false;

  createChildren() {
    super.createChildren();
    this.AT_huodong.active = false;
  }
  public async onShowUI(method: RechargeMethodItem) {
    this.method = method;
    if (this.AT_GoldEditBox) {
      this.AT_GoldEditBox.getComponent(EditBox).enabled = true;
    }
    this.setTips();
    await this.getActivityData();
    await this.getRechargeData();
  }

  public async getRechargeData() {
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge/channel-list", {
      modeId: this.method.id
    }, true);

    if (resp.code == 200) {
      this.channelList = resp.data;
    }
  }

  public async getActivityData() {
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge/recharge-activity", {
    });

    if (resp.code == 200) {
      this.rechargeActivityVo = resp.data;
      // 
      this.activityType = resp.data.type;
    } else {

    }
  }

  setTips() {
    let tip1 = this.node.getChildByName("tips");
    let tip2 = this.node.getChildByName("tips2");
    if (this.method.remark) {
      tip1.active = tip2.active = true;
      tip2.getComponent(Label).string = this.method.remark;
    } else {
      tip1.active = tip2.active = false
    }
  }

  joinHd() {
    this.AT_huodong.active = true;
    this.selectHuodongId = null;
    this.AT_huodong.getChildByPath("lakai/sc/view/Node").destroyAllChildren();
    let v = instantiate(this.AT_huodong.getChildByName("item1"));
    v.getChildByName("label").getComponent(Label).string = "不参加活动";
    v[`data`] = { id: null, actName: "不参加活动" };
    v.setPosition(v3(0, 0));
    v.active = true;
    v.setParent(this.AT_huodong.getChildByPath("lakai/sc/view/Node"));
    if (!this.rechargeActivityVo || !this.rechargeActivityVo.list) {
      this.AT_huodong.active = false
      return
    }

    for (let i = 0; i < this.rechargeActivityVo.list.length; i++) {
      let v = instantiate(this.AT_huodong.getChildByName("item1"));
      v.getChildByName("label").getComponent(Label).string = this.rechargeActivityVo.list[i].actName;
      v[`data`] = this.rechargeActivityVo.list[i];
      v.setPosition(v3(0, 0));
      v.active = true;
      v.setParent(this.AT_huodong.getChildByPath("lakai/sc/view/Node"))
    }
  }

  huodongLakai() {
    this.AT_huodong.getChildByName("lakai").active = !this.AT_huodong.getChildByName("lakai").active;
    if (this.AT_huodong.getChildByName("lakai").active) {
      this.AT_huodong.getChildByName("wdsz_an_01").setScale(v3(1, -1))
    } else {
      this.AT_huodong.getChildByName("wdsz_an_01").setScale(v3(1, 1))
    }
  }

  huodongItemClick(e, custom) {
    let node = e.target;
    let activityVo = node[`data`];
    if (activityVo) {
      this.selectHuodongId = activityVo.id;
      this.AT_stateLbl.getComponent(Label).string = activityVo.actName;
      this.huodongLakai();
    }
  }
}