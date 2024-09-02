
import { Button, Component, Enum, Sprite, SpriteFrame, _decorator } from 'cc';
import { BaseEvent } from '../BaseKit/Constant/BaseEvent';
import Global from '../PiterGlobal';
import { LanguageItem } from './LanguageManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = I18NComp
 * DateTime = Wed Nov 10 2021 18:15:59 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * 多语言组件
 */

export enum I18NType {
    IMAGE = 0,
    SKELETON = 1,
    BUTTON
}
Enum(I18NType);


@ccclass('I18NComponent')
export class I18NComponent extends Component {
    @property({ type: I18NType, serializable: true, displayName: "使用类型" })
    public i18nType: I18NType = I18NType.IMAGE;

    private currentIsActive: boolean;

    public onLoad() {
        this.changeLanguage();
        Global.EVENT.on(BaseEvent.CHANGE_LANGUAGE, this.changeLanguage, this);
    }

    public onDestroy() {
        Global.EVENT.off(BaseEvent.CHANGE_LANGUAGE, this.changeLanguage, this);
    }

    public async changeLanguage() {
        this.currentIsActive = this.node.active;
        if (this.currentIsActive) {
            this.node.active = false;
        }
        if (this.i18nType == I18NType.IMAGE) {
            let sprite = this.node.getComponent(Sprite);
            this.changeSprite2Lang(sprite);
        } else if (this.i18nType == I18NType.BUTTON) {
            let buttonComp = this.node.getComponent(Button);
            this.changeSpriteFrame2Lang(buttonComp)
        } else if (this.i18nType == I18NType.SKELETON) {
            // let spineComp = this.node.getComponent(sp.Skeleton);
            // this.changeSpineAnimation(spineComp);
            // this.node.active = this.currentIsActive;
        }
    }

    private strIsLanuageItem(str: string) {
        for (let key in LanguageItem) {
            if (str == LanguageItem[key]) {
                return true
            }
        }
        return false;
    }

    /**
     * 改变spine animation
     * @param spineComp 
     */
    public changeSpineAnimation(spineComp: any) {
        if (spineComp.skeletonData) {
            let changeStr: string;
            let uuid = spineComp.skeletonData.uuid;
            let assets = Global.RES.findAssetInfoByUUID(uuid);
            if (assets.path.indexOf(Global.LANG.curLang) > -1) {
                return;
            }
            let pathArr = assets.path.split("/")
            let searchIndex = 0;
            for (let i = 0; i < pathArr.length; i++) {
                if (this.strIsLanuageItem(pathArr[i])) {
                    searchIndex = i;
                    break;
                }
            }
            changeStr = assets.path.replace(pathArr[searchIndex], Global.LANG.curLang);
            if (changeStr && Global.RES.checkHasRES(changeStr)) {
                let loop = spineComp.loop;
                let animationName = spineComp.animation;
                // Global.RES.loadAsset(changeStr, sp.SkeletonData, (skeletonData: sp.SkeletonData) => {
                //     if (skeletonData) {
                //         spineComp.skeletonData = skeletonData;
                //         if (animationName) {
                //             spineComp.setAnimation(0, animationName, loop);
                //         }
                //     }
                // });
            }
        }
    }

    private replaceSpriteFramePath(spriteFrame: SpriteFrame) {
        let uuid = spriteFrame.uuid;
        let assets = Global.RES.findAssetInfoByUUID(uuid);
        let pathArr = assets.path.split("/")
        if (assets.path.indexOf(Global.LANG.curLang) > -1) {
            return;
        }
        let searchIndex = 0;
        for (let i = 0; i < pathArr.length; i++) {
            if (this.strIsLanuageItem(pathArr[i])) {
                searchIndex = i;
                break;
            }
        }
        let changeStr = assets.path.replace(pathArr[searchIndex], Global.LANG.curLang);
        return changeStr
    }

    private async changeSprite2Lang(sprite: Sprite) {
        if (sprite && sprite.spriteFrame?.name) {
            let changeStr = this.replaceSpriteFramePath(sprite.spriteFrame)
            if (changeStr && Global.RES.checkHasRES(changeStr)) {
                sprite.spriteFrame = null;
                Global.RES.loadAsset(changeStr, SpriteFrame, (spriteFrame) => {
                    sprite.spriteFrame = spriteFrame;
                    if (this.currentIsActive) {
                        this.node.active = true
                    };
                });
            } else {
                if (this.currentIsActive) {
                    this.node.active = true
                };
            }
        }
    }

    private async changeSpriteFrame2Lang(button: Button) {
        if (button.normalSprite) {
            let changeStr1 = this.replaceSpriteFramePath(button.normalSprite)
            if (changeStr1 && Global.RES.checkHasRES(changeStr1)) {
                Global.RES.loadAsset(changeStr1, SpriteFrame, (spriteFrame) => {
                    button.normalSprite = spriteFrame;
                    if (this.currentIsActive) {
                        this.node.active = true
                    };
                });
            } else {
                if (this.currentIsActive) {
                    this.node.active = true
                };
            }
        }
        if (button.disabledSprite) {
            let changeStr1 = this.replaceSpriteFramePath(button.disabledSprite)
            if (changeStr1 && Global.RES.checkHasRES(changeStr1)) {
                Global.RES.loadAsset(changeStr1, SpriteFrame, (spriteFrame) => {
                    button.disabledSprite = spriteFrame;
                    if (this.currentIsActive) {
                        this.node.active = true
                    };
                });
            } else {
                if (this.currentIsActive) {
                    this.node.active = true
                };
            }
        }
    }


    onFocusInEditor() {
        if (CC_EDITOR) {
        }
    }

    onLostFocusInEditor() {
        if (CC_EDITOR) {
        }
    }
}
