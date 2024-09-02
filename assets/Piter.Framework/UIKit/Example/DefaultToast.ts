import { Label, Node, Prefab, Tween, UIOpacity, UITransform, Widget, _decorator, instantiate, tween, v3 } from 'cc';
import { BaseObject } from '../../BaseKit/Constant/BaseObject';
import Global from '../../PiterGlobal';
const { ccclass, property } = _decorator;

export class DefaultToast {
    private static _instance: DefaultToast = null;
    public static get instance() {
        if (this._instance == null) {
            this._instance = new DefaultToast();
        }
        return this._instance;
    }

    private target: Node;

    public static prefabUrl: string = "";
    constructor() {
        for (let i = 0; i < 100; i++) {
            this.currentRunningToast[i] = null;
        }
    }

    private getNodeIndex() {
        for (let i = 0; i < 100; i++) {
            if (!this.currentRunningToast[i]) {
                return i;
            }
        }
        return 100;
    }

    public currentRunningToast: BaseObject<Node> = {};
    /**
     * 飘出字体向上滚动
     */
    showScrollText(text: string | number, duration = 2) {
        if (text == "ok") {
            return;
        }
        let node = Global.POOL.produce("SCROLL_TEXT", Node) as Node;
        if (node) {
            node.getComponent(UITransform).height = 60;
            let index = this.getNodeIndex();
            node.setPosition(v3(0, index * (node.getComponent(UITransform).height + 15)));
            node.name = index + "";
            this.currentRunningToast[index] = node;
            Global.UI.uIRoot.tipLayer.getChildByName("ToastLayout").addChild(node);
            this.showText2(text, node, duration);
            return;
        }
        Global.RES.loadAsset(DefaultToast.prefabUrl, Prefab, (res: Prefab) => {
            let targetNode = instantiate(res) as Node;
            let index = this.getNodeIndex();
            targetNode.setPosition(v3(0, index * (targetNode.getComponent(UITransform).height + 15)));
            targetNode.name = index + "";
            this.currentRunningToast[index] = targetNode;
            Global.UI.uIRoot.tipLayer.getChildByName("ToastLayout").addChild(targetNode);
            this.showText2(text, targetNode, duration);
        })
    }

    private showScrollTextNode(text: any, targetNode: Node, duration) {
        if (typeof (text) == "number") {
            text = Global.LANG.getLang(text);
        }
        Tween.stopAllByTarget(targetNode);
        let label = targetNode.getComponentInChildren(Label);
        label.string = text;
        let opacity = targetNode.getComponent(UIOpacity);
        opacity.opacity = 255
        label.scheduleOnce(() => {
            let bgNode = targetNode.getChildByPath(`contentNode/AT_ContentBg`);
            bgNode.getComponent(UITransform).width = label.node.getComponent(UITransform).width + 150; //text.length * 50 + 200
            targetNode.getComponent(Widget).updateAlignment();
        })
        let beforePos = targetNode.position.clone();
        tween(targetNode).delay(0.05).call(() => {
            targetNode.active = true;
        }).delay(0.25).by(1.8, {
            position: v3(0, 250)
        }, {
            easing: "sineIn"
        }).start();
        setTimeout(() => {
            tween(opacity).to(0.1, {
                opacity: 0
            }).call(() => {
                targetNode.position = beforePos;
                targetNode.parent = null;
                Global.POOL.reclaim("SCROLL_TEXT", targetNode, 1)
                opacity.opacity = 255
            }).start();
        }, duration * 1000)
        // .call(() => {
        //     tween(opacity).delay(duration).to(0.1, {
        //         opacity: 0
        //     }).call(() => {
        //         targetNode.position = beforePos;
        //         targetNode.parent = null;
        //         Global.POOL.reclaim("SCROLL_TEXT", targetNode, 1)
        //         opacity.opacity = 255
        // }).start();
    }

    /**
     * 使用类似Android的toast方法的效果显示文字
     * @param text 要显示的文字
     * @param duration 显示时间. 默认值为0.5秒
     */
    showText2(text: any, targetNode: Node, duration = 2) {
        let opacity = targetNode.getComponent(UIOpacity);
        opacity.opacity = 255;
        let label = targetNode.getComponentInChildren(Label);
        label.string = text;
        Tween.stopAllByTarget(targetNode);

        label.scheduleOnce(() => {
            let bgNode = targetNode.getChildByPath(`contentNode/AT_ContentBg`);
            bgNode.getComponent(UITransform).width = label.node.getComponent(UITransform).width + 150; //text.length * 50 + 200
            targetNode.getComponent(Widget).updateAlignment();
        })
        // targetNode.setPosition(v3(0, 0));
        setTimeout(() => {

            tween(opacity).to(0.1, {
                opacity: 0
            }).call(() => {
                this.currentRunningToast[Number(targetNode.name)] = null
                targetNode.parent = null;
                Global.POOL.reclaim("SCROLL_TEXT", targetNode, 1)
                opacity.opacity = 255;
            }).start();
        }, duration * 1000)
        // this.showScrollText(text, duration);
    }

    showText(msg, serverMsg = "") {
        if (serverMsg && serverMsg != "ok") {
            msg = serverMsg;
        }
        this.showScrollText(msg);
    }

    /**
    * 使用类似Android的toast方法的效果显示文字
    * @param text 要显示的文字
    * @param duration 显示时间. 默认值为0.5秒
    */
    showTextByLang(langId: number, duration = 2) {
        let text = Global.LANG.getLang(langId);
        // this.showText(text, duration)
    }

    private timeout;
    private showNode(text: string, duration) {
        clearTimeout(this.timeout);
        this.target.active = true;
        let label = this.target.getComponentInChildren(Label);
        label.string = text;
        let opacity = this.target.getComponent(UIOpacity);
        opacity.opacity = 0
        tween(opacity).delay(0.01).call(() => {
            let bgNode = this.target.getChildByPath(`contentNode/AT_ContentBg`);
            bgNode.getComponent(UITransform).width = text.length * 50 + 200
        }).to(0.5, {
            opacity: 255
        }).delay(duration).to(0.2, {
            opacity: 0
        }).call(() => {
            this.target.active = false
        }).start();
    }

}
