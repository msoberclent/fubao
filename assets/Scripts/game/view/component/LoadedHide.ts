import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadedHide')
export class LoadedHide extends Component {
    onLoad() {
        this.node.active = false
        this.enabled = false;
    }
}


