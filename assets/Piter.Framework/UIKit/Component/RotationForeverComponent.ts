import { _decorator, Component, tween, Tween } from "cc";

const { ccclass, property, menu } = _decorator;
@ccclass
@menu("RotationForeverComponent")
export default class RotationForeverComponent extends Component {

    @property
    rotationTime: number = 2;

    public onLoad() {
        tween(this.node).by(this.rotationTime, {
            angle: -360
        }).repeatForever().start();
    }
    
    public updateRotation(time: number) {
        Tween.stopAllByTarget(this.node);
        tween(this.node).by(time, {
            angle: -360
        }).repeatForever().start();
    }
}