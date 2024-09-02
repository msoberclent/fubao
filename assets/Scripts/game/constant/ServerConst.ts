import { LogUtils } from "../../../Piter.Framework/BaseKit/Util/LogUtils";
import { ServerInfo } from "./ServerInfo";

export enum PathTypeEnum {
    DEV1 = "1",
    DEV2 = "2",
    DEV3 = "5",
    NATIVE_SERVER = "3",
    WEB_SERVER = "4",
    WEB_SERVER2 = "7",
    WEB_TEST_SERVER = "6"
}

export class ServerConfig {
    public static PATH_CONFIG: PathConfig;
    public static PATH_TYPE = PathTypeEnum.DEV1;
    public static DEFAULT_OPENID = "oQhgL419UrQ7DXXqVHSGvv941Ec811";
    public static DEFAULT_NAME = "TESTPlayer1";
    public static DEFAULT_PASS = "TESTPlayer1";
    public static DEFAULT_PLAT_CODE = "WEB-HTML";
    public static LAST_LOGIN_METHOD: string;
    public static SERVER_INFO: ServerInfo;
    public static LAST_REMOTE_INFO: any;
    /**
     * 是否走DOS防护
     */
    public static HOT_UP_127: boolean = true;
    public static DOS_SAFE: boolean = false;
    public static USE_DOC_KEY_INDEX = 1;
    public static HTTP_DOS_KEY: string;
    public static HTTP_DOS_KEY1: string = "ly_http_rs";
    public static HTTP_DOS_KEY2: string = "hz2_http_rs";
    public static RES_DOS_KEY: string = "pub_re";
    public static LIVE_GAME_NAME: string = "longyun"
}

export class PathConfig {
    //http地址
    public http_server: string;
    //socket地址
    public socket_server: string;
    //
    public public_res_server: string;

    public test_api_server: string;
    //是否使用oss
    public cdn: boolean = false;
    //加密资源是否
    public encryptRes: boolean = false;

    public debug_model: boolean = true;

    public production: boolean = false;

    public serverVersion: string;

    public log_level: number;

    public token_login: boolean = false;

    public hotUpdateKey: string;
}
export class PathConfigFac {
    public static getPathByType(type: string): PathConfig {
        let pathConfig = new PathConfig();
        switch (type) {
            //mackbook
            case PathTypeEnum.DEV1:
                pathConfig.http_server = "http://172.16.0.109:10000";
                pathConfig.socket_server = "ws://172.16.0.109:10000/ws/connect/"
                pathConfig.test_api_server = "http://172.16.0.109:12100"
                pathConfig.debug_model = true;
                LogUtils.loglevel = LogUtils.DEBUG
                break;
            case PathTypeEnum.DEV2:
                pathConfig.http_server = "http://172.16.0.103:10000";
                pathConfig.socket_server = "ws://172.16.0.103:10000/ws/connect/"
                pathConfig.test_api_server = "http://172.16.0.103:12100"
                pathConfig.debug_model = true;
                LogUtils.loglevel = LogUtils.DEBUG
                break;
            case PathTypeEnum.DEV3:
                pathConfig.http_server = "http://172.16.0.150:10000";
                pathConfig.socket_server = "ws://172.16.0.150:10000/ws/connect/"
                pathConfig.test_api_server = "http://172.16.0.150:12100"
                pathConfig.debug_model = true;
                LogUtils.loglevel = LogUtils.DEBUG
                break;
            case PathTypeEnum.WEB_TEST_SERVER:
                pathConfig.debug_model = true;
                LogUtils.loglevel = LogUtils.DEBUG
                break;
            case PathTypeEnum.NATIVE_SERVER:
                pathConfig.debug_model = true;
                LogUtils.loglevel = LogUtils.DEBUG
                break;
            case PathTypeEnum.WEB_SERVER:
                pathConfig.debug_model = false;
                pathConfig.http_server = "https://wss.mx898.cc";
                pathConfig.socket_server = "wss://wss.mx898.cc/ws/connect/"
                LogUtils.loglevel = LogUtils.INFO
                break;
            case PathTypeEnum.WEB_SERVER2:
                pathConfig.debug_model = false;
                pathConfig.http_server = "https://wss.hz888.vip";
                pathConfig.socket_server = "wss://wss.hz888.vip/ws/connect/"
                LogUtils.loglevel = LogUtils.INFO
                break;
        }
        ServerConfig.PATH_CONFIG = pathConfig;
        return pathConfig;
    }
}
