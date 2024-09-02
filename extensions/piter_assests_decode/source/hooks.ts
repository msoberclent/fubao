import { exec } from 'child_process';
import { BuildHook, IBuildResult, IBuildTaskOption } from '../@types';
const fs = require("fs-extra");
interface IOptions {
    enablePlugins: boolean;
    assests_key: string;
    assests_secret: string;
}

const PACKAGE_NAME = 'piter_assests_decode';

interface ITaskOptions extends IBuildTaskOption {
    packages: {
        'cocos-plugin-template': IOptions;
    };
}

let allAssets = [];

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function () {
    console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.33333333333333`);
    allAssets = await Editor.Message.request('asset-db', 'query-assets');
};

export const onBeforeBuild: BuildHook.onBeforeBuild = async function (options: ITaskOptions, result: IBuildResult) {
    // Todo some thing
    console.log(`[${PACKAGE_NAME}] onBeforeBuild 666666`);
};

export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function (options: ITaskOptions, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] onBeforeCompressSettings 333333333333`);
    const pkgOptions = options.packages[PACKAGE_NAME];
    // Todo some thing
    console.log('get settings test', result.settings);
};

export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function (options: ITaskOptions, result: IBuildResult) {
    // Todo some thing
    console.log(`[${PACKAGE_NAME}] onAfterCompressSettings 333333333333`);
    let packages = options.packages as any;
    if (packages['piter_assests_decode'].enablePlugins) {
        if (options.platform == "android") {
            nativeBuild(options);
        } else if (packages.platform == "ios" || packages.platform == "mac") {
            nativeBuild(options);
        } else if (packages.platform == "windows") {
            nativeBuild(options);
        } else {
            webBuild(options);
        }
    } else {
        console.log("未开启资源加密");
    }
};


function webBuild(options: ITaskOptions) {
    console.log("开启web资源加密");
    let packages = options.packages as any;
    let versionStr = packages['piter_assests_decode'].version;
    let versionFilePath = Editor.Project.path + "\\build-templates\\web-mobile\\version.js"
    const isMac = process.platform === 'darwin';
    if (isMac) {
        versionFilePath = Editor.Project.path + "/build-templates/web-mobile/version.js"
    }
    let fileStr = "var WebClient = { VERSION:'" + versionStr + "'};   window['WebClient'] = WebClient";
    console.log("version:" + packages['piter_assests_decode'].version)
    console.log(fileStr);
    fs.writeFileSync(versionFilePath, fileStr, "utf-8");

}

/**
 * 
 * @param options 
 */
function nativeBuild(options: ITaskOptions) {
    const isMac = process.platform === 'darwin';
    const pythonVersion = isMac ? 'python3' : 'python';
    let pythonPath = Editor.Project.path + "\\extensions\\piter_assests_decode\\cmd\\encrypt.py";
    let argsPath = `${Editor.Project.path}\\build\\${options.outputName}\\assets`
    if (isMac) {
        pythonPath = Editor.Project.path + "/extensions/piter_assests_decode/cmd/encrypt.py";
        argsPath = `${Editor.Project.path}/build/${options.outputName}/assets`;
    } else {

    }
    let pythonCommand = `${pythonVersion} ${pythonPath} ${argsPath}`;
    console.log(pythonCommand)
    exec(pythonCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error}`);
            return;
        }
        console.log("资源加密完成")
    });
}

export const onAfterBuild: BuildHook.onAfterBuild = async function (options: ITaskOptions, result: IBuildResult) {
    // change the uuid to test
    console.log("onAfterBuild33333333===============================444443")
    if (options.packages) {
        console.log(options)
        console.log("options.packages : " + options.packages[`${PACKAGE_NAME}`].assests_key);
    }
};





export const unload: BuildHook.unload = async function () {
    console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.33333333333`);
};

export const onError: BuildHook.onError = async function (options, result) {
    // Todo some thing
    console.warn(`${PACKAGE_NAME} run onError3333333333`);
};

export const onBeforeMake: BuildHook.onBeforeMake = async function (root, options) {
    console.log(`onBeforeMake: root: ${root}, options: ${options}3333333333333`);
};

export const onAfterMake: BuildHook.onAfterMake = async function (root, options) {
    console.log(`onAfterMake: root: ${root}, options: ${options}3333333333333`);
};
