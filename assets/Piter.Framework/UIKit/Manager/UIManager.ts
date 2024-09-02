

import { Camera, Component, Node, Prefab, ResolutionPolicy, Widget, _decorator, error, game, instantiate, isValid, macro, sys, v3, view } from 'cc';
import { PREVIEW } from 'cc/env';
import { WebGameUtils } from '../../../Scripts/webutils/WebGameUtils';
import { BaseConstant } from '../../BaseKit/Constant/BaseConstant';
import { BaseEvent } from '../../BaseKit/Constant/BaseEvent';
import { HashMap } from '../../BaseKit/Data/HashMap';
import Global from '../../PiterGlobal';
import { RESLoading } from '../../ResKit/RESLoading';
import PiterView, { ViewClass } from '../Base/PiterView';
import { PiterUIRoot } from '../PiterUIRoot';
const { ccclass, property } = _decorator;


/**
 * Predefined variables
 * Name = UIManager
 * DateTime = Mon Oct 18 2021 11:41:05 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * FileBasename = UIManager.ts
 * FileBasenameNoExtension = UIManager
 * URL = db://assets/scripts/uiframework/managers/UIManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('UIManager')
export class UIManager extends Component {

    @property({
        type: PiterUIRoot
    })
    uIRoot: PiterUIRoot = null;

    public bottomMap: HashMap<string, any> = new HashMap<string, any>();

    public panelMap: HashMap<string, any> = new HashMap<string, any>();

    public tipMap: HashMap<string, any> = new HashMap<string, any>();

    public loadingMap: HashMap<string, any> = new HashMap<string, any>();

    public topMap: HashMap<string, any> = new HashMap<string, any>();
    @property({
        type: Camera
    })
    public camrea3D: Camera;

    @property({
        type: Camera
    })
    public camrea2D: Camera;

    /**
     * 当前适配模式
     */
    public currentModel: number;

    public uiList = [];

    async start() {
        Global.UI = this;
        // Global.EVENT.on(`screen_orientation_flush`, this.onScreenFlush, this);
    }

    onScreenFlush(value) {
        if (value == "1") {
            //右横屏
            this.uIRoot.updateSafeArea(1)
        } else if (value == "0") {
            //左横屏
            this.uIRoot.updateSafeArea(0)
        }
    }

    public closeAllView() {
        Global.PMD.beforeRemove();
        let maps = ["bottom", "panel", "tip"];
        for (let i = 0; i < maps.length; i++) {
            let map = this[maps[i] + "Map"]
            for (let key in map.data) {
                let ui = map.data[key];
                if (ui && isValid(ui.node)) {
                    ui.closeView();
                }
            }
            map.clear();
        }
    }

    protected fullScreen(uiNode: Node) {
        let maxWidget = uiNode.addComponent(Widget);
        maxWidget.left = maxWidget.top = maxWidget.bottom = maxWidget.right = 0;
        maxWidget.alignMode = Widget.AlignMode.ALWAYS;
    }


    public openViewHasLoad<T extends PiterView>(uiClass: ViewClass<T>, paramsData?: any) {
        let url = uiClass.getUrl();
        let prefab = Global.RES.getAsset(url, Prefab) as Prefab;
        if (!prefab) {
            error(`${uiClass.getUrl()} error`);
            return
        }
        let layerName = uiClass.getLayerName();
        let map = this[`${layerName}Map`]
        if (map.get(uiClass.getName())) {
            error(uiClass.getName() + "is open");
            return;
        }
        let uiNode: Node = instantiate(prefab);
        let className = uiClass.getName();
        let ui = uiNode.getComponent(className) as PiterView;
        if (!ui) {
            console.error(`${uiClass.getUrl()}没有绑定UI脚本!!!`);
            return;
        }
        let uiRoot = this.uIRoot[layerName + "Layer"] as Node;
        if (!uiRoot) {
            console.error(`所选层级不存在`);
            return;
        }
        ui.init(paramsData);
        uiNode.parent = uiRoot;
        ui.tag = uiClass;
        map.add(uiClass.getName(), ui);
        return ui;
    }

    /**
     * 打开界面
     * @param uiClass 
     * @param layerName 
     */
    public async openView<T extends PiterView>(uiClass: ViewClass<T>, paramsData?: any, callback?) {
        if (!uiClass) return;
        let layerName = uiClass.getLayerName();
        let map = this[`${layerName}Map`]
        let url = uiClass.getUrl();
        let resConfig = uiClass.getResConfig();
        let callBack = () => {
            Global.RES.loadAsset(url, Prefab, (prefab: Prefab) => {
                if (map.get(uiClass.getName())) {
                    return;
                }
                let uiNode: Node = instantiate(prefab);
                let ui = uiNode.getComponent(uiClass) as PiterView;
                if (!ui) {
                    console.error(`${uiClass.getUrl()}没有绑定UI脚本!!!`);
                    return;
                }
                this.uiList.push(ui);
                let uiRoot = this.uIRoot[layerName + "Layer"] as Node;
                if (!uiRoot) {
                    console.error(`所选层级不存在`);
                    return;
                }
                ui.init(paramsData);
                uiNode.parent = uiRoot;
                // uiNode.setSiblingIndex(uiClass.getZIndex());
                ui.tag = uiClass;
                if (callback) {
                    callback();
                }
                map.add(uiClass.getName(), ui);
            })
        }

        if (resConfig && resConfig.bundleName && resConfig.dirNames) {
            if (sys.isNative) {
                callBack();
                Global.RES.loadBundleDirs(resConfig.bundleName, resConfig.dirNames, null, null);
            } else {
                RESLoading.instance.loadBundleDirs(resConfig, callBack)
            }
        } else {
            callBack();
        }

    }

    /**
     * 关闭界面
     * @param uiClass 
     * @param releaseRes 
     */
    public closeView<T extends PiterView>(uiClass: ViewClass<T>, releaseRes: boolean = false) {
        if (!uiClass) {
            return;
        }
        try {
            let layerName = uiClass.getLayerName();
            let ui = this[`${layerName}Map`].get(uiClass.getName());
            if (ui && isValid(ui.node)) {
                this[`${layerName}Map`].remove(uiClass.getName());
                ui.closeView();
            }
        } catch (e) {
            console.warn(uiClass + " close error ");
        }
    }

    public showPaomaDeng(data) {
        if (sys.isBrowser && WebGameUtils.NOTICE_PMD == "1") {
            return;
        }
        if (Global.PMD.node.parent) {
            Global.PMD.node.position = v3(0, 0)
            Global.PMD.node.active = true;
            Global.PMD.init(data);
        }
    }

    public hideNotOuterLayer() {
        if (sys.isBrowser && sys.isMobile) {
            this.uIRoot.bottomLayer.active = false;
            this.uIRoot.tipLayer.active = false;
            this.uIRoot.loadingLayer.active = false;
            // this.scheduleOnce(()=>{
            // })
            game.pause();
        }
    }

    public showOuterLayer() {
        if (sys.isBrowser && sys.isMobile) {
            game.resume();
            this.uIRoot.bottomLayer.active = true;
            this.uIRoot.tipLayer.active = true;
            this.uIRoot.loadingLayer.active = true;
        }
    }

    public hideTopLayer() {
        Global.EVENT.dispatchEvent(BaseEvent.SHOW_VERSION, false);
    }

    public getUI<T extends PiterView>(uiClass: ViewClass<T>) {
        for (let i = 0; i < this.uiList.length; ++i) {
            if (this.uiList[i].tag === uiClass) {
                return this.uiList[i];
            }
        }
        return null;
    }


    /**
     * 改变适配 1 == 横屏 2 == 竖屏
     * @param model 
     */
    public changeResize(model: number) {
        if (this.currentModel == model) {
            return;
        }
        this.currentModel = model;
        switch (model) {
            case 1:
                if (sys.isMobile || PREVIEW) {
                    view.setOrientation(macro.ORIENTATION_LANDSCAPE);
                    view.setDesignResolutionSize(BaseConstant.DESIGN_WIDTH, BaseConstant.DESIGN_HEIGHT, ResolutionPolicy.FIXED_HEIGHT);
                } else {
                    view.setDesignResolutionSize(BaseConstant.DESIGN_WIDTH, BaseConstant.DESIGN_HEIGHT, ResolutionPolicy.SHOW_ALL);
                }
                break;
            case 2:
                if (sys.isBrowser) {
                    if (sys.isMobile) {
                        this.doWebResolution();
                        window.addEventListener('resize', (event) => {
                            this.doWebResolution();
                        })
                    } else {
                        this.doPCResolution();
                    }

                } else {
                    if (sys.isMobile || PREVIEW) {
                        view.setOrientation(macro.ORIENTATION_PORTRAIT);
                        view.setDesignResolutionSize(BaseConstant.DESIGN_WIDTH, BaseConstant.DESIGN_HEIGHT, ResolutionPolicy.FIXED_WIDTH);
                    } else {
                        view.setDesignResolutionSize(BaseConstant.DESIGN_WIDTH, BaseConstant.DESIGN_HEIGHT, ResolutionPolicy.SHOW_ALL);
                    }
                    this.uIRoot.updateSafeAreaShu()
                }
                break;
        }
    }

    public doPCResolution() {
        view.setDesignResolutionSize(720, 1280, ResolutionPolicy.SHOW_ALL);
    }


    mode = 0
    public doWebResolution() {
        let st = {
            1: "FIXEDW",
            2: "FIXEDWH_16x9",
            3: "FIXEDWH_19_5x9",
            4: "FIXEDWH_9X16",
            FIXEDW: 1,
            FIXEDWH_9X16: 4,
            FIXEDWH_16x9: 2,
            FIXEDWH_19_5x9: 3,
        }
        let height = window.innerHeight;
        let width = window.innerWidth;
        if (height / width <= 16 / 9) {
            if (this.mode !== st.FIXEDWH_16x9) {
                this.mode = st.FIXEDWH_16x9;
                view.setDesignResolutionSize(720, 1280, new ResolutionPolicy(ResolutionPolicy.ContainerStrategy.PROPORTION_TO_FRAME, ResolutionPolicy.ContentStrategy.FIXED_WIDTH));
            }
        } else if (height / width > 16 / 9 && height / width <= 19.5 / 9) {
            if (this.mode !== st.FIXEDW) {
                this.mode = st.FIXEDW;
                view.setDesignResolutionSize(720, 1600, new ResolutionPolicy(ResolutionPolicy.ContainerStrategy.EQUAL_TO_FRAME, ResolutionPolicy.ContentStrategy.FIXED_WIDTH));
            }
        } else {
            if (this.mode !== st.FIXEDWH_19_5x9) {
                this.mode = st.FIXEDWH_19_5x9;
                view.setDesignResolutionSize(720, 1600, new ResolutionPolicy(ResolutionPolicy.ContainerStrategy.PROPORTION_TO_FRAME, ResolutionPolicy.ContentStrategy.FIXED_WIDTH));
            }
        }
    }
}

