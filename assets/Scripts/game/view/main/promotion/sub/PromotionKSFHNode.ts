
import { EditBox, Label, Node, Widget, _decorator, instantiate, v3 } from 'cc';
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { GridItemAni } from '../../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni';
import List from '../../../../../../Piter.Framework/UIKit/Component/list/List';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
import { GamePlayerManager } from '../../../../manager/GamePlayerManager';
import { ScrollToLeftInPanel } from '../../../panel/ScrollToLeftInPanel';
import { KSFHFenHongItem } from '../item/KSFHFenHongItem';
import { KSFHZhiShuItem } from '../item/KSFHZhiShuItem';
const { ccclass, property } = _decorator;
/**
 * 亏损分红
 */
@ccclass('PromotionKSFHNode')
export class PromotionKSFHNode extends ScrollToLeftInPanel {

  protected static prefabUrl = "promotion/prefabs/fenhong/PromotionKSFHPanel";

  protected static className = "PromotionKSFHNode";

  @property(Node)
  AT_zhuangshuLayout: Node;

  @property(Node)
  AT_zhuangshuItem: Node;

  @property(EditBox)
  AT_inputzsId: EditBox;

  @property(Node)
  AT_NoRecord: Node;

  @property(Node)
  AT_page: Node;

  @property(Node)
  info: Node;

  @property(Node)
  gailan: Node;

  @property(Node)
  mine: Node;

  @property(Node)
  AT_NoRecord2: Node;



  kszhishuTotalPage = 1;
  kszhishuCurPage = 1;
  yejicurPage = 1;
  yejiTotalPage = 1;
  createChildren() {
    super.createChildren();
    this.initUI();
  }

  public async initUI() {
    this.onPageSwitchClick(null, "0");
  }


  /**
     * 直属上一页
     */
  AT_zhuanshuLast1BtnTouch() {
    this.kszhishuCurPage -= 1;
    if (this.kszhishuCurPage <= 0) {
      this.kszhishuCurPage += 1;
      return
    };
    this.requestKuiSunZS(this.kszhishuCurPage);
  }

  /**
   * 直属下一页
   */
  AT_zhuanshuNext1BtnTouch() {
    this.kszhishuCurPage += 1;
    if (this.kszhishuCurPage > this.kszhishuTotalPage) {
      this.kszhishuCurPage -= 1;
      return
    };
    this.requestKuiSunZS(this.kszhishuCurPage);
  }

  public onAdded() {
    super.onAdded();
    this.AT_zhuangshuItem.active = false;
    Global.EVENT.on("FLUSH_KUISUN_BAODI", this.openInfoUI, this);
  }

  public onRemoved() {
    super.onRemoved();
    Global.EVENT.off("FLUSH_KUISUN_BAODI", this.openInfoUI, this);
  }

  //亏损直属
  /**
   *
   *
   * @param {number} [page=0]
   */
  async requestKuiSunZS(page = 1, type = 0, time = null) {
    this.AT_zhuangshuLayout.destroyAllChildren();
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/kuishun-direct", { type: type, dateStr: time, page: page, pageLength: 10 });
    if (data.code == 200) {
      this.kszhishuCurPage = data.data.page;
      this.kszhishuTotalPage = data.data.totalPage;
      let list = data.data.list;
      if (!list || list.length == 0) {
        this.AT_NoRecord.active = true;
      } else {
        this.AT_NoRecord.active = false;
      }
      this.AT_page.getComponent(Label).string = (data.data.page) + "/" + (data.data.totalPage);

      for (let i = 0; i < list.length; i++) {
        let v = instantiate(this.AT_zhuangshuItem);
        let item = v.getComponent(KSFHZhiShuItem);
        let info = { fanyongbi: data.data.fanyongbi, fanyongbiVal: data.data.kuishunFanyongbiValue, from: "dividend", hisfanyong: 0, id: 0, fatherid: GamePlayerManager.instance.player.simpleUser.id };
        info.hisfanyong = list[i].baesFanyong;
        info.id = list[i].nick;
        info.fatherid = list[i].uid;
        item.info = info;
        v.active = true;
        if (list[i].uid == GamePlayerManager.instance.player.simpleUser.uid) {
          if (data.data.isSwitch == "1") {
            v.active = true;
          } else {
            v.active = false;
          }
          info.fanyongbi = false;
        }
        v.setPosition(v3(0, 0))
        item.setItemData(list[i], i);
        this.AT_zhuangshuLayout.addChild(v)
        v.getComponent(GridItemAni).startAnimation(i);
      }
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }

  //
  async AT_serchByIdBtnTouch() {
    let id = Number(this.AT_inputzsId.string);
    if (!id) {
      return;
    }
    this.AT_zhuangshuLayout.destroyAllChildren();
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/kuishun-direct", { subid: id, page: 1, pageLength: 10 });
    if (data.code == 200) {
      this.kszhishuCurPage = data.data.page;
      this.kszhishuTotalPage = data.data.totalPage;
      this.AT_page.getComponent(Label).string = (data.data.page) + "/" + (data.data.totalPage);
      let list = data.data.list;
      if (!list || list.length == 0) {
        this.AT_NoRecord.active = true;
      } else {
        this.AT_NoRecord.active = false;
      }

      for (let i = 0; i < list.length; i++) {
        let v = instantiate(this.AT_zhuangshuItem);
        let item = v.getComponent(KSFHZhiShuItem);
        let info = { fanyongbi: data.data.kuishunFanyongbi, fanyongbiVal: data.data.kuishunFanyongbiValue, from: "dividend", hisfanyong: 0, id: 0, fatherid: GamePlayerManager.instance.player.simpleUser.id };
        info.hisfanyong = list[i].baesFanyong;
        info.id = list[i].nick;
        //下属id
        info.fatherid = list[i].uid;
        item.info = info;
        v.active = true;
        if (list[i].uid == GamePlayerManager.instance.player.simpleUser.uid) {
          if (data.data.isSwitch == "1") {
            v.active = true;
          } else {
            v.active = false;
          }
          info.fanyongbi = false;
        }
        v.setPosition(v3(0, 0))
        item.setItemData(list[i], i);
        this.AT_zhuangshuLayout.addChild(v)
        v.getComponent(GridItemAni).startAnimation(i);
      }
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }

  onPageSwitchClick(e, custom) {
    switch (custom) {
      case "0":
        this.openGailanUI();
        break;
      case "1":
        this.openInfoUI();
        this.info.getChildByName("member").active = true;
        this.info.getChildByName("AT_zhishu1SC").getComponent(Widget).top = 350;
        this.info.getChildByName("page").active = true;
        break;
      case "2":
        this.openMineUI();
        break;
    }
  }

  gailanRespData = null;

  async openGailanUI() {
    this.gailan.active = true;
    this.info.active = false;
    this.mine.active = false;
    if (!this.gailanRespData) {
      let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/kuishun-reward-data", {}, true);
      this.gailanRespData = resp.data;
    }
    this.showGailanUI();
  }

  kuisunDirList = [];
  mineRespData = null;
  async openMineUI() {
    this.info.active = false;
    this.gailan.active = false;
    this.mine.active = true;
    if (!this.mineRespData) {
      let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/kuishun-my-reward", { page: 1, pageLength: 20 }, true);
      this.mineRespData = resp;
    }
    this.showMineUI();
  }

  showMineUI() {
    if (this.mineRespData.code == 200) {
      this.kuisunDirList = this.mineRespData.data.list;
      if (this.kuisunDirList.length == 0) this.AT_NoRecord2.active = true;
      this.mine.getChildByName("sc").getComponent(List).numItems = this.kuisunDirList.length;
    } else {
      DefaultToast.instance.showText(this.mineRespData.msg);
    }
  }

  showGailanUI() {
    let labels = [
      { name: "rechargeTeam", label: "contentNode/gailan/member-001/tdcz", desc: "团队存款", divGold: true },
      { name: "withdrawTeam", label: "contentNode/gailan/member-001/tdtx", desc: "团队提款", divGold: true },
      { name: "diffTeam", label: "contentNode/gailan/member-001/tdctc", desc: "团队提-存", divGold: true },

      { name: "rechargeOne", label: "contentNode/gailan/member-001/zscz", desc: "直属存款", divGold: true },
      { name: "withdrawOne", label: "contentNode/gailan/member-001/zstx", desc: "直属提款", divGold: true },
      { name: "diffOne", label: "contentNode/gailan/member-001/zsctc", desc: "直属提-存", divGold: true },
      // { name: "rate", label: "contentNode/gailan/member-001/fhbl", desc: "比例", divGold: false },
      { name: "thisDirectStock", label: "contentNode/gailan/member-001/zskc", desc: "直属库存", divGold: true },
      { name: "thisTeamStock", label: "contentNode/gailan/member-001/tdkc", desc: "团队库存", divGold: true },

      { name: "jiChaReward", label: "contentNode/gailan/member/bqls", desc: "本期领取流水佣金", divGold: true },
      { name: "currReward", label: "contentNode/gailan/member/bqyg", desc: "本期预估佣金", divGold: true },

      // { name: "formula", label: "contentNode/gailan/member/bqyg", desc: "本期预估佣金", divGold: false },
    ];
    for (let i = 0; i < labels.length; i++) {
      let item = labels[i];
      let node = this.node.getChildByPath(item.label);
      if (item.name) {
        if (item.divGold) {
          node.getComponent(Label).string = GoldUtils.formatGold(this.gailanRespData[item.name]);
        } else {
          node.getComponent(Label).string = this.gailanRespData[item.name]
        }
      }
    }
    this.node.getChildByPath("contentNode/gailan/member-001/fhbl").getComponent(Label).string = Number(new Big(this.gailanRespData.rate).mul(100)) + "%";
    this.node.getChildByPath("contentNode/gailan/common_select_dot-001/ruler").getComponent(Label).string = this.gailanRespData.formula;
    this.node.getChildByPath("contentNode/gailan/member-001/id").getComponent(Label).string = GamePlayerManager.instance.player.simpleUser.uid;
  }

  openInfoUI(type = 0, time = null) {
    this.info.active = true;
    this.gailan.active = false;
    this.mine.active = false;
    this.requestKuiSunZS(1, type, time);
  }

  onListRender(item: Node, idx) {
    let data = this.kuisunDirList[idx];
    item.getComponent(KSFHFenHongItem).setItemData(data, idx);
    item.getComponent(KSFHFenHongItem).setRoot(this);
  }

  // /**
  //   * 业绩上一页
  //   */
  // AT_yejiLastBtnTouch() {
  //   this.yejicurPage -= 1;
  //   if (this.yejicurPage <= 0) {
  //     this.yejicurPage += 1;
  //     return
  //   };
  //   this.requestKuiSunFH(this.yejicurPage);
  // }

  // /**
  //  * 业绩下一页
  //  */
  // AT_yejiNextBtnTouch() {
  //   this.yejicurPage += 1;
  //   if (this.yejicurPage > this.yejiTotalPage) {
  //     this.yejicurPage -= 1;
  //     return
  //   };
  //   this.requestKuiSunFH(this.yejicurPage);
  // }


  // //亏损业绩
  // async requestKuiSunFH(page = 1) {
  //   this.AT_yejiLayout.destroyAllChildren();
  //   let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/kuishun-my-reward", { page: page, pageLength: 10 });
  //   if (data.code == 200) {
  //     this.yejicurPage = data.data.page;
  //     this.yejiTotalPage = data.data.totalPage;
  //     this.AT_page.getComponent(Label).string = (data.data.page) + "/" + (data.data.totalPage);
  //     let list = data.data.list;
  //     if (!list || list.length == 0) {
  //       this.AT_NoRecord.active = true;
  //     } else {
  //       this.AT_NoRecord.active = false;
  //     }
  //     for (let i = 0; i < list.length; i++) {
  //       let v = instantiate(this.AT_yejiItem);
  //       let item = v.getComponent(KSFHFenHongItem);
  //       v.active = true;
  //       v.setPosition(v3(0, 0));
  //       item.itemId = list[i].idStr;
  //       item.setItemData(list[i], i);
  //       this.AT_yejiLayout.addChild(v)
  //       v.getComponent(GridItemAni).startAnimation(i);
  //     }
  //   } else {
  //     DefaultToast.instance.showText(data.msg);
  //   }
  // }

  // /**
  //  * 收益详情
  //  * @param {*} e
  //  * @param {*} custom
  //  */
  // onKuisunYjDetaiClick(e, custom) {
  //   let node = e.target.parent;
  //   let index = node[`itemId`];
  //   if (index != `null`) {
  //     Global.UI.openView(PromotionKuisunProfitPanel, { index: index });
  //   } else {
  //     this.node.getChildByName("left").getChildByName("pageItem1").getComponent(Toggle).isChecked = true;
  //     this.onKuiSunSwitchClick(null, "0");
  //   }
  // }

  // onKuiSunSwitchClick(e, custom) {
  //   switch (custom) {
  //     case "0":
  //       this.AT_contentzhishu.active = true;
  //       this.AT_contentyeji.active = false;
  //       this.AT_fenhongRule.active = false
  //       this.requestKuiSunZS();
  //       break;
  //     case "1":
  //       this.AT_contentzhishu.active = false;
  //       this.AT_contentyeji.active = true;
  //       this.AT_fenhongRule.active = false
  //       this.requestKuiSunFH();
  //       break;
  //     case "3":
  //       this.AT_contentzhishu.active = false;
  //       this.AT_contentyeji.active = false;
  //       this.AT_fenhongRule.active = true
  //       break;
  //   }
  // }

  public async AT_gerRewardJLBtnTouch() {
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/gain-reward", { rewardType: 3 });
    if (data.code == 200) {
      DefaultToast.instance.showText("领取成功,请注意查收");
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }

  AT_closeBtnTouch() {
    Global.UI.closeView(PromotionKSFHNode)
  }
}