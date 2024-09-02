
import { _decorator } from 'cc';
import { PiterUI } from '../../../../../../Piter.Framework/UIKit/Base/PiterUI';
import { PromotionPanel } from '../PromotionPanel';
const { ccclass, property } = _decorator;
@ccclass
export class PromotionBaseNode extends PiterUI {

  isInited: boolean = false;

  responseData: any;

  root: PromotionPanel;

  public setRoot(root: PromotionPanel) {
    if (!this.root) {
      this.root = root;
    }
  }

  init() {

  }

}