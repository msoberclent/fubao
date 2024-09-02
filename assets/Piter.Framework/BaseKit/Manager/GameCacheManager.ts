import { Node } from "cc";
import { HashMap } from "../Data/HashMap";

/*
 * @Date: 2018-08-23 13:54:56 
 * @Last Modified time: 2019-06-19 20:07:39
 * @Description: 游戏缓存服务
 */
export class GameCacheManager {
  private static _instance: GameCacheManager;
  private _cache: HashMap<string, Node> = new HashMap<string, Node>();
  public constructor() {
    if (GameCacheManager._instance) {
      throw new Error("GameCacheManager使用单例");
    }
  }

  public static get instance(): GameCacheManager {
    if (!GameCacheManager._instance) {
      GameCacheManager._instance = new GameCacheManager();
    }
    return GameCacheManager._instance;
  }

  /**
   * 从缓存中拿取东西
   * @param  {} name
   */
  public getCache(name) {
    let cacheObj = this._cache.get(name);
    return cacheObj;
  }

  public setCache(name, cacheObj) {
    if (this._cache.has[name]) {
      this._cache[name] = cacheObj;
    } else {
      this._cache.put(name, cacheObj);
    }
  }

  public clearCache(name) {
    this._cache.remove(name);
  }
}