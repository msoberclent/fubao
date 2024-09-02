import { Component, _decorator, director, game, native, sys } from 'cc';
import { ServerConfig } from '../../Scripts/game/constant/ServerConst';
import Global from '../PiterGlobal';
import { PiterHotUpdateView } from './PiterHotUpdateView';
const { ccclass, property } = _decorator;

@ccclass('PiterHotUpdate')
export class PiterHotUpdate extends Component {

    hotUpdateComp: PiterHotUpdateView;

    private _updating = false;
    private _canRetry = false;
    public _assetsManager: native.AssetsManager = null!;
    private _failCount = 0;

    checkCb(event: any) {
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.hotUpdateComp.showCheckError(event.getEventCode());
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                //最新版本 允许进入游戏
                this.hotUpdateFinish(HotUpdateCode.HOT_UPDATE_PASS);
                this.hotUpdateComp.showCheckError(event.getEventCode());
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                this.hotUpdateComp.showFoundNewVersion(this._assetsManager.getTotalBytes());
                break;
            default:
                return;
        }
        this._assetsManager.setEventCallback(null!);
        this._updating = false;
    }

    updateCb(event: any) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.hotUpdateComp.showUpdateError(event.getEventCode());
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                let data = {
                    percent: event.getPercent(),
                    percentFile: event.getPercentByFile(),
                    donloadedFile: event.getDownloadedFiles(),
                    totalFiles: event.getTotalFiles(),
                    downloadedBytes: event.getDownloadedBytes(),
                    totalBytes: event.getTotalBytes()
                }
                director.emit(`HotUpdateRate`, data);
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.hotUpdateComp.showUpdateError(event.getEventCode());
                failed = true;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.hotUpdateComp.showUpdateError(event.getEventCode());
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                this.hotUpdateComp.showUpdateError(event.getEventCode());
                needRestart = true;
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                this.hotUpdateComp.showUpdateError(event.getEventCode());
                this._updating = false;
                // this._canRetry = true;
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                this.hotUpdateComp.showUpdateError(event.getEventCode());
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                this.hotUpdateComp.showUpdateError(event.getEventCode());
                break;
            default:
                break;
        }

        if (failed) {
            this._assetsManager.setEventCallback(null!);
            this._updating = false;
        }

        if (needRestart) {
            this._assetsManager.setEventCallback(null!);
            this.scheduleOnce(() => {
                game.restart();
            }, 1)
        }
    }

    retry() {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            this._assetsManager.downloadFailedAssets();
        }
    }

    checkUpdate() {
        if (this._updating) {
            return;
        }
        this._assetsManager.setEventCallback(this.checkCb.bind(this));
        this._assetsManager.checkUpdate();
        this._updating = true;
    }

    hotUpdate() {
        // if (this._assetsManager && !this._updating) {
        if (this._assetsManager) {
            this._assetsManager.setEventCallback(this.updateCb.bind(this));
            this._failCount = 0;
            this._assetsManager.update();
            this._updating = true;
        }
    }

    unit8ArrayToString(array: Uint8Array): string {
        let out: string;
        let i: number;
        let len: number;
        let c: number;
        let char2: number;
        let char3: number;
        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
                    break;
            }
        }

        return out;
    }

    /**
     * 加载Manifest
     */
    storagePath;
    loadHotPath: string = "project.manifest";
    async loadManifest(callback) {
        //判断热更新的地址有没有变化
        let localManifestPath = `project.manifest`;
        let localData = native.fileUtils.getStringFromFile(localManifestPath);
        let manifestData = JSON.parse(localData);
        let hotPath = ServerConfig.SERVER_INFO.hot_path;
        if (!ServerConfig.HOT_UP_127) { //固定地址
            callback && callback();
            return;
        }
        // if (manifestData.packageUrl.indexOf(hotPath) > -1) {
        //     callback && callback();
        //     return;
        // }
        this.storagePath = native.fileUtils.getWritablePath() + "game-remote-asset/" + ServerConfig.SERVER_INFO.verion_key;
        let manifestPath = this.storagePath + "/project.manifest";
        // if (!ServerConfig.DOS_SAFE) {
        //     if (native.fileUtils.isFileExist(manifestPath)) {
        //         let tempFile = native.fileUtils.getStringFromFile(manifestPath);
        //         let tempFileData = JSON.parse(tempFile);
        //         if (tempFileData.version == manifestData.version) {
        //             this.loadHotPath = manifestPath;
        //             callback && callback();
        //             return;
        //         }
        //     }
        // }
        !native.fileUtils.isDirectoryExist(this.storagePath) && native.fileUtils.createDirectory(this.storagePath);
        let removeOld = native.fileUtils.removeFile(manifestPath);
        let packageUrl = this.replacePath(manifestData.packageUrl, hotPath);
        let remoteManifestUrl = this.replacePath(manifestData.remoteManifestUrl, hotPath);
        let remoteVersionUrl = this.replacePath(manifestData.remoteVersionUrl, hotPath);
        manifestData.packageUrl = packageUrl;
        manifestData.remoteManifestUrl = remoteManifestUrl;
        manifestData.remoteVersionUrl = remoteVersionUrl;
        let createNew = native.fileUtils.writeStringToFile(JSON.stringify(manifestData), manifestPath);
        //远程的
        this.loadHotPath = manifestPath;
        // if (ServerConfig.DOS_SAFE) {
        let remoteRes = ServerConfig.LAST_REMOTE_INFO;
        remoteRes.packageUrl = this.replacePath(remoteRes.packageUrl, hotPath);
        remoteRes.remoteManifestUrl = this.replacePath(remoteRes.remoteManifestUrl, hotPath);
        remoteRes.remoteVersionUrl = this.replacePath(remoteRes.remoteVersionUrl, hotPath);
        let manifestPath2 = this.storagePath + "/new_project.manifest";
        let createNew1 = native.fileUtils.writeStringToFile(JSON.stringify(remoteRes), manifestPath2);
        callback && callback(manifestPath2);
        // } else {
        // callback && callback();
        // }
    }


    private async getRemoteInfo(remoteStr) {
        let remoteRes = await Global.HTTP.sendGetRequestAsync(remoteStr, null);
        if (remoteRes.code) {
            return this.getRemoteInfo(remoteStr);
        }
        remoteRes.packageUrl = this.replacePath(remoteRes.packageUrl, ServerConfig.SERVER_INFO.hot_path);
        remoteRes.remoteManifestUrl = this.replacePath(remoteRes.remoteManifestUrl, ServerConfig.SERVER_INFO.hot_path);
        remoteRes.remoteVersionUrl = this.replacePath(remoteRes.remoteVersionUrl, ServerConfig.SERVER_INFO.hot_path);
        let manifestPath2 = this.storagePath + "/new_project.manifest";
        let createNew1 = native.fileUtils.writeStringToFile(JSON.stringify(remoteRes), manifestPath2);
    }

    public replacePath(oldPath: string, newPath: string) {
        let pathArr = oldPath.split("/");
        if (sys.os == sys.OS.ANDROID) {
            return newPath + `/android/${pathArr[pathArr.length - 1]}`;
        } else if (sys.os == sys.OS.IOS) {
            return newPath + `/ios/${pathArr[pathArr.length - 1]}`;
        }
        return oldPath;
    }

    // use this for initialization
    async startHotUpdate() {
        // Hot update is only available in Native build
        if (!sys.isNative) {
            return;
        }
        this.hotUpdateComp = this.node.getComponent(PiterHotUpdateView);

        const writablePath = native.fileUtils.getWritablePath();

        this.loadManifest((manifestPath2) => {
            const manifestUrl = this.loadHotPath
            // 'project.manifest';
            // Init with empty manifest url for testing custom manifest
            this._assetsManager = new native.AssetsManager(manifestUrl, `${writablePath}/hotupdate_storage`);
            // JSON.stringify(remoteRes)
            if (manifestPath2) {
                this._assetsManager.loadRemoteManifest(new native.Manifest(manifestPath2));
                ServerConfig.LAST_REMOTE_INFO = null;
            }
            let str = "RELEASE.";
            if (CC_DEBUG) {
                str = "TEST.";

            }
            Global.VERSION.CLIENT = str + this._assetsManager.getLocalManifest().getVersion();

            this.hotUpdateComp.showClientVersion();
            // Setup the verification callback, but we don't have md5 check function yet, so only print some message
            // Return true if the verification passed, otherwise return false
            this._assetsManager.setVerifyCallback(function (path: string, asset: any) {
                // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
                var compressed = asset.compressed;
                // Retrieve the correct md5 value.
                var expectedMD5 = asset.md5;
                // asset.path is relative path and path is absolute.
                var relativePath = asset.path;
                // The size of asset file, but this value could be absent.
                var size = asset.size;
                if (compressed) {
                    return true;
                }
                else {
                    return true;
                }
            });
        });
    }

    onDestroy() {
        this._assetsManager.setEventCallback(null!);
    }


    public hotUpdateFinish(code: number) {
        director.emit('HotUpdateFinish', code);
    }
}


export enum HotUpdateCode {
    HOT_UPDATE_PASS = 0, //更新完成或者不需要更新
    HOT_UPDATE_ERROR = -1
}
