import { createHash } from "crypto";
import fs, { existsSync } from "fs";
import { ensureDirSync } from "fs-extra";
import path, { extname, join, relative } from "path";
import { CfgData } from "./CfgData";
import { MetaData } from "./MetaData";

let src = './remote-assets/';
let dest = './remote/'

class Manifest {
    packageUrl: string = ""
    remoteManifestUrl: string = ""
    remoteVersionUrl: string = ""
    version: string = ""
    assets: Object = {}
    searchPaths: string[] = []
}

class Versionfest {
    packageUrl: string = ""
    remoteManifestUrl: string = ""
    remoteVersionUrl: string = ""
    version: string = ""
}

function readDir(dir: string, obj: any, cfg: CfgData) {
    try {
        let stat = fs.statSync(dir)
        if (!stat.isDirectory()) {
            return
        }
        let subpaths = fs.readdirSync(dir)
        for (let i = 0; i < subpaths.length; i++) {
            if (subpaths[i][0] === '.') {
                continue
            }
            let subpath = join(dir, subpaths[i])
            stat = fs.statSync(subpath)
            if (stat.isDirectory()) {
                readDir(subpath, obj, cfg)
            } else if (stat.isFile()) {
                let size = stat.size
                let md5 = createHash('md5').update(fs.readFileSync(subpath)).digest('hex')
                let compressed = extname(subpath).toLowerCase() === '.zip'
                let relv = relative(src, subpath)
                relv = relv.replace(/\\/g, '/')
                // relv = relv.replace(cfg.curName, cfg.version);
                relv = encodeURI(relv)
                obj[relv] = {
                    "size": size,
                    "md5": md5
                }
                if (compressed) {
                    obj[relv].compressed = true
                }
                let index = relv.lastIndexOf("/")
                let subdir = relv.substring(0, index)
                mkdirSync(join(dest, subdir))
                Editor.Utils.File.copy(subpath, join(dest, relv))
            }
        }
    } catch (error) {
        console.error(error)
    }
}

function mkdirSync(path: string) {
    try {
        ensureDirSync(path)
    } catch (error) {
        throw "error"
        // if (error.code != 'EEXIST') throw error;
    }
}

export function generator(pkg: string, cfg: CfgData) {
    console.log('begin to generator resource ', pkg)
    cfg.curName = pkg
    let manifest = new Manifest()
    manifest.packageUrl = cfg.remoteUrl
    if (!manifest.packageUrl.endsWith("/")) {
        manifest.packageUrl += "/"
    }
    const rootDir = path.resolve(__dirname, '../../../../../');
    cfg.buildDir = rootDir + '/' + cfg.buildDir
    cfg.remoteDir = rootDir + '/' +  cfg.remoteDir
    console.log("rootDir: " + rootDir)
    console.log("buildDir: " + cfg.buildDir)
    console.log("remoteDir: " + cfg.remoteDir)
    manifest.remoteManifestUrl = manifest.packageUrl + 'project.manifest';
    manifest.remoteVersionUrl = manifest.packageUrl + 'version.manifest';
    manifest.version = cfg.version
    src = cfg.buildDir.trim() + '/';
    dest = cfg.remoteDir.trim() + '/';
    mkdirSync(dest)
    if (pkg === 'main') { // 主包构建
        readDir(join(src, 'src'), manifest.assets, cfg)
        readDir(join(src, 'jsb-adapter'), manifest.assets, cfg)
        const assertsDir = join(src, "assets")
        let directories = fs.readdirSync(assertsDir, {
            encoding: "utf-8",
            withFileTypes: true,
        })
        directories.forEach((dir) => {
            if (!dir.isDirectory()) return
            if (["internal", "main", "resources", "start-scene"].includes(dir.name)) {
            } else {
                const metaPath = join(Editor.Project.path, dir.name + ".meta")
                if (!fs.existsSync(metaPath)) return
                let metaData = new MetaData()
                let jsonString = fs.readFileSync(metaPath, { encoding: "utf-8" })
                Object.assign(metaData, JSON.parse(jsonString))
                if (metaData.userData.isBundle) {
                    // 是否需要在主包中构建
                    if (!cfg.subPackages.includes(dir.name)) return
                }
            }
            let pathdir = join(src, "assets", dir.name)
            if (existsSync(pathdir)) {
                readDir(pathdir, manifest.assets, cfg)
            }
        })
    } else {
        readDir(join(src, "", pkg), manifest.assets, cfg)
    }
    // readDir(join(src, "assets", pkg), manifest.assets)
    let destManifest = join(dest, 'project.manifest')
    let destVersion = join(dest, 'version.manifest')

    fs.writeFileSync(destManifest, JSON.stringify(manifest))

    let versionfest = new Versionfest()
    versionfest.packageUrl = manifest.packageUrl
    versionfest.remoteVersionUrl = manifest.remoteVersionUrl
    versionfest.version = manifest.version
    versionfest.remoteManifestUrl = manifest.remoteManifestUrl

    fs.writeFileSync(destVersion, JSON.stringify(versionfest))
}
