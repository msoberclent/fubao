import { Component, Material, Node, Prefab, SpriteFrame, _decorator, warn } from 'cc';
const { ccclass, property, executeInEditMode, menu } = _decorator;

@ccclass('PiterAutoBind')
@executeInEditMode
@menu('PiterAutoBind')
export default class PiterAutoBind extends Component {
    /** 自己加载组件名称前缀 AUTO 缩写*/
    static autoLoadNodePrefix: string = 'AT_';

    @property({
        type: [Node],
        tooltip: '手动添加Node集合',
    })
    dictArray: Array<Node> = [];
    @property({
        type: [Node],
        readonly: true,
        tooltip: '自动加载Node集合',
    })
    dictArrayAuto: Array<Node> = [];

    @property({
        type: [SpriteFrame],
        tooltip: 'SpriteFrame集合',
    })
    dictSpriteFrameArray: Array<SpriteFrame> = [];

    @property({
        type: [Prefab],
        tooltip: 'Prefab集合',
    })
    dictPrefabArray: Array<Prefab> = [];

    @property({
        type: [Material],
        tooltip: 'Material集合',
    })
    dictMaterialArray: Array<Material> = [];

    @property({
        tooltip: '检查是否存在重复资源引用',
        override: true,
        visible: false,
    })
    get check() {
        this.checkNodeRepeatKey(this.dictArray);
        this.checkNodeRepeatKey(this.dictArrayAuto);
        this.checkResRepeatKey(SpriteFrame);
        this.checkResRepeatKey(Prefab);
        return 0;
    }

    onFocusInEditor() {
        if (CC_EDITOR) {
            this.autoLoadNode();
        }
    }

    onLostFocusInEditor() {
        if (CC_EDITOR) {
            this.autoLoadNode();
        }
    }

    start() {
        if (CC_EDITOR) {
            this.autoLoadNode();
        }
    }

    private dictNodes = new Map<string, Node>();
    private dictSpriteFrames = new Map<string, SpriteFrame>();
    private dictPrefabs = new Map<string, Prefab>();
    private dictMaterials = new Map<string, Material>();

    /** 获取节点资源 */
    public get<T extends any>(key: string, component?: any): T {
        if (this.dictNodes.size === 0) {
            for (let node of this.dictArray) {
                if (!node) continue;
                this.dictNodes.set(node.name, node);
            }
            this.autoLoadNode();
            for (let node of this.dictArrayAuto) {
                if (!node) continue;
                this.dictNodes.set(node.name, node);
            }
        }

        let v = this.dictNodes.get(key);
        if (!v) {
            // logger.info('CCReferenceCollector 获取节点失败', key);
            return null;
        }

        if (component && component !== Node) {
            return v.getComponent(component) as T;
        }

        return v as T;
    }

    /** 获取挂载资源 */
    public getRes<T extends any>(key: string, type: any): T {
        let resDicst: any = this.getResDict(type);
        if (resDicst.size === 0) {
            this.initResDicts(type);
        }

        let v = resDicst.get(key);
        if (!v) {
            console.warn('CCReferenceCollector 获取资源失败', key);
            return null;
        }

        return v as T;
    }

    private checkNodeRepeatKey(dictArray: Node[]) {
        if (!dictArray || dictArray.length === 0) {
            return;
        }
        let keys = new Set<string>();
        for (let i = 0; i < dictArray.length; i++) {
            if (!dictArray[i]) {
                continue;
            }

            if (keys.has(dictArray[i].name)) {
                warn(`Node 子节点名${dictArray[i].name}重复，请检查节点${this.node.name}下子节点命名`);
                continue;
            }
            keys.add(dictArray[i].name);
        }
    }

    private getResDict(type: any) {
        let resDicts: any;
        switch (type) {
            case SpriteFrame:
                resDicts = this.dictSpriteFrames;
                break;
            case Prefab:
                resDicts = this.dictPrefabs;
                break;
            case Material:
                resDicts = this.dictMaterials;
                break;
        }
        return resDicts;
    }

    private getResArray(type: any) {
        let resArray: any;
        switch (type) {
            case SpriteFrame:
                resArray = this.dictSpriteFrameArray;
                break;
            case Prefab:
                resArray = this.dictPrefabArray;
                break;
            case Material:
                resArray = this.dictMaterialArray;
                break;
        }

        return resArray;
    }

    private initResDicts(type: any) {
        let resDicts: any = this.getResDict(type);
        let resArray: any = this.getResArray(type);
        // let a: string = '';
        // a.lastIndexOf('/')
        for (let res of resArray) {
            if (!res) continue;
            resDicts.set(
                res.name || res.data?.name || res.effectName.substring(res.effectName.lastIndexOf('/') + 1), // Material材质文件
                res
            );
        }
    }

    private checkResRepeatKey(type: any) {
        let resArray = this.getResArray(type);
        if (!resArray || resArray.length === 0) {
            return;
        }

        let keys = new Set<string>();
        for (let i = 0; i < this.dictSpriteFrameArray.length; i++) {
            if (!this.dictSpriteFrameArray[i]) {
                continue;
            }

            if (keys.has(this.dictSpriteFrameArray[i].name)) {
                warn(`${type.name}资源${this.dictSpriteFrameArray[i].name}重复添加`);
                continue;
            }
            keys.add(this.dictSpriteFrameArray[i].name);
        }
    }

    private autoLoadNode() {
        this.dictArrayAuto = [];
        this.loadNode(this.node, '', (node) => {
            if (node.getComponent(PiterAutoBind)) {
                if (node.name.startsWith(PiterAutoBind.autoLoadNodePrefix)) {
                    this.dictArrayAuto.push(node);
                }
                return false;
            }
            if (node.name.startsWith(PiterAutoBind.autoLoadNodePrefix)) {
                this.dictArrayAuto.push(node);
            }
            return true;
        });
    }

    private loadNode(root: Node, path, handler: (node: Node) => boolean) {
        for (let i = 0; i < root.children.length; i++) {
            let c = handler(root.children[i]);
            if (!c) {
                continue;
            }
            this.loadNode(root.children[i], path + root.children[i].name + '/', handler);
        }
    }
}