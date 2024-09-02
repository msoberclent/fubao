import { JsonAsset } from "cc";
import { resources } from "cc";

export class ExcelManager {

    public static preUrl: string = "excel/"
    public static jsonMap: Map<string, any> = new Map<string, any>();

    /**
     * 获取excel数据
     * @param tabelName 
     * @param id 
     */
    public static getConfigById<T>(tabelName: string, id: number | string): T {
        let table = this.jsonMap.get(tabelName);
        if (!table) {
            table = this.loadTable(tabelName)
        }
        return table[id];
    }

    /**
    * 获取excel数据
    * @param tabelName 
    * @param id 
    */
    public static getConfigList(tabelName: string) {
        let table = this.jsonMap.get(tabelName);
        if (!table) {
            table = this.loadTable(tabelName)
        }
        return table;
    }

    /**
    * 获取excel数据
    * @param tabelName 
    * @param id 
    */
    public static getConfigToList(tabelName: string) {
        let table = this.jsonMap.get(tabelName);
        if (!table) {
            table = this.loadTable(tabelName)
        }
        return _.values(table);
    }

    /**
     * 
     * @param tabelName 加载table数据
     */
    public static loadTable(tabelName: string) {
        let tableData = resources.get(this.preUrl + tabelName, JsonAsset) as JsonAsset;
        if (!tableData) {
            console.warn("table : " + tabelName + " not loaded ");
            return null;
        }
        let jsonData = tableData.json;
        this.jsonMap.set(tabelName, jsonData);
        return jsonData;
    }


    /**
    * 获取excel数据
    * @param tabelName 
    * @param id 
    */
    public static getConfigByKey(tabelName: string, keyName: number | string, keyValue: number | string) {
        let table = this.jsonMap.get(tabelName);
        if (!table) {
            table = this.loadTable(tabelName)
        }
        for (let key in table) {
            if (table[key][keyName] == keyValue) {
                return table[key][keyName]
            }
        }
        return null;
    }

    /**
    * 查询sql
    */
    public static getConfigBySql2List(tabelName: string, sql: string) {
        let result = [];
        let table = this.jsonMap.get(tabelName);
        if (!table) {
            table = this.loadTable(tabelName)
        }
        let sqlArr = sql.split(`|and|`);
        for (let key in table) {
            let val = table[key];
            if (this.checkSqlIsPath(sqlArr, val)) {
                result.push(val);
            }
        }
        return result;
        //sql key1=value1|and|key2=value2
    }


    /**
     * 查询sql
     */
    public static getConfigBySql(tabelName: string, sql: string) {
        let table = this.jsonMap.get(tabelName);
        if (!table) {
            table = this.loadTable(tabelName)
        }
        let sqlArr = sql.split(`|and|`);
        for (let key in table) {
            let val = table[key];
            if (this.checkSqlIsPath(sqlArr, val)) {
                return val;
            }
        }
        return null;
        //sql key1=value1|and|key2=value2
    }

    public static checkSqlIsPath(sqlArr: string[], object: any) {
        for (let i = 0; i < sqlArr.length; i++) {
            let sqlItem = sqlArr[i].split("=");
            let keyName = sqlItem[0];
            if (object[keyName] != sqlItem[1]) {
                return false
            }
        }
        return true;
    }



}