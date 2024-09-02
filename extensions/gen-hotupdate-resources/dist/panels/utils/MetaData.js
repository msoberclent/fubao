"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaData = void 0;
class UserData {
    constructor(isBundle) {
        this.isBundle = isBundle;
    }
}
class MetaData {
    constructor(ver, isBundle, bundleName) {
        this.ver = ver || "";
        this.bundleName = bundleName || "";
        this.userData = new UserData(isBundle || false);
    }
}
exports.MetaData = MetaData;
