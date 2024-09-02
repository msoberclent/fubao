import { Component, Sprite, SpriteFrame, _decorator } from "cc";

/**
 * 
 */
const { ccclass, property } = _decorator;

@ccclass('ButtonSpriteChange')
export class ButtonSpriteChange extends Component {

    sprite: Sprite;

    @property({
        type: [SpriteFrame]
    })
    spriteFrames: SpriteFrame[] = [];

    @property
    defalutIndex: number = 0;

    onLoad(): void {
        this.sprite = this.node.getComponent(Sprite);
        if (this.defalutIndex) {
            let spriteFrame = this.spriteFrames[this.defalutIndex];
            if (spriteFrame) {
                this.sprite.spriteFrame = spriteFrame
            } else {
                this.sprite.spriteFrame = null;
            }
        }
    }

    public changeSpriteFrame(index) {
        this.defalutIndex = null;
        this.node.getComponent(Sprite).spriteFrame = this.spriteFrames[index]
    }

    onFocusInEditor() {
        if (CC_EDITOR) {
            this.sprite = this.node.getComponent(Sprite);
            let spriteFrame = this.spriteFrames[this.defalutIndex];
            if (spriteFrame) {
                this.sprite.spriteFrame = spriteFrame
            } else {
                this.sprite.spriteFrame = null;
            }
        }
    }

    onLostFocusInEditor() {
        if (CC_EDITOR) {
            this.sprite = this.node.getComponent(Sprite);
            let spriteFrame = this.spriteFrames[this.defalutIndex];
            if (spriteFrame) {
                this.sprite.spriteFrame = spriteFrame
            } else {
                this.sprite.spriteFrame = null;
            }
        }
    }
}