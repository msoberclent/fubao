import { Component, Node, ProgressBar, Sprite, UITransform, _decorator, v3 } from "cc";

const { ccclass, property } = _decorator;
@ccclass('PrograssBarUtils')
export class PrograssBarUtils extends Component {
    @property(Node)
    BarBg: Node = null;
    @property(Sprite)
    barSprite: Sprite = null;
    @property(Node)
    barHandle: Node = null;

    barWidth = 0;
    prograss = 0;

    protected onLoad(): void {
        this.barHandle.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.barHandle.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.barHandle.on(Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    protected start(): void {
        this.barWidth = this.BarBg.getComponent(UITransform).contentSize.x - 20;
    }

    protected onDestroy(): void {
    }

    init(moveHandle?) {
        if (moveHandle) {
            this.moveHandle = moveHandle;
        }
    }

    moveHandle: Function = null;
    private startx = 0;
    touchStart(e) {
        this.startx = e.getLocation().x;
    }

    touchMove(e) {
        let offsetX = e.getLocation().x - this.startx;
        this.barHandle.setPosition(v3(this.barHandle.position.x + offsetX));
        this.startx = e.getLocation().x;
        if (this.barHandle.position.x > this.barWidth) {
            this.barHandle.setPosition(v3(this.barWidth));
        }
        if (this.barHandle.position.x < 0) {
            this.barHandle.setPosition(v3(0));
        }
        this.prograss = (this.barHandle.position.x) / this.barWidth;
        this.barSprite.fillRange = this.prograss;
        this.moveHandle && this.moveHandle();
    }

    getPrograss() {
        return this.prograss;
    }

    setPrograss(pro) {
        this.prograss = pro;
        this.BarBg.getComponent(ProgressBar).progress = this.prograss;
        this.barSprite.fillRange = this.prograss;
        this.barHandle.setPosition(v3(this.barWidth * this.prograss));
    }

    touchEnd(e) {

    }
}