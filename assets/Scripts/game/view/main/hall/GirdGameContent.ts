import { EditBox, Label, Node, ScrollView, Toggle, _decorator, instantiate } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { GameIconItem, SecondIconItem } from "../../../message/GameMessage";
import { GameEvent } from "../../../model/event/GameEvent";
import { MainSearchItem } from "./MainSearchItem";

const { ccclass, property } = _decorator;

@ccclass('GirdGameContent')
export class GirdGameContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_LeftContent: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_LeftItem: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_LeftList: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_Title: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_GameEdit: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_Tab: Node = null;

    config: any
    currentSelectCode: string;

    onListFlush() {
        if (this.currentIndex == "2") {
            this.AT_SearchBtnTouch();
        }
    }

    public onAdded() {
        super.onAdded();
        Global.EVENT.on(GameEvent.SEARCH_LIST_FLUSH, this.onListFlush, this)
    }

    public onRemoved() {
        super.onRemoved();
        Global.EVENT.off(GameEvent.SEARCH_LIST_FLUSH, this.onListFlush, this)
    }

    createChildren() {
        super.createChildren();
        this.AT_LeftItem.active = false;
    }

    public showGridList(config) {
        let gameType = config.gameType;
        let productCode = config.productCode;
        this.config = config;
        // let platName = data.platName;
        // let type = data.type;
        this.showTitleName(gameType, productCode);
        this.showLeftTabs(productCode);
    }

    AT_SearchBtnTouch() {
        if (this.currentIndex == "1") {
            this.showGameList(this.itemData);
        } else {
            this.showShouCangList(this.itemData);
        }
    }

    async showShouCangList(itemData) {
        this.itemData = itemData;
        this.AT_GameList.getComponent(ScrollView).stopAutoScroll();
        this.AT_GameList.getComponent(ScrollView).scrollToTop(0);
        let searchKey = this.AT_GameEdit.getComponent(EditBox).string.trim();
        this.AT_GameList.getComponent(ScrollView).content.removeAllChildren();
        this.currentSelectCode = itemData.productCode + "_" + searchKey
        let gameList = await Global.PLAYER.getShouCangList();
        let subGames = [];
        for (let i = 0; i < gameList.length; i++) {
            if (gameList[i] && gameList[i] != "null") {
                let game = Global.PLAYER.allGameConfig.games[gameList[i]] as GameIconItem;
                if (!game || !game.jumpUrl) {
                    continue;
                }
                if (game.productCode == itemData.productCode) {
                    if (game.name.indexOf(searchKey) > -1) {
                        subGames.push(game);
                    }
                }
            }
        }
        this.soucangIconList = subGames;
        this.scheduleOnce(() => {
            this.AT_GameList.getComponent(List).numItems = this.soucangIconList.length;
        })
    }



    public onLeftTabItemTouch(e, custorm) {
        let secondItem = JSON.parse(custorm);
        this.showGameList(secondItem);
    }

    public showLeftTabs(productCode) {
        let bigIconConfig = Global.PLAYER.allGameConfig[`secondClass`][this.config.gameType] as SecondIconItem[] || [];
        bigIconConfig = _.sortBy(bigIconConfig, "sortIndex");
        this.AT_LeftList.getComponent(ScrollView).scrollToTop(0);
        this.AT_LeftContent.removeAllChildren();
        this.scheduleOnce(() => {
            for (let i = 0; i < bigIconConfig.length; i++) {
                let itemData = bigIconConfig[i];
                if (Global.PLAYER.isInExcludePlat(itemData.productCode)) {
                    continue;
                }
                let icon1 = instantiate(this.AT_LeftItem);
                icon1.getChildByPath("no/tab1").getComponent(Label).string = itemData.productCode;
                icon1.getChildByPath("select/tab2").getComponent(Label).string = itemData.productCode;
                icon1.getComponent(Toggle).clickEvents[0].customEventData = JSON.stringify(itemData);
                ImageUtils.showNodeSprite(icon1.getChildByName("icon"), `icon/GAME/LOGO/outer_logo_${itemData.productCode}`)
                icon1.parent = this.AT_LeftContent
                icon1.active = true;
                if (productCode == "" && i == 0) {
                    icon1.getComponent(Toggle).isChecked = true;
                    this.showGameList(itemData);
                } else {
                    if (productCode == itemData.productCode) {
                        icon1.getComponent(Toggle).isChecked = true;
                        this.showGameList(itemData);
                    }
                }
            }
        })
    }

    AT_HideBtnTouch() {
        this.node.active = false;
        this.currentSelectCode = null;
        this.currentIndex = "1"
        this.AT_Tab.getChildByName("tab1").getComponent(Toggle).isChecked = true;
        this.AT_GameEdit.getComponent(EditBox).string = "";
        // this.showAni(false)
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_GameList: Node = null;

    itemData: any;
    searchIconList: any[] = [];
    soucangIconList: any[] = [];
    private lastKey: string;
    public showGameList(itemData: SecondIconItem) {
        this.itemData = itemData;
        this.AT_GameList.getComponent(ScrollView).stopAutoScroll();
        this.AT_GameList.getComponent(ScrollView).scrollToTop(0);
        let searchKey = this.AT_GameEdit.getComponent(EditBox).string.trim();
        if (this.currentSelectCode == itemData.productCode + "_" + searchKey) {
            return;
        }
        this.AT_GameList.getComponent(ScrollView).content.removeAllChildren();
        this.currentSelectCode = itemData.productCode + "_" + searchKey
        let subGames = Global.PLAYER.getGameByGroup(itemData, searchKey);
        this.searchIconList = subGames;
        this.scheduleOnce(() => {
            this.AT_GameList.getComponent(List).numItems = this.searchIconList.length;
        })
    }


    /**
   * 渲染外部icon
   * @param item 
   * @param idx 
   */
    onOuterGameRender(item: Node, idx: number) {
        item.active = true
        if (this.currentIndex == "1") {
            item.getComponent(MainSearchItem).updateItem(this.searchIconList[idx]);
        } else {
            item.getComponent(MainSearchItem).updateItem(this.soucangIconList[idx]);
        }

    }


    public showTitleName(gameType, productCode) {
        let title = "";
        switch (gameType) {
            case "RNG":
                title = "电子"
                break;
            case "PVP":
                title = "棋牌"
                break;
            case "LIVE":
                title = "真人"
                break;
            case "SPORT":
                title = "体育"
                break;
            case "ESPORT":
                title = "电竞"
                break;
            case "LOTT":
                title = "彩票"
                break;

        }
        this.AT_Title.getComponent(Label).string = productCode + title;
    }

    public currentIndex: string = "1";
    public async onTabItemTouch(e, index) {
        this.currentIndex = index;
        if (index == "1") {
            //全部
            this.AT_GameList.getComponent(ScrollView).stopAutoScroll();
            this.AT_GameList.getComponent(ScrollView).scrollToTop(0);
            this.AT_GameList.getComponent(ScrollView).content.removeAllChildren();
            this.scheduleOnce(() => {
                this.AT_GameList.getComponent(List).numItems = this.searchIconList.length;
            })
        } else {
            //收藏
            this.AT_GameList.getComponent(ScrollView).stopAutoScroll();
            this.AT_GameList.getComponent(ScrollView).scrollToTop(0);
            this.AT_GameList.getComponent(ScrollView).content.removeAllChildren();
            this.AT_SearchBtnTouch();
        }

    }
}