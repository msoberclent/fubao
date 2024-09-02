import { sys } from "cc";
import { Utils } from "../../../Piter.Framework/BaseKit/Util/Utils";
import Global from "../../../Piter.Framework/PiterGlobal";
import { BundlesInfo } from "../../bundles";

/**
 * 资源组配置
 */
export const GameResConst = {
    preload: ["login"],
    login: [BundlesInfo.game_main],
    remoteBundlePath: "", //只含有大厅的需要填写
    init() {
        if (sys.isBrowser) {
            let subT = Utils.getURLQueryString("sub");
            if (subT) {
                GameResConst.remoteBundlePath = decodeURIComponent(subT);
            }
        }
    },
    fish_bylist: true
}


export const MainDirConst = {
    activity: "activity",
    back: "back",
    bank: "bank",
    common: "common",
    game_common: "game_common",
    hall: "hall",
    login: "login",
    prefabs: "prefabs",
    promotion: "promotion",
    rank: "rank",
    usercenter: "usercenter",
    mail: "mail",
    notice: "notice",
    secretbox: "secretbox",
    invite: "invite",
    vip: "vip"
}

export const ResBeforeStr = {
    POKER_CARD: "game_common",
    CHAT: "game_common"
}

export const ColorConst = {
    NORMAL: "#ff6a0e",
    GREEN: "#05b004",
    RED: "#ea4e3d",
    BLUE: "#ff7801",
    YELLOW: "#e99e11",
    PURPLE: "#c5c9f7"
}


export const SubGameStatus = {
    NORMAL: 0,
    NEW: 1,
    HOT: 2,
    CLOSE: 3,
    WATING: 4
}

/**
 * excel配置表
 */
export const GameExcelConst = {
    lanuage: "game_language",
    subGames: "slo_subgame",
    item: "slo_item"
}
/**
 * 常用的静态函数
 */
export class HeroStaticFunc {
    /**
     * 
     * @returns 获取一个加载可以看的提示语句
     */
    static getTipsContent() {
        let tipsIds = ['2001', '2002'];
        let id = tipsIds[Math.floor(_.random(0, tipsIds.length - 1))];
        return Global.LANG.getLang(id);
    }
}