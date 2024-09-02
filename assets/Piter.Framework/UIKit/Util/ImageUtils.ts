import { ImageAsset, Node, Sprite, SpriteAtlas, SpriteFrame, Texture2D, Tween, UIOpacity, UITransform, assetManager, isValid } from "cc";
import Global, { PiterGloal } from "../../PiterGlobal";

export class ImageUtils {

    public static async showI18NImage(dirName: string, resUrl: string, sprite: Sprite, resetSize: boolean = false) {
        let url = `${dirName}/res/language/${Global.LANG.curLang}/${resUrl}`;
        this.showImage(sprite, url, resetSize);
    }

    public static async showImage(sprite: Sprite, resUrl, resetSize: boolean = false) {
        if (!sprite) {
            return;
        }
        Global.RES.loadAsset(resUrl, SpriteFrame, (spriteFrame: SpriteFrame) => {
            if (spriteFrame && isValid(sprite) && isValid(sprite.node)) {
                sprite.spriteFrame = spriteFrame;
                if (resetSize) {
                    sprite.node.getComponent(UITransform).setContentSize(spriteFrame.originalSize);
                }
            } else {
                sprite.spriteFrame = null;
            }
        })
    }


    public static async showNodeSprite(node: Node, resUrl, resetSize: boolean = false) {
        if (!node) {
            return;
        }
        this.showImage(node.getComponent(Sprite), resUrl, resetSize);
    }

    public static loadAltasImage(sprite: Sprite, altasName: string, headerName: string) {
        if (!sprite) {
            return;
        }
        Global.RES.loadAsset(altasName, SpriteAtlas, (atlas: SpriteAtlas) => {
            if (atlas) {
                sprite.spriteFrame = atlas.getSpriteFrame(headerName);
            }
        })
    }


    public static loadRemoteImage(sprite: Sprite, headerUrl: string, insert: boolean = false) {
        if (headerUrl.indexOf("192.168") > -1 || !headerUrl.startsWith("http")) {
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
                let texture = new Texture2D();
                texture.image = assets;
                let spriteFrame = new SpriteFrame();
                spriteFrame.texture = texture;
                sprite.spriteFrame = spriteFrame;
                // if (insert) {
                //     dynamicAtlasManager.insertSpriteFrame(spriteFrame);
                // }
            }
        })
    }

    public static showRemoteHeader(sprite: Sprite, headerUrl: string, callback?) {
        if (!headerUrl || headerUrl.indexOf("192.168") > -1 || !headerUrl.startsWith("http")) {
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
                let texture = new Texture2D();
                texture.image = assets;
                let spriteFrame = new SpriteFrame();
                spriteFrame.texture = texture;
                sprite.spriteFrame = spriteFrame;
                if (callback) {
                    callback();
                }
            }
        })
    }


    public static getNewSpirteNode() {
        let node = Global.POOL.produce("singleSprite", Node) as Node;
        if (!node) {
            node = new Node(`singleSprite`);
            node.addComponent(Sprite);
            node.addComponent(UIOpacity)
        }
        return node;
    }

    public static recimalSpirteNode(spriteNode: Node) {
        spriteNode.removeFromParent();
        spriteNode.getComponent(UIOpacity).opacity = 255
        Tween.stopAllByTarget(spriteNode);
        Global.POOL.reclaim(`singleSprite`, spriteNode);
    }

}