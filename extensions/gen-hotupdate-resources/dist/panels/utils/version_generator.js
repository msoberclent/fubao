"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generator = void 0;
const crypto_1 = require("crypto");
const fs_1 = __importStar(require("fs"));
const fs_extra_1 = require("fs-extra");
const path_1 = __importStar(require("path"));
const MetaData_1 = require("./MetaData");
let src = './remote-assets/';
let dest = './remote/';
class Manifest {
    constructor() {
        this.packageUrl = "";
        this.remoteManifestUrl = "";
        this.remoteVersionUrl = "";
        this.version = "";
        this.assets = {};
        this.searchPaths = [];
    }
}
class Versionfest {
    constructor() {
        this.packageUrl = "";
        this.remoteManifestUrl = "";
        this.remoteVersionUrl = "";
        this.version = "";
    }
}
function readDir(dir, obj, cfg) {
    try {
        let stat = fs_1.default.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        let subpaths = fs_1.default.readdirSync(dir);
        for (let i = 0; i < subpaths.length; i++) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            let subpath = (0, path_1.join)(dir, subpaths[i]);
            stat = fs_1.default.statSync(subpath);
            if (stat.isDirectory()) {
                readDir(subpath, obj, cfg);
            }
            else if (stat.isFile()) {
                let size = stat.size;
                let md5 = (0, crypto_1.createHash)('md5').update(fs_1.default.readFileSync(subpath)).digest('hex');
                let compressed = (0, path_1.extname)(subpath).toLowerCase() === '.zip';
                let relv = (0, path_1.relative)(src, subpath);
                relv = relv.replace(/\\/g, '/');
                // relv = relv.replace(cfg.curName, cfg.version);
                relv = encodeURI(relv);
                obj[relv] = {
                    "size": size,
                    "md5": md5
                };
                if (compressed) {
                    obj[relv].compressed = true;
                }
                let index = relv.lastIndexOf("/");
                let subdir = relv.substring(0, index);
                mkdirSync((0, path_1.join)(dest, subdir));
                Editor.Utils.File.copy(subpath, (0, path_1.join)(dest, relv));
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}
function mkdirSync(path) {
    try {
        (0, fs_extra_1.ensureDirSync)(path);
    }
    catch (error) {
        throw "error";
        // if (error.code != 'EEXIST') throw error;
    }
}
function generator(pkg, cfg) {
    console.log('begin to generator resource ', pkg);
    cfg.curName = pkg;
    let manifest = new Manifest();
    manifest.packageUrl = cfg.remoteUrl;
    if (!manifest.packageUrl.endsWith("/")) {
        manifest.packageUrl += "/";
    }
    const rootDir = path_1.default.resolve(__dirname, '../../../../../');
    cfg.buildDir = rootDir + '/' + cfg.buildDir;
    cfg.remoteDir = rootDir + '/' + cfg.remoteDir;
    console.log("rootDir: " + rootDir);
    console.log("buildDir: " + cfg.buildDir);
    console.log("remoteDir: " + cfg.remoteDir);
    manifest.remoteManifestUrl = manifest.packageUrl + 'project.manifest';
    manifest.remoteVersionUrl = manifest.packageUrl + 'version.manifest';
    manifest.version = cfg.version;
    src = cfg.buildDir.trim() + '/';
    dest = cfg.remoteDir.trim() + '/';
    mkdirSync(dest);
    if (pkg === 'main') { // 主包构建
        readDir((0, path_1.join)(src, 'src'), manifest.assets, cfg);
        readDir((0, path_1.join)(src, 'jsb-adapter'), manifest.assets, cfg);
        const assertsDir = (0, path_1.join)(src, "assets");
        let directories = fs_1.default.readdirSync(assertsDir, {
            encoding: "utf-8",
            withFileTypes: true,
        });
        directories.forEach((dir) => {
            if (!dir.isDirectory())
                return;
            if (["internal", "main", "resources", "start-scene"].includes(dir.name)) {
            }
            else {
                const metaPath = (0, path_1.join)(Editor.Project.path, dir.name + ".meta");
                if (!fs_1.default.existsSync(metaPath))
                    return;
                let metaData = new MetaData_1.MetaData();
                let jsonString = fs_1.default.readFileSync(metaPath, { encoding: "utf-8" });
                Object.assign(metaData, JSON.parse(jsonString));
                if (metaData.userData.isBundle) {
                    // 是否需要在主包中构建
                    if (!cfg.subPackages.includes(dir.name))
                        return;
                }
            }
            let pathdir = (0, path_1.join)(src, "assets", dir.name);
            if ((0, fs_1.existsSync)(pathdir)) {
                readDir(pathdir, manifest.assets, cfg);
            }
        });
    }
    else {
        readDir((0, path_1.join)(src, "", pkg), manifest.assets, cfg);
    }
    // readDir(join(src, "assets", pkg), manifest.assets)
    let destManifest = (0, path_1.join)(dest, 'project.manifest');
    let destVersion = (0, path_1.join)(dest, 'version.manifest');
    fs_1.default.writeFileSync(destManifest, JSON.stringify(manifest));
    let versionfest = new Versionfest();
    versionfest.packageUrl = manifest.packageUrl;
    versionfest.remoteVersionUrl = manifest.remoteVersionUrl;
    versionfest.version = manifest.version;
    versionfest.remoteManifestUrl = manifest.remoteManifestUrl;
    fs_1.default.writeFileSync(destVersion, JSON.stringify(versionfest));
}
exports.generator = generator;
