import { Component, ImageAsset, Label, Sprite, SpriteFrame, Texture2D, UIOpacity, _decorator, assetManager, isValid, tween, v3 } from "cc";
import Global, { PiterGloal } from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { SubGameStatus } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { GameIconItem } from "../../../message/GameMessage";
import { GameEvent } from "../../../model/event/GameEvent";

const { ccclass, property } = _decorator;

@ccclass('MainSearchItem')
export class MainSearchItem extends Component {

    gameItem: GameIconItem;

    public updateItem(gameItem: GameIconItem) {
        this.gameItem = gameItem;
        this.initUI();
    }

    /**
     * 包网icon
     */
    private showBWIcon() {
        let icon = this.node.getChildByPath("content/icon");
        icon.getComponent(Sprite).spriteFrame = null;
        this.node.getChildByPath("content/loadingicon").active = true;
        if (this.gameItem.prex) {
            let url = this.gameItem.jumpUrl.replace(".png", `${this.gameItem.prex}.png`);
            this.loadRemoteImage(icon.getComponent(Sprite), url)
        } else {
            this.loadRemoteImage(icon.getComponent(Sprite), this.gameItem.jumpUrl)
        }
        this.setBWIconUITrans();
        this.node.getChildByPath("content/name").getComponent(Label).string = this.gameItem.name;
    }

    private setBWIconUITrans() {
    }

    public loadRemoteImage(sprite: Sprite, headerUrl: string, insert: boolean = false) {
        if (headerUrl.indexOf("192.168") > -1) {
            return;
        }
        if (headerUrl.indexOf("?") > -1) {
            headerUrl += "&vers=" + PiterGloal.openTime;
        } else {
            headerUrl += "?vers=" + PiterGloal.openTime;
        }
        assetManager.loadRemote(decodeURIComponent(headerUrl), (error, assets: ImageAsset) => {
            if (error) {
                return;
            }
            if (isValid(sprite) && isValid(sprite.node)) {
                // this.node.getChildByPath("content/loadingicon").active = false;
                let texture = new Texture2D();
                texture.image = assets;
                let spriteFrame = new SpriteFrame();
                spriteFrame.texture = texture;
                sprite.spriteFrame = spriteFrame;
            }
        })
    }

    async initUI() {
        this.showBWIcon();
        this.setIsShouCang();
    }

    async jump2URL() {
        Global.EVENT.dispatchEvent("go_subgame", this.gameItem);
    }

    subGameTouch() {
        if (this.gameItem.status == SubGameStatus.WATING) {
            DefaultToast.instance.showText("敬请期待")
            return;
        }
        this.jump2URL();
    }

    public showInitAni(index) {
        let node = this.node.getChildByName("content");
        let uIOpacity = node.getComponent(UIOpacity);
        uIOpacity.opacity = 0;
        let time = 0.1;
        let jiangeTime = 0.01
        this.scheduleOnce(() => {
            tween(uIOpacity).to(time, {
                opacity: 255
            }).start();
            node.position = v3(0, -200);
            tween(node).to(time, {
                position: v3(0, 0)
            }).start();
        }, index * jiangeTime);
        return time + index * jiangeTime;
    }


    isShouCang: boolean
    public setIsShouCang() {
        let shoucangList = Global.PLAYER.shoucangList || [];
        this.isShouCang = shoucangList.indexOf(this.gameItem.gameId) > -1;
        this.node.getChildByPath("content/likeBtn/like").active = this.isShouCang;
    }

    public async onShouCangTouch() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/user-collect-game", {
            gameId: this.gameItem.gameId
        }, true);
        if (resp.code == 200) {
            Global.PLAYER.shoucangList = resp.data;
            this.setIsShouCang();
            Global.EVENT.dispatchEvent(GameEvent.SEARCH_LIST_FLUSH);
        }
    }

}