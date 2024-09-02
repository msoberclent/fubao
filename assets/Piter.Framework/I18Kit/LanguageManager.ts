
import { Component, Label, _decorator } from 'cc';
import { config_game_language } from '../../Scripts/config/config_game_language';
import { BaseEvent } from '../BaseKit/Constant/BaseEvent';
import Global from '../PiterGlobal';
const { ccclass, property } = _decorator;

export enum LanguageItem {
    ZH_CN = "zh-CN",
    EN_US = "en-US"
}

@ccclass('LanguageManager')
export default class LanguageManager extends Component {

    public curLang: string = LanguageItem.ZH_CN;

    public excel_lang: string = LanguageItem.ZH_CN

    public langConfig: any;

    public groups: any = {};

    /**
     * 开发语言 无需改变
     */
    public developLang: string = LanguageItem.ZH_CN;

    /**
     * 无需改变
     */
    static editor_language = LanguageItem.ZH_CN;

    static editor_excel = config_game_language;

    start() {
        Global.LANG = this;
    }

    /**
     * 设置语言
     */
    public setLangConfig(langConfig) {
        this.langConfig = langConfig;
    }

    /**
     * 支持的语言
     */
    public usingLang: string[] = [
        LanguageItem.ZH_CN,
        LanguageItem.EN_US
    ]

    public init(lan?: LanguageItem) {
        this.setLanguage(lan);
    }

    public setLanguage(language: LanguageItem) {
        if (!language) {
            this.curLang = LanguageItem.ZH_CN;
        } else {
            this.curLang = language;
        }
        this.excel_lang = language
    }

    public getLang(id): string {
        if (!this.langConfig) {
            return "";
        }
        let language = this.langConfig[id];
        if (!language) {
            return "load-" + id + "-fail";
        }
        let text = language[this.excel_lang];
        return this.replaceEnterWithNewline(text);
    }

    private replaceEnterWithNewline(inputString) {
        return inputString.replace(/\${enter}/g, '\n');
    }

    /**
     * jsonData = {
     * 	 "1": text1,
     * 	 "2": text2,
     *   "3": text3
     * }
     * 给数据设置最大支持3
     */
    public getLangByJson(id, jsonData) {
        let sureText = this.getLang(id) as string;
        if (!jsonData) {
            return sureText;
        }
        for (let i = 1; i <= 3; i++) {
            let data = jsonData[i];
            if (!data) {
                return sureText;
            }
            sureText = sureText.replace("${" + i + "}", data);
        }
        return sureText;
    }

    /**
     * 写法为 lang:11, lang:为固定 11为文本ID
     * @param label 
     * @returns 
     */
    public changeLabelLang(label: Label) {
        if (label['textId']) {
            label.string = this.getLang(label['textId']);
            return;
        }
        let labelStr = label.string;
        if (labelStr && labelStr.indexOf("lang:") > -1) {
            let str = labelStr.split("lang:");
            let id = str[1];
            label['textId'] = id;
            label.string = this.getLang(id);
        }
    }

    public resetLabels(labels: Label[]) {
        for (let i = 0; i < labels.length; i++) {
            this.changeLabelLang(labels[i]);
        }
    }

    public changeLanguage(language: LanguageItem) {
        if (this.curLang == language) {
            return;
        }
        this.setLanguage(language);
        Global.EVENT.dispatchEvent(BaseEvent.CHANGE_LANGUAGE);
    }
}
