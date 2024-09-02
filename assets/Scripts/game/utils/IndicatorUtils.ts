import { PageView, PageViewIndicator, Sprite, SpriteFrame, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass('IndicatorUtils')
export class IndicatorUtils extends PageViewIndicator {
    @property(SpriteFrame)
    selectSprite: SpriteFrame = null;
    @property(SpriteFrame)
    unSelectSprite: SpriteFrame = null;
    _pageview: PageView;
    _changedState() {
        let indicators = this.node.children;
        if (indicators.length <= 0) return;
        let idx = this._pageView.getCurrentPageIndex();

        for (var i = 0; i < indicators.length; ++i) {

            var node = indicators[i];
    
            node.getComponent(Sprite).spriteFrame = this.unSelectSprite;
    
        }

        indicators[idx].getComponent(Sprite).spriteFrame = this.selectSprite;
    }
}