import { Component, Label, Node, _decorator } from "cc";
import { Utils } from "../../../../Piter.Framework/BaseKit/Util/Utils";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { ImageUtils } from "../../../../Piter.Framework/UIKit/Util/ImageUtils";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * 分页组件
 */
@ccclass('CommonTabItem')
export class CommonTabItem extends Component {

  public tabItemData: any;

  no: Node;

  select: Node;

  onLoad(){
    this.no = this.node.getChildByPath("no")
    this.select = this.node.getChildByPath("select")
  }

  protected update(dt: number): void {
    if(this.select.active){
      if(this.no.active){
        this.no.active = false;
      }
    }else{
      if(!this.no.active){
        this.no.active = true;
      }
    }
  }

  public setText(text: string, shortLen?) {
    if (shortLen) {
      this.node.getChildByPath("no/tab1").getComponent(Label).string = Utils.getShortName(text, shortLen);
      this.node.getChildByPath("select/tab2").getComponent(Label).string = Utils.getShortName(text, shortLen);
    } else {
      this.node.getChildByPath("no/tab1").getComponent(Label).string = text;
      this.node.getChildByPath("select/tab2").getComponent(Label).string = text;
    }
  }

  public setTextId(id: number) {
    let text = Global.LANG.getLang(id);
    this.node.getChildByPath("no/tab1").getComponent(Label).string = text;
    this.node.getChildByPath("select/tab2").getComponent(Label).string = text;
  }

  public setImage(url1, url2) {
    ImageUtils.showNodeSprite(this.node.getChildByPath("no/tab1"), url1);
    ImageUtils.showNodeSprite(this.node.getChildByPath("select/tab2"), url2);
  }

}
