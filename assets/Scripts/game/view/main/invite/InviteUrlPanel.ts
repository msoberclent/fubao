/*
 * @Author: wangtao 
 * @Date: 2023-05-25 11:05:46 
 * @Last Modified by: wangtao
 * @Last Modified time: 2023-07-11 18:15:41
 */
import { ImageAsset, Node, Sprite, SpriteFrame, Texture2D, UITransform, _decorator } from 'cc';
import { Utils } from '../../../../../Piter.Framework/BaseKit/Util/Utils';
import Global from '../../../../../Piter.Framework/PiterGlobal';
import { GameUtils } from '../../../utils/GameUtils';
import { ScrollToBottomInPanel } from '../../panel/ScrollToBottomInPanel';
const { ccclass, property } = _decorator;

@ccclass('InviteUrlPanel')
export class InviteUrlPanel extends ScrollToBottomInPanel {
    protected static prefabUrl = "invite/prefabs/InviteUrlPanel";

    protected static className = "InviteUrlPanel";

    @property(Node)
    qrcode: Node | null = null;

    @property(Node)
    drawNode: Node | null = null;

    public createChildren(): void {
        super.createChildren();
        this.initUI();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(InviteUrlPanel);
    }

    initUI() {
        let url = Global.PLAYER.player.qrCodeUrl
        Utils.QRCreate(this.qrcode, url);
    }


    AT_SaveLinkBtnTouch() {
        GameUtils.setClipBordStr(Global.PLAYER.player.qrCodeUrl, "链接已复制");
    }


    private imageAsset: ImageAsset | null = null;
    private texture2d: Texture2D | null = null;


    initTexture() {
        // 存储 Uint8Array 数据，存入 imageAsset, 然后通过 texture2D.image = imageAsset创建texture2D, 
        // 之后把texture2d 赋值给Sprite渲染。
        this.imageAsset = new ImageAsset();
        this.imageAsset.reset({
            width: this.drawNode.getComponent(UITransform).width,
            height: this.drawNode.getComponent(UITransform).height,
            close: null
        });
        this.texture2d = new Texture2D();
        this.texture2d.reset({
            width: this.imageAsset.width,
            height: this.imageAsset.height,
            format: Texture2D.PixelFormat.RGBA8888
        });
        this.texture2d.image = this.imageAsset;
        let spf: SpriteFrame = new SpriteFrame();
        spf.texture = this.texture2d;
        this.drawNode.getComponent(Sprite).spriteFrame = spf;
    }
}
