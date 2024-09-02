import { readdirSync, statSync } from 'fs';
import { readFileSync } from 'fs-extra';
import { join, parse } from 'path';
import Vue from 'vue/dist/vue';
import { CfgData } from '../utils/CfgData';
import { CfgUtil } from '../utils/CfgUtil';
import { generator } from '../utils/version_generator';

Vue.component("subpacakage-item", {
    // template: `
    // <ui-prop slot="label" name="子游戏名">
    //     <ui-label>game1</ui-label>
    //     <ui-button>删除</ui-button>
    // </ui-prop>
    // `,
    template: `
    <div class="shadow" style="width: 95%;margin-left: 20px;margin-top: 10px;">
        <ui-label class="flex-2" style="width: 100px;margin-left: 20px;">{{subpackage}}</ui-label>
        <ui-button class="red"  style="margin-left: 120px;" @click="$emit('remove', subpackage)">删除</ui-button>
    </div>
    `,
    props: ["subpackage"]
})

const component = Vue.extend({
    template: readFileSync(join(__dirname, '../../../static/template/vue/app.html'), 'utf-8'),
    data() {
        return {
            subPackageName: "",
            get rootDir() {
                return join(Editor.Project.path)
            },
            get remoteDir() {
                return join(this.rootDir, "remote")
            },
            mainCfgData: CfgUtil.getCfgData("main"),
            testCfgData: CfgUtil.getCfgData("test"),
            subCfgData: new CfgData(),
            subBundles: [''],
            addMainSubPackage: "",
            logView: ""
        };
    },
    created() {
        this.updateSubPackageList()
    },
    methods: {
        clearLog() {
            this.logView = ""
        },
        //保存子包
        updateMainPackInfo() {
            CfgUtil.saveConfig("main", this.mainCfgData)
            this.logView += `正式子包信息更新成功\n`
            this.testCfgData.subPackages = this.mainCfgData.subPackages
            CfgUtil.saveConfig("test", this.testCfgData);
            this.logView += `测试子包信息更新成功\n`
        },

        //打测试包
        generatorTestPackage() {
            for (let i = 0; i < this.subBundles.length; i++) {
                try {
                    let subPackName = this.subBundles[i];
                    let subConfig = CfgUtil.getCfgData(subPackName) as CfgData;
                    subConfig.remoteUrl = this.testCfgData.remoteUrl + subPackName;
                    subConfig.buildDir = this.testCfgData.buildDir.replace("data", "remote");
                    subConfig.remoteDir = this.testCfgData.remoteDir + subPackName
                    generator(subPackName, subConfig)
                } catch (e) {
                    this.logView += `发布测试子包-------${this.subPackageName} 出错\n`
                }
            }
            this.logView += `测试服子包全部生成\n`
        },

        //打正式包
        generatorMainPackage() {
            for (let i = 0; i < this.subBundles.length; i++) {
                try {
                    let subPackName = this.subBundles[i];
                    let subConfig = CfgUtil.getCfgData(subPackName) as CfgData;
                    subConfig.remoteUrl = this.mainCfgData.remoteUrl + subPackName;
                    subConfig.buildDir = this.mainCfgData.buildDir.replace("data", "remote");
                    subConfig.remoteDir = this.mainCfgData.remoteDir + subPackName
                    generator(subPackName, subConfig)
                } catch (e) {
                    this.logView += `发布正式子包-------${this.subPackageName} 出错\n`
                }
            }
            this.logView += `正式服子包全部生成\n`
        },

        generatorSubPackage() {
        },

        onMainTestRemoteUrlChange(url: string) {
            this.testCfgData.remoteUrl = url
        },

        onMainTestBuildDirChange(name: string) {
            this.testCfgData.buildDir = name
        },

        onMainTestRemoteDirChange(name: string) {
            this.testCfgData.remoteDir = name
        },

        onMainRemoteUrlChange(url: string) {
            this.mainCfgData.remoteUrl = url
        },

        onMainBuildDirChange(name: string) {
            this.mainCfgData.buildDir = name
        },

        onMainRemoteDirChange(name: string) {
            this.mainCfgData.remoteDir = name
        },

        onMainVersionChange(version: string) {
            this.mainCfgData.version = version
        },

        updateSubPackageList() {
            let tempList: string[] = [];
            let version = 380;
            if (version >= 380) {
                const jsonDir = join(Editor.Project.path, "bundle-config.json")
                let jsonData = readFileSync(jsonDir, "utf-8");
                let bundleConfigJson = JSON.parse(jsonData);
                console.log(jsonData);
                const assertsDir = join(Editor.Project.path, "assets/Bundles")
                this.walkFile([assertsDir], (filename: string) => {
                    let data = readFileSync(filename) as any;
                    try {
                        let meta = JSON.parse(data);
                        if (meta.userData.isBundle) {
                            let bundileId = meta.userData.bundleConfigID;
                            if (bundileId) {
                                let config = bundleConfigJson[bundileId];
                                let bundleName = config.displayName;
                                let native = config.configs.native;
                                console.log("isRemote " + native.overwriteSettings.android.isRemote);
                                if (native.overwriteSettings.android && native.overwriteSettings.android.isRemote) {
                                    console.log(bundleName);
                                    tempList.push(bundleName)
                                }
                            }
                        }
                    } catch (error) {

                    }
                }, ['.meta'], [], 4);
            } else {
                const assertsDir = join(Editor.Project.path, "assets/Bundles")
                this.walkFile([assertsDir], (filename: string) => {
                    let data = readFileSync(filename) as any;
                    try {
                        let meta = JSON.parse(data);
                        if (meta.userData.isBundle) {
                            console.log(meta)
                            if (meta.userData.isRemoteBundle && meta.userData.isRemoteBundle.android) {
                                const info = parse(filename);
                                tempList.push(meta.userData.bundleName || info.name);
                            }
                        }
                    } catch (error) {

                    }
                }, ['.meta'], [], 4);
            }
            this.subBundles = tempList
        },

        onMainSubPackageConfirm(name: string) {
            this.addMainSubPackage = name
        },

        clickAddMainSubPackage() {
            if (!!this.addMainSubPackage) {
                for (let subPackage of this.mainCfgData.subPackages) {
                    if (subPackage === this.addMainSubPackage) {
                        return
                    }
                }
                this.mainCfgData.subPackages.push(this.addMainSubPackage)
            }
        },

        removeSubPackage(name: string) {
            for (let i = 0; i < this.mainCfgData.subPackages.length; i++) {
                if (name === this.mainCfgData.subPackages[i]) {
                    this.mainCfgData.subPackages.splice(i, 1)
                }
            }
        },

        onChangeHistoryConfirm(historyUrl: string) {
            this.mainCfgData.remoteUrl = historyUrl
        },

        /** 子包处理 */
        onSubPackageChange(name: string) {
            this.subPackageName = name
            this.subCfgData = CfgUtil.getCfgData(name)
        },

        onSubPackageVersionChange(version: string) {
            this.subCfgData.version = version
        },

        onSubPackageHistoryChange(name: string) {
            this.subCfgData.remoteUrl = name
        },

        onSubPackageBuildDir(name: string) {
            this.subCfgData.buildDir = name
        },

        onSubPackageRemoteDir(name: string) {
            this.subCfgData.remoteDir = name
        },

        onSubPackageRemoteUrlChange(url: string) {
            this.subCfgData.remoteUrl = url
        },

        onSubPackageUpdate() {
            let bFoudHistoryUrl = false
            for (let historyUrl of this.subCfgData.historyUrls) {
                if (historyUrl == this.subCfgData.remoteUrl) {
                    bFoudHistoryUrl = true
                }
            }
            if (!bFoudHistoryUrl) {
                this.subCfgData.historyUrls.push(this.subCfgData.remoteUrl)
            }
            CfgUtil.saveConfig(this.subPackageName, this.subCfgData)
            this.logView += `更新 ${this.subPackageName} 配置成功\n`
        },

        onSubPackageGenerator() {
            generator(this.subPackageName, this.subCfgData)
            let bFoudHistoryUrl = false
            for (let historyUrl of this.subCfgData.historyUrls) {
                if (historyUrl == this.subCfgData.remoteUrl) {
                    bFoudHistoryUrl = true
                }
            }
            if (!bFoudHistoryUrl) {
                this.subCfgData.historyUrls.push(this.subCfgData.remoteUrl)
            }
            CfgUtil.saveConfig(this.subPackageName, this.subCfgData)
            this.logView += `generator ${this.subPackageName} package success!!!\n`
            console.log(`generator ${this.subPackageName} package success!!!`)
        },

        /** 内置asset bundle */
        isBuiltInBundle(name: string) {
            let bundles = ["internal", "main", "resources", "start-scene"]
            return bundles.includes(name)
        },
        walkFile(dirs: any[], handler: any, filters: any, excludeFilters: any, deep: any) {
            if (deep-- <= 0) {
                return;
            }
            for (let dir of dirs) {
                readdirSync(dir).forEach((filename) => {
                    const _path = dir + '/' + filename;
                    const stat = statSync(_path);
                    if (stat && stat.isDirectory()) {
                        this.walkFile([_path], handler, filters, excludeFilters, deep);
                    } else {
                        const info = parse(_path);
                        if (filters.length > 0 && filters.indexOf(info.ext) === -1) {
                            return;
                        }

                        for (let item of excludeFilters) {
                            if (_path.indexOf(item) !== -1) {
                                return;
                            }
                        }

                        if (handler) {
                            handler(_path);
                        }
                    }
                });
            }
        }
    },
});
const panelDataMap = new WeakMap() as WeakMap<object, InstanceType<typeof component>>;
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: readFileSync(join(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        text: '#text',
    },
    methods: {
        hello() {
        },
    },
    ready() {
        if (this.$.app) {
            const vm = new component();
            panelDataMap.set(this, vm);
            vm.$mount(this.$.app);
        }
    },
    beforeClose() { },
    close() {
        const vm = panelDataMap.get(this);
        if (vm) {
            vm.$destroy();
        }
    }
});
