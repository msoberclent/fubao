import { Component, Label, UITransform, Vec3, _decorator, tween, v3 } from 'cc';
import Global from '../../../../Piter.Framework/PiterGlobal';
const { ccclass, property } = _decorator;

@ccclass('PaomaDengUI')
export class PaomaDengUI extends Component {


    @property(Label)
    richtxt: Label = null;

    onLoad(): void {
        Global.PMD = this;
        this.node.active = false;
    }

    public IsPlay: boolean = false;
    private MarqueeArr = [];

    public init(param) {
        this.addMarquee(param.content);
    }

    public addMarquee(data) {
        this.MarqueeArr.push(data);
        if (!this.IsPlay) {
            this.checkMarqueePlay();
        }
    }
    private checkMarqueePlay() {
        if (this.MarqueeArr.length > 0) {
            let data = this.MarqueeArr.shift();
            this.showMarqueeLabel(data);
        } else {
            this.IsPlay = false;
            // this.node.active = false;
        }
    }
    private showMarqueeLabel(data) {
        this.IsPlay = true;
        this.richtxt.string = data;
        let len = this.richtxt.node.getComponent(UITransform).width;
        let width = this.node.getComponent(UITransform).width;
        let node = this.richtxt.node;

        let beforePos = node.position.clone();
        tween(node).by(15, { position: v3(-width / 2 - len - 720, 0) }).call(() => {
            node.position = beforePos;
            this.IsPlay = false;
            this.checkMarqueePlay();
        }).start();
    }


    /**
     * beforeRemove
     */
    public beforeRemove() {
        this.node.parent = null;
        this.node.active = false;
    }
}