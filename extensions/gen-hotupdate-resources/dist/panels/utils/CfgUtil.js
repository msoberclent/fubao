"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfgUtil = void 0;
const path_1 = __importDefault(require("path"));
const CfgData_1 = require("./CfgData");
const fs_extra_1 = require("fs-extra");
const fs_1 = require("fs");
class CfgUtil {
    static getCfgFile(pkg) {
        return path_1.default.join(Editor.Project.path, `extensions/gen-hotupdate-resources/cfg/${pkg}.json`);
    }
    static getCfgData(pkg) {
        let cfgFile = CfgUtil.getCfgFile(pkg);
        if (!(0, fs_1.existsSync)(cfgFile)) {
            let data = new CfgData_1.CfgData();
            CfgUtil.saveConfig(pkg, data);
            return data;
        }
        else {
            return JSON.parse((0, fs_1.readFileSync)(cfgFile, "utf-8"));
        }
    }
    static saveConfig(pkg, data) {
        let cfgPath = CfgUtil.getCfgFile(pkg);
        (0, fs_extra_1.ensureFileSync)(cfgPath);
        (0, fs_1.writeFileSync)(cfgPath, JSON.stringify(data, null, 4));
    }
}
exports.CfgUtil = CfgUtil;
