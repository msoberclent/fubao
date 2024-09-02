import { sys } from 'cc';
/**
 * Predefined variables
 * Name = LocalStorageData
 * DateTime = Mon Oct 18 2021 11:41:05 GMT+0800 (中国标准时间)
 * Author = lmc199393
 * 本地数据存储
 */
export class LocalStorageData {

    public static hashID: string = "sevenk";
    /**
     * 设置openid或者帐号id
     * @param  {string} openid
     */
    public static setHashID(openid: string): void {
        LocalStorageData.hashID = openid;
        LocalStorageData.setItem('hashID', openid, true);
    }
    /**
     * 返回openid或者帐号id
     * @return string
     */
    public static getHashID(): string {
        return LocalStorageData.getItem('hashID', true);
    }

    /**
     * 保存数据
     * @param  {string} key 数据key
     * @param  {string} value   数据
     * @param  {boolean=false} isGlobal 是否全局保存
     */
    public static setItem(key: string, value: string, isGlobal: boolean = false): void {
        if (isGlobal) {
            sys.localStorage.setItem(key, value);
        } else {
            sys.localStorage.setItem(`${LocalStorageData.hashID}_${key}`, value);
        }
    }
    /**
     * 获取数据
     * @param  {string} key 数据key
     * @param  {boolean=false} isGlobal 是否全局保存
     * @return string   数据
     */
    public static getItem(key: string, isGlobal: boolean = false): string {
        if (isGlobal) {
            return sys.localStorage.getItem(key);
        } else {
            return sys.localStorage.getItem(`${LocalStorageData.hashID}_${key}`);
        }
    }
    /**
     * 删除保存数据
     * @param  {string} key 数据key
     * @param  {boolean=false} isGlobal 是否全局保存
     */
    public static removeItem(key: string, isGlobal: boolean = false): void {
        if (isGlobal) {
            sys.localStorage.removeItem(key);
        } else {
            sys.localStorage.removeItem(`${LocalStorageData.hashID}_${key}`);
        }
    }
    /**
     * 清空所有数据
     */
    public static clearAll(): void {
        sys.localStorage.clear();
    }
}