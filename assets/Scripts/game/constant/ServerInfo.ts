export interface ServerInfo {

    /**
     * 服务器地址
     */
    http_path: string;

    /**
     * socket服务器地址
     */
    socket_path: string;

    /**
     * 热更地址
     */
    hot_path: string;

    /**
     * 子游戏热更新地址
     */
    subgame_hot_path: string;
    /**
     * 公共游戏资源
     */
    public_res_path?: string;
    /**
     * 每次更换域名都需要不一致
     */
    verion_key: string;
}
