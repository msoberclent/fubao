"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfgData = void 0;
class CfgData {
    constructor() {
        this.historyUrls = [];
        this.version = "1";
        this.subPackages = [];
        this.curName = "";
        this.buildDir = "";
        this.remoteUrl = "";
        this.remoteDir = "";
    }
}
exports.CfgData = CfgData;
