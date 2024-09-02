import path from "path";
import { CfgData } from "./CfgData";
import { ensureFileSync } from "fs-extra";
import { existsSync, readFileSync, writeFileSync } from "fs";

export class CfgUtil {
    static getCfgFile(pkg: string) {
        return path.join(Editor.Project.path, `extensions/gen-hotupdate-resources/cfg/${pkg}.json`)
    }

    static getCfgData(pkg: string): CfgData {
        let cfgFile = CfgUtil.getCfgFile(pkg);
        if (!existsSync(cfgFile)) {
            let data = new CfgData()
            CfgUtil.saveConfig(pkg, data);
            return data
        } else {
            return JSON.parse(readFileSync(cfgFile, "utf-8"))
        }
    }

    static saveConfig(pkg: string, data: CfgData) {
        let cfgPath = CfgUtil.getCfgFile(pkg)
        ensureFileSync(cfgPath)
        writeFileSync(cfgPath, JSON.stringify(data, null, 4))
    }
}
