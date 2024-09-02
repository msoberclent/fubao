

import { _decorator, Component, Node, Enum, Sprite, Button, SpriteFrame, ImageAsset, find, assetManager, resources, JsonAsset, Label } from 'cc';
import { EDITOR } from 'cc/env';
import LanguageManager from './LanguageManager';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('i18NLabel')
export class I18NLabel extends Component {

    @property
    langId: number = -1;

    private setText() {
        let textJson = LanguageManager.editor_excel[this.langId];
        if (!textJson) {
            this.getComponent(Label).string = "NotFound";
        } else {
            this.getComponent(Label).string = textJson[LanguageManager.editor_language];
        }
    }

    public onLoad() {
        this.setText();
        // Global.EVENT.on(BaseEvent.CHANGE_LANGUAGE, this.changeLanguage, this);
    }

    public onDestroy() {
        // Global.EVENT.on(BaseEvent.CHANGE_LANGUAGE, this.changeLanguage, this);
    }

    onFocusInEditor() {
        if (CC_EDITOR && this.langId > 0) {
            let textJson = LanguageManager.editor_excel[this.langId];
            if (!textJson) {
                this.getComponent(Label).string = "NotFound";
            } else {
                this.getComponent(Label).string = textJson[LanguageManager.editor_language];
            }

        }
    }

    onLostFocusInEditor() {
        if (CC_EDITOR && this.langId > 0) {
            let textJson = LanguageManager.editor_excel[this.langId];
            if (!textJson) {
                this.getComponent(Label).string = "NotFound";
            } else {
                this.getComponent(Label).string = textJson[LanguageManager.editor_language];
            }
        }
    }
}

