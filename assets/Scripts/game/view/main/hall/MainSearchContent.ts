import { EditBox, Node, ScrollView, Toggle, Tween, UIOpacity, UITransform, _decorator, instantiate, tween, v3 } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { GameIconItem } from "../../../message/GameMessage";
import { GameEvent } from "../../../model/event/GameEvent";
import { MainSearchItem } from "./MainSearchItem";

const { ccclass, property } = _decorator;

@ccclass('MainSearchContent')
export class MainSearchContent extends PiterUI {

    @PiterDirector.AUTO_BIND(Node)
    AT_Content: Node = null;

    @PiterDirector.AUTO_BIND(EditBox)
    AT_GNameEdit: EditBox = null;

    @PiterDirector.AUTO_BIND(List)
    AT_SearchList: List = null;

    @PiterDirector.AUTO_BIND(List)
    AT_NormalList: List = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_NormalContent: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_SearchContent: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_NoTip: Node = null;

    searchList: GameIconItem[] = [];

    normalList: GameIconItem[] = [];

    createChildren() {
        super.createChildren();

        // this.getTabList(0);
    }

    async onShow() {
        // this.showAni(true)
        this.node.active = true;
        this.currentTabIndex = null;
        await Global.PLAYER.getShouCangList();
        this.getTabList(0);
        this.node.getChildByPath("AT_Content/top/tab/pageItem1").getComponent(Toggle).isChecked = true;
    }

    public onAdded() {
        super.onAdded();
        Global.EVENT.on(GameEvent.SEARCH_LIST_FLUSH, this.onListFlush, this)
        Global.EVENT.on(GameEvent.SHOUCANG_SUCCESS, this.onShouCangSuccess, this);
    }

    public onRemoved() {
        super.onRemoved();
        Global.EVENT.off(GameEvent.SEARCH_LIST_FLUSH, this.onListFlush, this)
        Global.EVENT.off(GameEvent.SHOUCANG_SUCCESS, this.onShouCangSuccess, this);
    }


    public onListFlush() {
        if (this.currentTabIndex == "1") {
            this.getTabList(1);
        }
    }

    isRunning: boolean = false;
    public showAni(isShow) {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true
        if (isShow) {
            let width = this.node.getComponent(UITransform).width;
            this.AT_Content.position = v3(-1200, this.AT_Content.position.y);
            this.AT_Content.active = true;
            Tween.stopAllByTarget(this.AT_Content);
            tween(this.AT_Content).by(0.3, {
                position: v3(0, 0)
            }).call(() => {
                this.isRunning = false
            }).start();
        } else {
            Tween.stopAllByTarget(this.AT_Content);
            tween(this.AT_Content).by(0.3, {
                position: v3(720, 0)
            }).call(() => {
                this.isRunning = false
                this.node.active = false;
            }).start();
        }
    }

    AT_HideBtnTouch() {
        this.node.active = false;
        // this.showAni(false)
    }

    onListRender(item: Node, idx: number) {
        if (this.currentTabIndex == "2") {
            item.getComponent(MainSearchItem).updateItem(this.searchList[idx]);
        } else {
            item.getComponent(MainSearchItem).updateItem(this.normalList[idx]);
        }
    }

    currentTabIndex: string = "0";
    onTabButtonTouch(e: Event, tabIndex: string) {
        if (tabIndex == this.currentTabIndex) {
            return;
        }
        this.currentTabIndex = tabIndex
        if (tabIndex == "0") {
            this.getTabList(0);
        } else if (tabIndex == "1") {
            this.getTabList(1);
        } else {
            this.showSearchList();
        }
    }

    showSearchList() {
        this.AT_SearchContent.active = true;
        this.AT_NormalContent.active = false;
    }

    public async AT_SearchGameBtnTouch() {
        if (this.currentTabIndex != "2") {
            this.node.getChildByPath("AT_Content/top/tab/pageItem3").getComponent(Toggle).isChecked = true;
            this.onTabButtonTouch(null, "2");
        }
        await Global.PLAYER.getShouCangList();
        this.searchGame();
    }

    public searchGame() {
        let str = this.AT_GNameEdit.string.trim();
        if (Global.ONCE_STORAGE[`search_game_key`] == str) {
            return
        }
        if (str.length < 1) {
            DefaultToast.instance.showText("请输入关键字");
            return;
        }
        Global.ONCE_STORAGE[`search_game_key`] = str
        let gameList = Global.PLAYER.searchGame(str);
        this.searchList = gameList;
        this.AT_SearchList.node.getComponent(ScrollView).scrollToTop(0.01, true);
        this.AT_SearchList.numItems = this.searchList.length;
    }

    public async getTabList(type) {
        this.AT_SearchContent.active = false;
        this.AT_NormalContent.active = true;
        let gameList = [];
        if (type == "0") {
            //最近游戏
            let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recently-game", {
                status: type
            });
            if (resp.code == 200) {
                gameList = resp.data;
            }
        } else {
            gameList = await Global.PLAYER.getShouCangList();
        }
        let gameJSON = [];
        for (let i = 0; i < gameList.length; i++) {
            if (gameList[i] && gameList[i] != "null") {
                let game = Global.PLAYER.allGameConfig.games[gameList[i]] as GameIconItem;
                if (game && game.jumpUrl) {
                    gameJSON.push(game);
                }
            }
        }
        this.normalList = gameJSON;
        this.AT_NormalList.node.getComponent(ScrollView).scrollToTop(0.01, true);
        this.AT_NormalList.numItems = this.normalList.length;
        this.AT_NoTip.active = this.normalList.length == 0
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_SearchTemp: Node = null;
    onShouCangSuccess(data) {
        let position = data.pos;
        let tempNode = Global.POOL.produce("shoucang_ani", Node) as Node;
        if (!tempNode) {
            tempNode = instantiate(this.AT_SearchTemp);
        }
        tempNode.position = this.AT_Content.getComponent(UITransform).convertToNodeSpaceAR(position);
        tempNode.parent = this.AT_Content;
        tempNode.active = true;
        let uiOp = tempNode.getComponent(UIOpacity);
        uiOp.opacity = 255;
        tween(tempNode).to(0.35, {
            position: v3(0, 440)
        }, {
            easing: "sineIn"
        }).call(() => {
            if (uiOp) {
                tween(uiOp).to(0.25, {
                    opacity: 0
                }).call(() => {
                    Global.POOL.reclaim("shoucang_ani", tempNode, 3);
                }).start();
            }
        }).start();
    }

}