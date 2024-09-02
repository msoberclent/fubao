import { _decorator, ImageAsset, Label, Node, Sprite, SpriteFrame, sys, Texture2D, UITransform, v3 } from 'cc';
import { Utils } from '../../../../../../Piter.Framework/BaseKit/Util/Utils';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import PiterPanel from '../../../../../../Piter.Framework/UIKit/Base/PiterPanel';
const { ccclass, property } = _decorator;

@ccclass('PromotionSharePanel')
export class PromotionSharePanel extends PiterPanel {

    protected static prefabUrl = "promotion/prefabs/share/PromotionSharePanel";

    protected static className = "PromotionSharePanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_YMDNode: Node;

    @property(Node)
    target: Node = null;

    createChildren() {
        super.createChildren();

        // this.AT_QRCode
        Utils.QRCreate(this.qrcode, this.paramsData.url);
        this.AT_YMDNode.getComponent(Label).string = this.paramsData.extensionCode
        this.scheduleOnce(() => {
            this.initTexture();
        }, 1);
        if (sys.isNative) {
            let position = this.target.position.clone();
            this.target.position = v3(position.x, position.y - 60);
        } else {
            // let position = this.target.position.clone();
            // this.target.position = v3(position.x, position.y + 30);
        }
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionSharePanel);
    }

    //截屏

    @property(Node)
    drawNode: Node | null = null;
    @property(Node)
    qrcode: Node | null = null;
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


