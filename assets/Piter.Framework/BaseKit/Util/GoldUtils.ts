import { LanguageItem } from "../../I18Kit/LanguageManager";
import Global from "../../PiterGlobal";

export class GoldUtils {

    /**
     * 货币比例
     */
    public static GOLD_RATE: number = 0.01;

    public static GOLD_RATE_MUL: number = 100;

    public static toServerGold(gold) {
        return Number(new Big(gold).mul(new Big(this.GOLD_RATE_MUL)).round(2, 0));
    }

    public static toFixed(gold, fixedNumber) {
        return Number(new Big(gold).round(fixedNumber, 0));
    }

    /**
     * 
     * @param gold 转换为国际货币
     */
    public static getGold2National(gold: number, fixedNumber: number = 2) {
        return Number(new Big(gold).mul(new Big(this.GOLD_RATE)).round(fixedNumber, 0));
    }


    public static muiltRate(gold) {
        return Number(new Big(gold).mul(new Big(this.GOLD_RATE)));
    }

    /**
     * @param gold 返回逗号间隔
     * @returns 
     */
    public static nationalGold(gold: number, fixedNumber) {
        return this.getGold2National(gold).toFixed(fixedNumber).toLocaleString();
    }

    public static showScrollGold(gold: number, fixedNumber) {
        return this.getGold2National(gold, fixedNumber).toLocaleString();
    }

    public static formatGold(gold: number, fixedNumber = 2): string {
        if (gold == null) {
            return "";
        }
        let str: string;
        switch (Global.LANG.curLang) {
            case LanguageItem.ZH_CN:
                str = this.nationalGold(gold, fixedNumber); break
            default:
                str = this.kmgtGold(gold); break;
        }
        // if (str.endsWith(".00")) {
        //     str = str.slice(0, -3);
        // }
        return str;
    }

    public static formartGoldBy3(number, replace00 = true) {
        if (typeof number !== 'number') {
            return "";
        }
        const formattedNumber = number.toFixed(2); // 保留两位小数
        const parts = formattedNumber.toString().split("."); // 将整数和小数部分分开
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 添加逗号分隔
        let data = parts.join(".");
        if (replace00) {
            return data.replace(".00", "");
        } else {
            return data;
        }

    }

    /**
     * 转换为 中国货币
     * @param gold 
     */
    public static chineseGold(gold: number): string {
        gold = Number(new Big(gold).round(2, 0));
        if (gold < 10000) {
            return gold + "";
        }
        let baiWan = Math.floor(gold / 10000);
        let bai = Math.floor((gold % 10000) / 100);
        let baiStr = bai + "";
        if (bai < 10) {
            baiStr = "0" + baiStr;
        }
        let str = baiWan + "." + baiStr + "万";
        return str;
    }

    /**
     * 
     * @param gold 转换为KMGT格式
     * @returns 
     */
    public static ktGold(gold: number): string {
        const num = 1000.00; //byte
        if (gold < num)
            return new Big(gold).round(2, 0).toFixed(0) + ""
        else {
            return Number(new Big(gold / num).round(2, 0).toFixed(0)) + "k"; //kb
        }
    }


    /**
     * 
     * @param gold 转换为KMGT格式
     * @returns 
     */
    public static kmgtGold(gold: number): string {
        const num = 1000.00; //byte
        if (gold < num)
            return new Big(gold).round(2, 0) + ""
        if (gold < Math.pow(num, 2))
            return Number(new Big(gold / num).round(2, 0)) + "K"; //kb
        if (gold < Math.pow(num, 3))
            return Number(new Big(gold / Math.pow(num, 2)).round(2, 0)) + "M"; //M
        if (gold < Math.pow(num, 4))
            return Number(new Big(gold / Math.pow(num, 3)).round(2, 0)) + "G"; //G
        return Number(new Big(gold / Math.pow(num, 4)).round(2, 0)) + "T"; //T
    }
}