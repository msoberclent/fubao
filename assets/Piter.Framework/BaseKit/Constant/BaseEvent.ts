/**
 * 内置事件
 */
export class BaseEvent {
    //前台运行
    public static GOLD_FLUSH: string = "GOLD_FLUSH";
    //前台运行
    public static HEADER_FLUSH: string = "HEADER_FLUSH";
    //前台运行
    public static RUN_FORTEND: string = "RUN_FORTEND";
    //后台运行
    public static RUN_BACKEND: string = "RUN_BACKEND";
    //适配变更
    public static EVENT_RESIZE: string = "EVENT_RESIZE";
    //改变语言
    public static CHANGE_LANGUAGE: string = "CHANGE_LANGUAGE";
    //改变网络状态
    public static NET_STATE_CHANGE: string = "NET_STATE_CHANGE";
    //连上SOCKET
    public static SOCKET_CONNECT = "SOCKET_CONNECT";
    //SOCKET网络错误
    public static SOCKET_ERROR: string = "onsocketClose";

    public static SOCKET_RECONNECT: string = "SOCKET_RECONNECT"

    //FaceBookLogin
    static FACEBOOK_LOGIN_RESULT: string = "facebook_login_result";

    static IOS_LOGIN_RESULT: string = "ios_login_result";

    static GOOGLE_LOGIN_RESULT: string = "google_login_result";

    //登录成功
    static NORMAL_LOGIN_SUCCESS: string = "NORMAL_LOGIN_SUCCESS"

    static DO_MAIN_LOGIN: string = "DO_MAIN_LOGIN"

    static SHOW_VERSION: string = "SHOW_VERSION";

    static PAUSED_GANE: string = "PAUSED_GANE";

    static REMUSE_GANE: string = "REMUSE_GANE";

    static AD_LOCKTIME_FLUSH: string = "AD_LOCKTIME_FLUSH";

    // 技能动画变帧
    static SKILL_ANIM_CHANGE: string = "SKILL_ANIM_CHANGE";

    static GUIDE_STEP_MOVE: string = "GUIDE_STEP_MOVE";

    static ROOM_FLUSH: string = "ROOM_FLUSH"

    static NOTIFY_SERVER_DOWN: string = "NOTIFY_SERVER_DOWN"

    static NOTIFY_ACCOUNT_CHANGE: string = "NOTIFY_ACCOUNT_CHANGE";

    static RED_DOT_FLUSH: string = "RED_DOT_FLUSH"

    static NOTIFY_BONUS_RAIN_ARRIVED: string = "NOTIFY_BONUS_RAIN_ARRIVED";

    static SHOW_DROP_ITEMS: string = "SHOW_DROP_ITEMS";

    static CIRCULAR_MENU_TOUCH: string = "CIRCULAR_MENU_TOUCH";

    static USER_PHONE_UPDATE:string = "USER_PHONE_UPDATE";
}