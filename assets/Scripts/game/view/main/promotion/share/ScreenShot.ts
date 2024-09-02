
import {
    Camera,
    Component,
    ImageAsset,
    Node,
    RenderTexture,
    Sprite,
    SpriteFrame,
    Texture2D,
    UITransform,
    Vec3,
    _decorator,
    director,
    gfx,
    isValid, native,
    sys,
    tween,
    view
} from 'cc';
import { PREVIEW } from 'cc/env';
import { LocalStorageData } from '../../../../../../Piter.Framework/BaseKit/Data/LocalStorageData';
import NetLoadingView from '../../../../../../Piter.Framework/NetKit/NetLoadingView';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { GameUtils } from '../../../../utils/GameUtils';
import { Canvas2Image } from './Canvas2Image';
const { ccclass, property } = _decorator;

@ccclass('ScreenShot')
export class ScreenShot extends Component {

    @property(Camera)
    copyCamera: Camera | null = null;
    @property(Node)
    copyNode: Node | null = null;
    @property(Node)
    testNode: Node | null = null;
    @property(Node)
    targetNode: Node | null = null;
    @property(Node)
    arrivedNode: Node | null = null;

    renderTex: RenderTexture = null;
    _canvas: HTMLCanvasElement = null;
    _buffer: ArrayBufferView = null;
    canvas2Image: Canvas2Image = null;
    tempPos: Vec3 = new Vec3();

    start() {
        this.canvas2Image = Canvas2Image.getInstance();
        if (PREVIEW && sys.isNative) {
            return;
        }

        this.renderTex = new RenderTexture();
        this.renderTex.reset({
            width: view.getVisibleSize().width,
            height: view.getVisibleSize().height
        });
        this.copyCamera.targetTexture = this.renderTex;
        this.tempPos = this.copyNode.getPosition();
    }

    onBtnSave() {
        this.capture();
        // 定时任务
        this.scheduleOnce(() => {
            if (this && this.copyNode && isValid(this.copyNode)) {
                this.copyNode.setPosition(this.tempPos);
                this.copyNode.getComponent(Sprite).spriteFrame = null;
                this.copyNode.setScale(new Vec3(1, 1, 1));
            }
        }, 5);
        let width = this.targetNode.getComponent(UITransform).width;
        let height = this.targetNode.getComponent(UITransform).height;
        // GameUtils.saveImage(this.getBase64(this._buffer.buffer), "test");
        this.saveAsImage(width, height, this._buffer);
    }


    // 截图
    capture() {
        let width = this.targetNode.getComponent(UITransform).width;
        let height = this.targetNode.getComponent(UITransform).height;
        let worldPos = this.targetNode.getWorldPosition();
        let rt = this.renderTex;
        let texBuffers: ArrayBufferView[] = [];
        texBuffers[0] = new Uint8Array(width * height * 4);
        let region = new gfx.BufferTextureCopy();
        region.texOffset.x = Math.round(worldPos.x);
        region.texOffset.y = Math.round(worldPos.y);
        region.texExtent.width = width;
        region.texExtent.height = height;
        director.root.device.copyTextureToBuffers(rt.getGFXTexture(), texBuffers, [region]);
        this._buffer = texBuffers[0];
        this.showImage(width, height);
    }

    showImage(width: number, height: number) {
        let img = new ImageAsset();
        img.reset({
            _data: this._buffer,
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
            _compressed: false
        });
        let texture = new Texture2D();
        texture.image = img;
        let sf = new SpriteFrame();
        sf.texture = texture;
        sf.packable = false;
        this.copyNode.getComponent(Sprite).spriteFrame = sf;
        if (sys.isBrowser) {
            this.copyNode.getComponent(Sprite).spriteFrame.flipUVY = true;
        }
        this.copyNode.getComponent(UITransform).setContentSize(width, height);

        this.doCaptureAnim();

    }


    // 做截图动画
    doCaptureAnim() {
        if (this.copyNode) {
            let scale_fator = 0.95;
            let arrived_fator = 0.3;
            let pos = this.arrivedNode.getPosition();
            tween(this.copyNode)
                .to(0.2, { scale: new Vec3(scale_fator, scale_fator, 1) })
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .parallel(
                    tween(this.copyNode).to(0.5, { scale: new Vec3(arrived_fator, arrived_fator, 1) }),
                    tween(this.copyNode).to(0.5, { position: pos })
                ).start();
        }
    }

    saveAsImage(width: number, height: number, arrayBuffer: ArrayBufferView | number[]) {
        width = Math.round(width);
        height = Math.round(height);
        if (sys.isBrowser) {
            if (!this._canvas) {
                this._canvas = document.createElement('canvas');
                this._canvas.width = width;
                this._canvas.height = height;
            } else {
                this.clearCanvas();
            }
            let ctx = this._canvas.getContext('2d')!;
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let sRow = height - 1 - row;

                let imageData = ctx.createImageData(width, 1);
                let start = sRow * width * 4;

                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }
                ctx.putImageData(imageData, 0, row);
            }
            // @ts-ignore
            this.canvas2Image.saveAsPNG(this._canvas, width, height);
        } else if (sys.isNative) {
            let filePath = native.fileUtils.getWritablePath() + `${LocalStorageData.hashID}_share_${Date.now()}.png`;
            //@ts-ignore
            if (native.saveImageData) {
                //@ts-ignore
                NetLoadingView.instance.show(`Screenshoot`);
                this.scheduleOnce(() => {
                    NetLoadingView.instance.hide(`Screenshoot`);
                }, 2);
                native.saveImageData(new Uint8Array(this._buffer.buffer), width, height, filePath).then(async () => {
                    GameUtils.sendNativeMessage("getImage", { path: filePath });
                    // assetManager.loadRemote<ImageAsset>(filePath, (err, imageAsset) => {
                    //     if (err) {
                    //     } else {
                    //         const spriteFrame = new SpriteFrame();
                    //         const texture = new Texture2D();
                    //         texture.image = imageAsset;
                    //         spriteFrame.texture = texture;
                    //         this.testNode.getComponent(Sprite).spriteFrame = spriteFrame;
                    //         spriteFrame.packable = false;
                    //         // spriteFrame.flipUVY = true;
                    //         // if (sys.isNative && (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX)) {
                    //         //     spriteFrame.flipUVY = false;
                    //         // }
                    //         DefaultToast.instance.showText(`成功保存在设备目录并加载成功: ${filePath}`)
                    //     }
                    // });
                    DefaultToast.instance.showText(`图片保存成功`);
                }).catch(() => {
                    DefaultToast.instance.showText(`保存图片失败`);
                });
            }
        } else if (sys.platform == sys.Platform.WECHAT_GAME) {
            if (!this._canvas) {
                // @ts-ignore
                this._canvas = wx.createCanvas();
                this._canvas.width = width;
                this._canvas.height = height;
            } else {
                this.clearCanvas();
            }
            var ctx = this._canvas.getContext('2d');
            var rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let sRow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = sRow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }
                ctx.putImageData(imageData, 0, row);
            }
            // @ts-ignore
            this._canvas.toTempFilePath({
                x: 0,
                y: 0,
                width: this._canvas.width,
                height: this._canvas.height,
                destWidth: this._canvas.width,
                destHeight: this._canvas.height,
                fileType: "png",
                success: function (res) {
                    // @ts-ignore
                    wx.showToast({ title: "截图成功" });
                    // @ts-ignore
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function (res) {
                            // @ts-ignore
                            wx.showToast({ title: "成功保存到设备相册" })
                        }
                    });
                }
            })
        }
    }

    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}