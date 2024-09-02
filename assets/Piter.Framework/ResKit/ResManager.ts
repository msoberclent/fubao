
import { Asset, AssetManager, Component, Constructor, SpriteFrame, __private, _decorator, assetManager, error, isValid, js, resources } from 'cc';
import Global from '../PiterGlobal';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ResManager
 * DateTime = Wed Jan 26 2022 10:50:31 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * FileBasename = ResManager.ts
 * FileBasenameNoExtension = ResManager
 * URL = db://assets/Piter.Framework/ResKit/ResManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

type ProgressCallback = __private._cocos_asset_asset_manager_deprecated__LoadProgressCallback;
type CompleteCallback<T = any> = any;       // (error: Error | null, asset: T) => void;  (error: Error | null, asset: T[], urls: string[]) => void;
type IRemoteOptions = { [k: string]: any; ext?: string; } | null;
type AssetType<T = Asset> = Constructor<T>;

interface ILoadResArgs<T extends Asset> {
    bundle?: string;
    dir?: string;
    paths: string | string[];
    type: AssetType<T> | null;
    onProgress: ProgressCallback | null;
    onComplete: CompleteCallback<T> | null;
}


@ccclass('ResManager')
export class ResManager extends Component {

    start() {
        Global.RES = this;
    }

    /** 全局默认加载的资源包名 */
    defaultBundleName: string = "main";

    /**
     * 加载远程资源
     * @param url           资源地址
     * @param options       资源参数，例：{ ext: ".png" }
     * @param onComplete    加载完成回调
     * @example
    var opt: IRemoteOptions = { ext: ".png" };
    var onComplete = (err: Error | null, data: ImageAsset) => {
        const texture = new Texture2D();
        texture.image = data;
        
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        
        var sprite = this.sprite.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
    }
    oops.res.loadRemote<ImageAsset>(this.url, opt, onComplete);
        */
    loadRemote<T extends Asset>(url: string, options: IRemoteOptions | null, onComplete?: CompleteCallback<T> | null): void;
    loadRemote<T extends Asset>(url: string, onComplete?: CompleteCallback<T> | null): void;
    loadRemote<T extends Asset>(url: string, ...args: any): void {
        var options: IRemoteOptions | null = null;
        var onComplete: CompleteCallback<T> | null = null;
        if (args.length == 2) {
            options = args[0];
            onComplete = args[1];
        }
        else {
            onComplete = args[0];
        }
        assetManager.loadRemote<T>(url, options, onComplete);
    }

    /**
     * 加载资源包
     * @param url       资源地址
     * @param complete  完成事件
     * @param v         资源MD5版本号
     * @example
        var serverUrl = "http://192.168.1.8:8080/";         // 服务器地址
        var md5 = "8e5c0";                                  // Cocos Creator 构建后的MD5字符
        await oops.res.loadBundle(serverUrl,md5);
     */
    loadBundle(url: string, v?: string) {
        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(url, { version: v }, (err, bundle: AssetManager.Bundle) => {
                if (err) {
                    return error(err);
                }
                resolve(bundle);
            });
        });
    }

    /**
     * 加载一个资源
     * @param bundleName    远程包名
     * @param paths         资源路径
     * @param type          资源类型
     * @param onProgress    加载进度回调
     * @param onComplete    加载完成回调
     * @example
     */
    load<T extends Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    load<T extends Asset>(bundleName: string, paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    load<T extends Asset>(bundleName: string, paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
    load<T extends Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): void;
    load<T extends Asset>(paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    load<T extends Asset>(paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    load<T extends Asset>(paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
    load<T extends Asset>(paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): void;
    load<T extends Asset>(
        bundleName: string,
        paths?: string | string[] | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback | null,
    ) {
        let args: ILoadResArgs<T> | null = null;
        if (typeof paths === "string" || paths instanceof Array) {
            args = this.parseLoadResArgs(paths, type, onProgress, onComplete);
            args.bundle = bundleName;
        }
        else {
            args = this.parseLoadResArgs(bundleName, paths, type, onProgress);
            args.bundle = this.defaultBundleName;
        }
        this.loadByArgs(args);
    }

    loadAsync<T extends Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    loadAsync<T extends Asset>(bundleName: string, paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    loadAsync<T extends Asset>(bundleName: string, paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
    loadAsync<T extends Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): void;
    loadAsync<T extends Asset>(paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    loadAsync<T extends Asset>(paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    loadAsync<T extends Asset>(paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
    loadAsync<T extends Asset>(paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): void;
    loadAsync<T extends Asset>(
        bundleName: string,
        paths?: string | string[] | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
    ) {
        return new Promise((resolve, reject) => {
            this.load(bundleName, paths, type, (err: Error | null, asset: Asset) => {
                if (err) {
                    error(err.message);
                }
                resolve(asset)
            });
        });
    }

    /**
     * 加载文件夹中的资源
     * @param bundleName    远程包名
     * @param dir           文件夹名
     * @param type          资源类型
     * @param onProgress    加载进度回调
     * @param onComplete    加载完成回调
     * @example
    // 加载进度事件
    var onProgressCallback = (finished: number, total: number, item: any) => {
    }
    
    // 加载完成事件
    var onCompleteCallback = () => {
    }
    oops.res.loadDir("game", onProgressCallback, onCompleteCallback);
     */
    loadDir<T extends Asset>(bundleName: string, dir: string, type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    loadDir<T extends Asset>(bundleName: string, dir: string, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    loadDir<T extends Asset>(bundleName: string, dir: string, onComplete?: CompleteCallback<T[]> | null): void;
    loadDir<T extends Asset>(bundleName: string, dir: string, type: AssetType<T> | null, onComplete?: CompleteCallback<T[]> | null): void;
    loadDir<T extends Asset>(dir: string, type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    loadDir<T extends Asset>(dir: string, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    loadDir<T extends Asset>(dir: string, onComplete?: CompleteCallback<T[]> | null): void;
    loadDir<T extends Asset>(dir: string, type: AssetType<T> | null, onComplete?: CompleteCallback<T[]> | null): void;
    loadDir<T extends Asset>(
        bundleName: string,
        dir?: string | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback | null,
    ) {
        let args: ILoadResArgs<T> | null = null;
        if (typeof dir === "string") {
            args = this.parseLoadResArgs(dir, type, onProgress, onComplete);
            args.bundle = bundleName;
        }
        else {
            args = this.parseLoadResArgs(bundleName, dir, type, onProgress);
            args.bundle = this.defaultBundleName;
        }
        args.dir = args.paths as string;
        this.loadByArgs(args);
    }

    /**
     * 通过资源相对路径释放资源
     * @param path          资源路径
     * @param bundleName    远程资源包名
     */
    release(path: string, bundleName?: string) {
        if (bundleName == null) bundleName = this.defaultBundleName;

        var bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            var asset = bundle.get(path);
            if (asset) {
                this.releasePrefabtDepsRecursively(asset._uuid);
            }
        }
    }

    /**
     * 通过相对文件夹路径删除所有文件夹中资源
     * @param path          资源文件夹路径
     * @param bundleName    远程资源包名
     */
    releaseDir(path: string, bundleName?: string) {
        if (bundleName == null) bundleName = this.defaultBundleName;

        var bundle: AssetManager.Bundle | null = assetManager.getBundle(bundleName);
        if (bundle) {
            var infos = bundle.getDirWithPath(path);
            if (infos) {
                infos.map((info) => {
                    this.releasePrefabtDepsRecursively(info.uuid);
                });
            }

            if (path == "" && bundleName != "resources") {
                assetManager.removeBundle(bundle);
            }
        }
    }

    /** 释放预制依赖资源 */
    private releasePrefabtDepsRecursively(uuid: string) {
        var asset = assetManager.assets.get(uuid)!;
        assetManager.releaseAsset(asset);
    }

    public checkHasRES(url: string) {
        let bundle = this.findResBundle(url);
        return bundle != null;
    }

    /**
     * 获取资源
     * @param path          资源路径
     * @param type          资源类型
     * @param bundleName    远程资源包名
     */
    get<T extends Asset>(path: string, type?: __private._types_globals__Constructor<T> | null, bundleName?: string): T | null {
        if (bundleName == null) bundleName = this.defaultBundleName;

        var bundle: AssetManager.Bundle = assetManager.getBundle(bundleName)!;
        return bundle.get(path, type);
    }

    /** 打印缓存中所有资源信息 */
    dump() {
        assetManager.assets.forEach((value: Asset, key: string) => {
        })
    }

    private parseLoadResArgs<T extends Asset>(
        paths: string | string[],
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onComplete?: ProgressCallback | CompleteCallback | null
    ) {
        let pathsOut: any = paths;
        let typeOut: any = type;
        let onProgressOut: any = onProgress;
        let onCompleteOut: any = onComplete;
        if (onComplete === undefined) {
            const isValidType = js.isChildClassOf(type as AssetType, Asset);
            if (onProgress) {
                onCompleteOut = onProgress as CompleteCallback;
                if (isValidType) {
                    onProgressOut = null;
                }
            }
            else if (onProgress === undefined && !isValidType) {
                onCompleteOut = type as CompleteCallback;
                onProgressOut = null;
                typeOut = null;
            }
            if (onProgress !== undefined && !isValidType) {
                onProgressOut = type as ProgressCallback;
                typeOut = null;
            }
        }
        return { paths: pathsOut, type: typeOut, onProgress: onProgressOut, onComplete: onCompleteOut };
    }

    private loadByBundleAndArgs<T extends Asset>(bundle: AssetManager.Bundle, args: ILoadResArgs<T>): void {
        if (args.dir) {
            bundle.loadDir(args.paths as string, args.type, args.onProgress, args.onComplete);
        }
        else {
            if (typeof args.paths == 'string') {
                bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            }
            else {
                bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            }
        }
    }

    private loadByArgs<T extends Asset>(args: ILoadResArgs<T>) {
        if (args.bundle) {
            if (assetManager.bundles.has(args.bundle)) {
                let bundle = assetManager.bundles.get(args.bundle);
                this.loadByBundleAndArgs(bundle!, args);
            }
            else {
                // 自动加载bundle
                assetManager.loadBundle(args.bundle, (err, bundle) => {
                    if (!err) {
                        this.loadByBundleAndArgs(bundle, args);
                    }
                })
            }
        }
        else {
            this.loadByBundleAndArgs(resources, args);
        }
    }

    //---------------------------自己写的------------------------------------

    private bundleResGroup: { [key: string]: BundleResItem } = {};

    public async loadBundleConfigs(bundleNames: string[]) {
        for (let bundleName of bundleNames) {
            await this.loadBundleConfig(bundleName);
        }
    }

    public async loadBundleConfig(bundleName: string) {
        if (!this.bundleResGroup[bundleName]) {
            let bundle = await this.loadBundle(bundleName);
            this.bundleResGroup[bundle.name] = {
                bundle: bundle,
                dirs: {},
                pathMap: bundle[`_config`].paths._map
            }
        }
    }


    public findAssetInfoByUUID(uuid: string): AssetInfo {
        for (let key in this.bundleResGroup) {
            let bundleItem = this.bundleResGroup[key];
            let assetInfo = bundleItem.bundle['_config'].assetInfos._map[uuid] as AssetInfo;
            if (assetInfo) {
                return assetInfo;
            }
        }
        return null;
    }


    public async loadDirAsync(bundleName: string, dirName: string): Promise<Asset[]> {
        return new Promise((resolve, reject) => {
            this.loadDir(bundleName, dirName, (err, dir) => {
                if (err) {
                    reject(`load ${bundleName} error`);
                    return;
                }
                resolve(dir);
            })
        })
    }


    public async preloadDirAsync(bundleItem: BundleResItem, dirName: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            bundleItem.bundle.preloadDir(dirName, (err, dir) => {
                if (err) {
                    reject(`load ${dirName} error`);
                    return;
                }
                resolve(dir);
            })
        })
    }


    /**
     * 预先加载Bundle下的res
     * @param bundleName 
     * @param dirs 
     */
    public async preloadBundleDirs(bundleName: string, dirs: string[]) {
        await this.loadBundleConfig(bundleName);
        let assets = [];
        let bundleItem = this.bundleResGroup[bundleName];
        for (let dirName of dirs) {
            let res = bundleItem.bundle.getDirWithPath(dirName);
            assets = assets.concat(res);
        }
        for (let i = 0; i < assets.length; i++) {
            let type = assets[i].ctor as any;
            await this.preLoadAsset(bundleItem.bundle, assets[i].path, type, null);
        }
    }

    /**
     * 加载Bundle下的文件夹
     * @param bundleName 
     * @param dirs 
     * @param onProgress 
     * @param onComplete 
     */
    public async loadBundleDirs(bundleName: string, dirs: string[], onProgress?: Function, onComplete?: Function) {
        await this.loadBundleConfig(bundleName);
        let assets = [];
        let bundleItem = this.bundleResGroup[bundleName];
        for (let dirName of dirs) {
            let res = bundleItem.bundle.getDirWithPath(dirName);
            assets = assets.concat(res);
        }
        await this.loadAssets(assets, onProgress, onComplete);
    }

    public getAsset<T extends Asset>(url: string, assetType?: typeof Asset, bundleName?: string): T {
        let findBundle: BundleResItem;
        if (bundleName) {
            findBundle = this.bundleResGroup[bundleName];
        } else {
            for (let key in this.bundleResGroup) {
                let bundleItem = this.bundleResGroup[key];
                if (bundleItem.pathMap[url]) {
                    findBundle = this.bundleResGroup[key];
                    break;
                }
            }
        }
        if (findBundle) {
            return findBundle.bundle.get(url, assetType) as T;
        }
        return null;
    }

    /**
     * 根据3.0版本特变转换
     */
    private changeUrlByAssetType(url: string, assetType: typeof Asset) {
        if (assetType === SpriteFrame && url.indexOf("/spriteFrame") == -1) {
            url += "/spriteFrame";
        }
        return url
    }


    /**从resources目录加载asset*/
    private async preLoadAsset<T extends Asset>(bundle: AssetManager.Bundle, url: string, assetType?: typeof Asset, callback?: Function): Promise<any> {
        return await new Promise((resolve) => {
            let assetRes = bundle.get(url, assetType) as T;
            if (assetRes && isValid(assetRes)) { // 资源有了直接返回
                resolve(assetRes);
                callback && callback(assetRes);
                return;
            }
            bundle.preload(url, assetType);
            resolve(true)
            return;
        });
    }

    public async loadI18NAsset<T extends Asset>(dirName: string, resUrl: string, assetType?: typeof Asset, callback?: Function): Promise<T> {
        let url = `${dirName}/res/language/${Global.LANG.curLang}/${resUrl}`;
        return await this.loadAsset(url, assetType, callback);
    }


    /**从resources目录加载asset*/
    public async loadAsset<T extends Asset>(url: string, assetType?: typeof Asset, callback?: Function): Promise<T> {
        url = this.changeUrlByAssetType(url, assetType);
        return await new Promise((resolve) => {
            let findBundle: BundleResItem;
            for (let key in this.bundleResGroup) {
                let bundleItem = this.bundleResGroup[key];
                if (bundleItem.pathMap[url]) {
                    findBundle = this.bundleResGroup[key];
                    break;
                }
            }
            if (!findBundle) {
                console.warn(`${url} not found`);
                callback && callback(null);
                return;
            }
            let bundle = findBundle.bundle;
            let assetRes = bundle.get(url, assetType) as T;
            if (assetRes && isValid(assetRes)) { // 资源有了直接返回
                resolve(assetRes);
                callback && callback(assetRes);
                return;
            }
            bundle.load(url, assetType, (error, asset: T) => {
                if (error) {
                    console.error("load Res " + url + " error: " + error);
                }
                else {
                    // asset.addRef();
                }
                resolve(asset);
                callback && callback(asset);
            });
        });
    }



    public async loadAssets(assets: AssetInfo[], onProgress: Function, onComplete: Function) {
        return new Promise((res, rej) => {
            let totalRes = assets.length;
            if (totalRes < 1) {
                onComplete && onComplete();
                res(true)
                return;
            }
            let loaded = 0;
            for (let i = 0; i < assets.length; i++) {
                this.loadAsset(assets[i].path, assets[i].ctor, () => {
                    loaded++;
                    if (onProgress) {
                        onProgress(loaded, totalRes);
                    }
                    if (totalRes == loaded) {
                        res(true)
                        onComplete && onComplete();
                    }
                })
            }
        })
    }

    public async loadGroupByBack(groups: string[]) {
        let resUrls = this.getGroupAssetUrl(groups);
        let totalRes = resUrls.length;
        if (totalRes < 1) {
            return;
        }
        for (let i = 0; i < resUrls.length; i++) {
            this.loadAsset(resUrls[i], Asset);
        }
    }


    private findResBundle(resUrl: string): BundleResItem {
        let findBundle: BundleResItem;
        for (let key in this.bundleResGroup) {
            let bundleItem = this.bundleResGroup[key];
            if (bundleItem.pathMap[resUrl]) {
                findBundle = this.bundleResGroup[key];
                break;
            }
        }
        return findBundle;
    }

    /** 
     * 销毁资源
     * @param groups 
     */
    public destroyGroup(groups: string[]) {
        for (let i = 0; i < groups.length; i++) {
            let bundle = assetManager.getBundle(groups[i]);
            if (bundle) {
                let assetInfo = bundle['config'].assetInfos
                let map = assetInfo["_map"];
                for (let key in map) {
                    let value = map[key] as any;
                    bundle.release(value.path, value.ctor);
                }
                assetManager.removeBundle(bundle)
                delete this.bundleResGroup[bundle.name]
            }
        }
    }

    private getGroupAssetUrl(groups: string[]) {
        let resGroupUrl: string[] = [];
        for (let i = 0; i < groups.length; i++) {
            let resConfig = this.bundleResGroup[groups[i]];
            if (resConfig) {
                resGroupUrl = resGroupUrl.concat(_.keys(resConfig.pathMap))
            }
        }
        return _.uniq(resGroupUrl);
    }


    /**
     * 加载资源组 必须为bundle
     * @param groups 
     * @param onProgress 
     * @param onComplete 
     */
    public async loadGroup(groups: string[], onProgress: Function, onComplete: Function) {
        await this.loadBundleConfigs(groups);
        let resUrls = this.getGroupAssetUrl(groups);
        let totalRes = resUrls.length;
        if (totalRes < 1) {
            onComplete && onComplete();
            return;
        }
        let loaded = 0;
        for (let i = 0; i < resUrls.length; i++) {
            this.loadAsset(resUrls[i], Asset, () => {
                loaded++;
                if (onProgress) {
                    onProgress(loaded, totalRes);
                }
                if (totalRes == loaded) {
                    onComplete && onComplete();
                }
            })
        }

    }
}


export interface BundleResItem {

    bundle: AssetManager.Bundle;

    dirs: any;

    pathMap: any;
}


export interface AssetInfo {

    ctor: any;

    path: string;

    uuid: string;
}
