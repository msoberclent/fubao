"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAfterMake = exports.onBeforeMake = exports.onError = exports.unload = exports.onAfterBuild = exports.onAfterCompressSettings = exports.onBeforeCompressSettings = exports.onBeforeBuild = exports.load = exports.throwError = void 0;
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const PACKAGE_NAME = 'piter_assests_decode';
let allAssets = [];
exports.throwError = true;
const load = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.33333333333333`);
        allAssets = yield Editor.Message.request('asset-db', 'query-assets');
    });
};
exports.load = load;
const onBeforeBuild = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
        console.log(`[${PACKAGE_NAME}] onBeforeBuild 666666`);
    });
};
exports.onBeforeBuild = onBeforeBuild;
const onBeforeCompressSettings = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] onBeforeCompressSettings 333333333333`);
        const pkgOptions = options.packages[PACKAGE_NAME];
        // Todo some thing
        console.log('get settings test', result.settings);
    });
};
exports.onBeforeCompressSettings = onBeforeCompressSettings;
const onAfterCompressSettings = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
        console.log(`[${PACKAGE_NAME}] onAfterCompressSettings 333333333333`);
        let packages = options.packages;
        if (packages['piter_assests_decode'].enablePlugins) {
            if (options.platform == "android") {
                nativeBuild(options);
            }
            else if (packages.platform == "ios" || packages.platform == "mac") {
                nativeBuild(options);
            }
            else if (packages.platform == "windows") {
                nativeBuild(options);
            }
            else {
                webBuild(options);
            }
        }
        else {
            console.log("未开启资源加密");
        }
    });
};
exports.onAfterCompressSettings = onAfterCompressSettings;
function webBuild(options) {
    console.log("开启web资源加密");
    let packages = options.packages;
    let versionStr = packages['piter_assests_decode'].version;
    let versionFilePath = Editor.Project.path + "\\build-templates\\web-mobile\\version.js";
    const isMac = process.platform === 'darwin';
    if (isMac) {
        versionFilePath = Editor.Project.path + "/build-templates/web-mobile/version.js";
    }
    let fileStr = "var WebClient = { VERSION:'" + versionStr + "'};   window['WebClient'] = WebClient";
    console.log("version:" + packages['piter_assests_decode'].version);
    console.log(fileStr);
    fs.writeFileSync(versionFilePath, fileStr, "utf-8");
}
/**
 *
 * @param options
 */
function nativeBuild(options) {
    const isMac = process.platform === 'darwin';
    const pythonVersion = isMac ? 'python3' : 'python';
    let pythonPath = Editor.Project.path + "\\extensions\\piter_assests_decode\\cmd\\encrypt.py";
    let argsPath = `${Editor.Project.path}\\build\\${options.outputName}\\assets`;
    if (isMac) {
        pythonPath = Editor.Project.path + "/extensions/piter_assests_decode/cmd/encrypt.py";
        argsPath = `${Editor.Project.path}/build/${options.outputName}/assets`;
    }
    else {
    }
    let pythonCommand = `${pythonVersion} ${pythonPath} ${argsPath}`;
    console.log(pythonCommand);
    (0, child_process_1.exec)(pythonCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error}`);
            return;
        }
        console.log("资源加密完成");
    });
}
const onAfterBuild = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // change the uuid to test
        console.log("onAfterBuild33333333===============================444443");
        if (options.packages) {
            console.log(options);
            console.log("options.packages : " + options.packages[`${PACKAGE_NAME}`].assests_key);
        }
    });
};
exports.onAfterBuild = onAfterBuild;
const unload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.33333333333`);
    });
};
exports.unload = unload;
const onError = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
        console.warn(`${PACKAGE_NAME} run onError3333333333`);
    });
};
exports.onError = onError;
const onBeforeMake = function (root, options) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`onBeforeMake: root: ${root}, options: ${options}3333333333333`);
    });
};
exports.onBeforeMake = onBeforeMake;
const onAfterMake = function (root, options) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`onAfterMake: root: ${root}, options: ${options}3333333333333`);
    });
};
exports.onAfterMake = onAfterMake;
