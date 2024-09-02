import { Component, Label, _decorator } from "cc";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../Piter.Framework/UIKit/Example/DefaultToast";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * 分页组件
 */
@ccclass('PageTools')
export class PageTools extends Component {

  url: string;

  page: number = 1;

  pageLength: number = 6

  lockReq: boolean = false;

  totalPage: number;

  totalSize: number;

  @property(Label)
  pageLabel: Label = null;

  root: any;
  //1 this.req 2 this.root.req
  model: number = 1;

  callFuncName: string = `onPageData`;

  reqDataFuncName: string = `getReqData`;
  onLoad() {
    // this.pageLabel.string = "";
  }

  setCallFuncName(funcName = `onPageData`, reqDataFuncName = `getReqData`) {
    this.callFuncName = funcName;
    this.reqDataFuncName = reqDataFuncName;
  }

  public setPageData(root: any, url, page = 1, pageLength = 6, firstReq: boolean = true) {
    this.url = url;
    this.page = page;
    this.pageLength = pageLength
    this.root = root;
    if (firstReq) {
      this.getPageData()
    }
  }

  /**
   * 首页
   */
  public firstLabelTouch() {
    if (this.page != 1) {
      this.page = 1
      this.getPageData();
    }
  }


  /**
  * 上一页
  */
  public preLabelTouch() {
    if (this.page > 1) {
      this.page--;
      this.getPageData();
    }
  }

  /**
  * 下一页
  */
  public nextLabelTouch() {
    if (this.totalPage && this.page < this.totalPage) {
      this.page++;
      this.getPageData();
    }
  }

  /**
   * 末页
   */
  public lastLabelTouch() {
    if (this.totalPage && this.page != this.totalPage) {
      this.page = this.totalPage;
      this.getPageData();
    }
  }

  public async getPageBySelfData(reqData) {
    if (!reqData) {
      return;
    }
    if (this.lockReq) {
      return;
    }
    this.lockReq = true;
    if (!reqData.page) {
      reqData.page = this.page;
    }
    if (!reqData.pageLength) {
      reqData.pageLength = this.pageLength;
    }
    let resp = await Global.HTTP.sendRequestAsync(this.url, reqData, true);
    if (resp.code == 200) {
      this.page = reqData.page;
      this.updatePageUI(resp.data);
      if (this.root[this.callFuncName]) {
        this.root[this.callFuncName](resp.data)
      }
    }else{
      DefaultToast.instance.showText(resp.msg);
    }
    this.lockReq = false;
  }


  public async getPageData() {
    if (this.staticModel) {
      this.getPageByStaticData()
      return;
    }

    if (this.model == 2) {
      this.getPageBySelfData(this.root[this.reqDataFuncName](this.page, this.pageLength));
      return
    }
    if (this.lockReq) {
      return;
    }
    this.lockReq = true;
    let reqData = {
      page: this.page,
      pageLength: this.pageLength
    }
    let resp = await Global.HTTP.sendRequestAsync(this.url, reqData, true);
    if (resp.code == 200) {
      this.updatePageUI(resp.data);
      if (this.root[this.callFuncName]) {
        this.root[this.callFuncName](resp.data)
      }
    }else{
      DefaultToast.instance.showText(resp.msg);
    }
    this.lockReq = false;
  }

  public updatePageUI(data) {
    this.totalSize = data.totalSize;
    this.totalPage = data.totalPage;
    if (this.totalPage < 1) {
      this.pageLabel.string = `1 / 1`
    } else {
      this.pageLabel.string = `${this.page} / ${this.totalPage}`
    }
  }

  //静态模式
  staticModel: boolean = false;

  pageList: any[];

  public setStaticPageData(root: any, pageList: any[], page = 1, pageLength = 6) {
    this.staticModel = true;
    this.page = page;
    this.pageLength = pageLength
    this.root = root;
    this.pageList = pageList;
    this.totalPage = Math.ceil(pageList.length / pageLength);
    this.totalSize = pageList.length;
    this.getPageByStaticData();
  }

  private getPageByStaticData() {
    let start = (this.page - 1) * this.pageLength;
    let end = (this.page) * this.pageLength;
    let pageData = this.pageList.slice(start, end);
    this.totalSize = this.totalSize;
    this.totalPage = this.totalPage;
    // this.pageLength = data.pageLength;
    if (this.totalPage < 1) {
      this.pageLabel.string = `1 / 1`
    } else {
      this.pageLabel.string = `${this.page} / ${this.totalPage}`
    }
    if (this.root[this.callFuncName]) {
      this.root[this.callFuncName](pageData)
    }
  }


}