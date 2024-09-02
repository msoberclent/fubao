#import <Foundation/Foundation.h>

@interface Kiwi : NSObject

/**
 * @breif 初始化接口，不需要重复调用接口。会访问网络，不要放在UI线程中
 * @param appkey 控制台获取的appkey
 * @return 0表示成功，非0表示失败，请咨询Kiwi开发人员
 */
+(int) Init:(const char *)appkey;

/**
 * @breif 转化接口，将rs标识转换为本地访问。不会访问网络，不会卡顿
 * @param name 控制台配置的防护目标rs标识
 * @param ip 转换后的ip缓冲区指针
 * @param ip_len 转换后的ip缓冲区长度
 * @param port 转换后的端口缓冲区指针
 * @param port_len 转换后的端口缓冲区长度
 * @return 0表示成功，非0表示失败，请咨询Kiwi开发人员
 */
+(int) ServerToLocal:(const char*)name :(char*)ip :(int)ip_len :(char*)port :(int)port_len;

/**
 * @breif 发送日志接口
 * @param mtype 用户自定义，用于区分不同类型的日志。需要大于1000
 * @param data 日志内容
 * @return 0表示成功，非0表示失败，请咨询Kiwi开发人员
 */
+(int) SendLog:(int)mtype :(const char*)data;

/**
 * @breif 重启Kiwi本地代理服务器
 */
+(void) RestartAllServer;

@end
