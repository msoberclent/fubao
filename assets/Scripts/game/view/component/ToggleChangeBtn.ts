import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToggleChangeBtn')
export class ToggleChangeBtn extends Component {

    @property(Node)
    offNode: Node = null;

    @property(Node)
    onNode: Node = null;

    onLoad() {
        if (!this.offNode) {
            this.offNode = this.node.getChildByName("no")
        }
        if (!this.onNode) {
            this.onNode = this.node.getChildByName("select")
        }
    }

    update(dt: number) {
        if (this.onNode.active) {
            if (this.offNode.active) {
                this.offNode.active = false;
            }
        }
        if (this.onNode.active == false) {
            if (!this.offNode.active) {
                this.offNode.active = true;
            }
        }
    }

}


