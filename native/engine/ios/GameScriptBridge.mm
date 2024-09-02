#include <iostream>
#include <string>
#include "GameScriptBridge.h"
#import <Foundation/Foundation.h>
#import "cocos/platform/apple/JsbBridgeWrapper.h"
#import "cocos/platform/apple/JsbBridge.h"
#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import "SubGameView.h"
#import "ViewController.h"
#import <sys/utsname.h>
#import "OpenInstallSDK.h"
#import <Kiwi/Kiwi.h>
#import <CoreTelephony/CTCellularData.h>
#import <Foundation/Foundation.h>


@implementation GameScriptBridge{
    
}


+ (NSDictionary *)parseJSONString:(NSString *)jsonString {
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = nil;
    NSDictionary *jsonDict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
    
    if (error) {
        NSLog(@"JSON 解析错误: %@", error.localizedDescription);
        return nil;
    }
    
    if ([jsonDict isKindOfClass:[NSDictionary class]]) {
        return jsonDict;
    }
    return nil;
}

/**
 返回数据
 */
+ (id)callToJS:(NSString *)eventKey dictionary:(NSMutableDictionary *)dictionary {
    NSData *backData = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:eventKey arg1:backJsonStr];
    return nil;
}

/**
 返回数据
 */
+ (void)upload_header_start:(NSString *)data {
//    ViewController *shareInstance = [ViewController sharedInstance];
    [[ViewController sharedInstance] uploadHeader:data];
    return nil;
}


/**
 跳转url
 */
+ (id) open_qq:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSString *qqNumber = jsonDict[@"value"];
    // 拼接 QQ 号码和 URL Scheme
    NSString *urlString = [NSString stringWithFormat:@"mqq://im/chat?chat_type=wpa&uin=%@&version=1&src_type=web", qqNumber];
    NSURL *qqURL = [NSURL URLWithString:urlString];

    if ([[UIApplication sharedApplication] canOpenURL:qqURL]) {
        [[UIApplication sharedApplication] openURL:qqURL options:@{} completionHandler:nil];
    } else {
        // QQ 应用未安装或不可用的处理逻辑
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"提示" message:@"未安装 QQ 应用" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil];
        [alertController addAction:okAction];
        UIViewController *currentViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        [currentViewController presentViewController:alertController animated:YES completion:nil];
    }
    return nil;
}


/**
 跳转url
 */
+ (id) open_wechat:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSString *number = jsonDict[@"value"];
    NSURL *wechatURL = [NSURL URLWithString:@"weixin://"];
    if ([[UIApplication sharedApplication] canOpenURL:wechatURL]) {
        [[UIApplication sharedApplication] openURL:wechatURL options:@{} completionHandler:nil];
    } else {
        // 微信应用未安装或不可用的处理逻辑
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"提示" message:@"未安装 微信 应用" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil];
        [alertController addAction:okAction];
        UIViewController *currentViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        [currentViewController presentViewController:alertController animated:YES completion:nil];
    }
    return nil;
}


/**
 跳转url
 */
+ (id) goUrl:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSString *urlStr = jsonDict[@"url"];
    NSURL *url = [NSURL URLWithString: urlStr];
    if ([[UIApplication sharedApplication] canOpenURL:url]) {
        NSDictionary *options = @{UIApplicationOpenURLOptionUniversalLinksOnly: @NO};
        [[UIApplication sharedApplication] openURL:url options:options completionHandler:nil];
    }
    return nil;
}


/**
 跳转url
 */
+ (id) getOpenInstallData:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    [[OpenInstallSDK defaultManager] getInstallParmsCompleted:^(OpeninstallData*_Nullable appData) {
        //在主线程中回调
        NSMutableDictionary *backJson1 = [NSMutableDictionary dictionary];
        [backJson1 setObject:sequence forKey:@"sequence"];
        NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
        if (appData.data) {//(获取自定义参数)
            [backJson setObject:appData.data forKey:@"bindData"];
           //e.g.如免填邀请码建立邀请关系、自动加好友、自动进入某个群组或房间等
        }else{
            NSMutableDictionary *bindData = [NSMutableDictionary dictionary];
            [backJson setObject:bindData forKey:@"bindData"];
        }
        if (appData.channelCode) {//(获取渠道编号参数)
            //e.g.可自己统计渠道相关数据等
            [backJson setObject:appData.channelCode forKey:@"channelCode"];
        }
        if (appData.opCode==OPCode_timeout) {
            //获取参数超时，可在合适时机再去获取（可设置全局标识）
        }
        [backJson1 setObject:backJson forKey:@"data"];
        
        [GameScriptBridge callToJS:@"getOpenInstallData" dictionary:backJson1];
        // NSLog(@"OpenInstallSDK:\n动态参数：%@;\n渠道编号：%@",appData.data,appData.channelCode);
    }];
    return nil;
}

/**
 获取粘贴板
 */
+ (id) getLocationInfo:(NSString *)data {
    NSLog(@"js getLocationInfo");
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    [[ViewController sharedInstance] requestGetLocation:backJson];
    return nil;
}



/**
 获取粘贴板
 */
+ (id) getImage:(NSString *)data {
    NSLog(@"js getImage");
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    
    NSString *filePath = jsonDict[@"path"];
    NSLog(@"js filePath %@", filePath);
    
    UIImage *image = [UIImage imageWithContentsOfFile:filePath];
        
    if (image) {
        // 将图像转换为NSData
        NSData *imageData = UIImagePNGRepresentation(image); // 如果是PNG图片
        // NSData *imageData = UIImageJPEGRepresentation(image, 1.0); // 如果是JPEG图片
        // 使用Base64编码图像数据
        NSString *base64String = [imageData base64EncodedStringWithOptions:0];
        NSData *imageData2 = [[NSData alloc] initWithBase64EncodedString:base64String options:NSDataBase64DecodingIgnoreUnknownCharacters];

            if (imageData) {
                // 将NSData转换为UIImage
                UIImage *image2 = [UIImage imageWithData:imageData2];

                if (image2) {
                    // 保存图像到相册
                    UIImageWriteToSavedPhotosAlbum(image2, nil, nil, nil);
                    NSLog(@"Image saved to photo album successfully");
                    [backJson setObject:@"0" forKey:@"status"];
                } else {
                    NSLog(@"Failed to create image from Base64 data");
                    [backJson setObject:@"1" forKey:@"status"];
                }
            } else {
                NSLog(@"Failed to decode Base64 string");
                [backJson setObject:@"1" forKey:@"status"];
            }
        return base64String;
    } else {
        [backJson setObject:@"1" forKey:@"status"];
        NSLog(@"Failed to load image from file path: %@", filePath);
        return nil;
    }
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"getImage" arg1:backJsonStr];

    return nil;
}

/**
 获取粘贴板
 */
+ (id) getClipBoardStr:(NSString *)data {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSString *pasteboardString = pasteboard.string;
    
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    [backJson setObject:pasteboardString forKey:@"str"];
    
    [GameScriptBridge callToJS:@"getClipBoardStr" dictionary:backJson];
    return nil;
}

/**
 设置粘贴板
 */
+ (id) setClipboardData:(NSString *)data {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSString *str = jsonDict[@"str"];
    pasteboard.string = str;
    return nil;
}

+(id) sendWebViewExitSuc{
    JsbBridge* m = [JsbBridge sharedInstance];
//    [m sendToScript:@"exit_subgame" arg1:@"{}"];
    [m sendToScript:@"exit_subgame" arg1:@"{}"];
    return nil;
}


+(id) sendHeaderSuccess:(NSString *) address {
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"header_upload_end" arg1: address];
    return nil;
}

+(id)fixOrientation:(NSString *)data {
    [[ViewController sharedInstance] rotationShu];
}

/**
 设置粘贴板
 */
+ (id) open_subgame_url:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    // [[ViewController sharedInstance] showSubGameView:jsonDict];
//    NSString *str = jsonDict[@"gameUrl"];
//    NSURL *url = [NSURL URLWithString:str]; // 替换为您要加载的网页 URL
//    NSURLRequest *request = [NSURLRequest requestWithURL:url];
//    [self.webView loadRequest:request];
    
    NSNumber *direction = jsonDict[@"direction"];
    NSInteger directionValue = [direction integerValue];
//    if(directionValue == 1){
        [[ViewController sharedInstance] rotationShu];
//    }else{
//        [[ViewController sharedInstance] rotationHeng];
//    }
    SubGameView *subGameView = [[SubGameView alloc] init];
    [subGameView initWithParameter: jsonDict];
    subGameView.modalPresentationStyle = UIModalPresentationFullScreen;
    UIViewController *currentViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    [currentViewController.view addSubview:subGameView.view];
    
//    [[ViewController sharedInstance] addSubGameView: subGameView];
    return nil;
}

+(id) getNativeOrientation:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    
//    [[ViewController sharedInstance] direction];
    UIInterfaceOrientation orientation = [[UIApplication sharedApplication] statusBarOrientation];
    NSString *direction = @"0";
    if((UIInterfaceOrientationIsPortrait(orientation))){
        direction = @"1";
    };
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    [backJson setObject:direction forKey:@"type"];
    
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"get_native_orientation" arg1:backJsonStr];
    return nil;
}

/**
 获取设备唯一编码
 */
+ (id) getPackageName:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    [backJson setObject:bundleIdentifier forKey:@"packageName"];
    
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"getPackageName" arg1:backJsonStr];
    return nil;
}



+ (float)getBatteryLevel {
    UIDevice *device = [UIDevice currentDevice];
    device.batteryMonitoringEnabled = YES;
    if (device.batteryState == UIDeviceBatteryStateUnknown) {
        return -0.0; // 无法获取电池电量
    } else {
        return device.batteryLevel * 100.0; // 返回电池电量百分比
    }
}

/**
 获取洋葱盾返回的iP
 */
+ (id) getDosServerInfo:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    
    NSString *httpName = jsonDict[@"serverName"];

    
    char http_ip[40] = {0};
    char http_port[40] = {0};

    // 请替换真实rs标识
    const char *httpNameChar = [httpName UTF8String];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    //----http---
    int ret = [Kiwi ServerToLocal:httpNameChar :http_ip :sizeof(http_ip) :http_port :sizeof(http_port)];
    NSNumber *retNumber = @(ret);
    if (ret != 0) {
        [backJson setObject:retNumber forKey:@"code"];
        NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
        NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
        return;
    }else{
        NSString* ip = @(http_ip);
        NSString* port = @(http_port);
        [backJson setObject:ip forKey:@"ip"];
        [backJson setObject:port forKey:@"port"];
    }
    [backJson setObject:retNumber forKey:@"code"];
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"getDosServerInfo" arg1:backJsonStr];
    return nil;
}


/**
 获取洋葱盾返回的iP
 */
+ (id) getDosServer:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    
    NSString *httpName = jsonDict[@"httpName"];
    NSString *socketName = jsonDict[@"socketName"];
    
    char http_ip[40] = {0};
    char http_port[40] = {0};
    
    char socket_ip[40] = {0};
    char socket_port[40] = {0};
    // 请替换真实rs标识
    const char *httpNameChar = [httpName UTF8String];
    const char *socketNameChar = [socketName UTF8String];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    //----http---
    int ret = [Kiwi ServerToLocal:httpNameChar :http_ip :sizeof(http_ip) :http_port :sizeof(http_port)];
    NSNumber *retNumber = @(ret);
    if (ret != 0) {
        [backJson setObject:retNumber forKey:@"code"];
        NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
        NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
        return;
    }else{
        NSString* httpUrl = [NSString stringWithFormat:@"http://%s:%s", http_ip, http_port];
        [backJson setObject:httpUrl forKey:@"http"];
    }
    //----socket---
    int socketRet = [Kiwi ServerToLocal:socketNameChar :socket_ip :sizeof(socket_ip) :socket_port :sizeof(socket_port)];
    NSNumber *socketRetNumber = @(socketRet);
    if (ret != 0) {
        [backJson setObject:socketRetNumber forKey:@"code"];
        NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
        NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
        return;
    }else{
        NSString* httpUrl = [NSString stringWithFormat:@"ws://%s:%s", socket_ip, socket_port];
        [backJson setObject:httpUrl forKey:@"ws"];
    }
    [backJson setObject:socketRetNumber forKey:@"code"];
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"getDosServer" arg1:backJsonStr];
    return nil;
}


/**
 获取设备唯一编码
 */
+ (id) getBatteryValue:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    
    // 获取电池电量
    float batteryLevel = [GameScriptBridge getBatteryLevel];
    // 将电池电量包装在NSNumber对象中
    NSNumber *value = @(batteryLevel);
    [backJson setObject:sequence forKey:@"sequence"];
    [backJson setObject:value forKey:@"value"];
    
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"getPackageName" arg1:backJsonStr];
    return nil;
}

/**
 获取设备唯一编码
 */
+ (id) SDKInit:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];

    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    
    //洋葱盾
    const char *appkey = "o0Zg8npztGr9exGnLajeSOLzdCJGFQHrnwN+9nJ1RMayMtuNDxhCNruMOcrEaGlM/DCnCEfu5Bf72flUOk5pGBNlg2pXXUrCjXpvQDrRiSmFla3yXNvJgv42gYZk7RLGL5IJslQdVkLl2G06xOyLGybAFVCUxdsXxHWBoeLPBZ1726VwAAzHnd3eJcRCe1Rp+A2+TZbVhuY9W7SdvOnytMaCPZ1BlvZo4AxTLGkZ78w64WaWsFJoMTPJnVMwz7aS/NG+o90JR9j1UVGpbJ35zskKbLt4ZQZWLY7UWxNT4Tnq2iBvPhOX894/glv2LceLyRhQJl+V7iWMq7HdxYZheyTW9xvHq0RAlihEtYf31k9bS4SS0VtmfnXUwHqbsXXbGTQ8UQl7ygHLYUr0vD5jEIQFvtNKTTDGT8SFms4luXvuNiE0fbw5XAtyYfCMRRQyC3h/KS5e9gjv6NP9DyVHrbEnOYNrUf/kMuwDqoZas47RtWRAbT3MHinkfbp+xyyXFOpSpEBTb0Sk2Vtj2hU27/8J3gCRPzwHULXXdW2k71ygMxMEu1O2K2piD9g8HjjT+gmu47uU7ZCM6ASEHtpVs6f0PAfIXXAQMkpDCjqB/xcyyvkycr1EhErYnZgfJ2YWp+sb/hwjlzmedYhvGMhWt7ZpiG6mP4rJoYkJtQcbY0d+j30YDvuNtueCmfb9kUk/RS/O1ufOq/PafFKC1FZX6vIAShTDhZ3bFY0P2Tyn1FxXkZDnylI8aWuEv5Ee84LY+Z5kx6xll+r7EgiePvTc7DUknh7E3ffq6tjFJFr7IY/hhbRbB0nJL4H9bcNd+mAXw82ou2hIKNFcaXCY2aAEvfhCnYssz/1acOTP1tIeO0Lz/Ejgpk2YtyIWieTndLRro2QEoWxp/0mMQQawcPk2TYVtNHNA3crd/2tTYf2SeVChBKglXAbPj3JY9fehAK2jg77NU2KQ19/9xCZMgTS6S3GQBVAQX2eaFY1RjeMN1/Ca5FwOKW9Afg/PZqOmSCzL9jn9rdPriWiivpOzvajsgjVwz55v14O+K7v7qW9JQig/C2vSocc5VBFP5DmEIi7db68/ObbYIsfnXJ45DMafClJ8HbKo5hSPP6ShW8KpgWB2a6o5U4mBY6wr/UO2Ruv3G/YkRqzwp/QWoYVaWZfL3zL6cwPt34vte6LOQ1ykzL42tZscXEzIG96Yjm39k/97jd1jvK5r2aPXChzKJL/J4ff5jcftI+KvWMJXVSrNQSSydJZOjc9SY60t+CW5nozdigersI6Wd3YwJb/TG91DzbqONJsauPz8rTQuA0lSUtIBC1q23W3q01F0ff1ECZUfJXxFx0qBQ5A+Xo2GNT8z6VyH3ManZiOHXyr/kyy+iw8J7VF2vED0OIocHDZ4Ybw0zuJh+g8wLCq9QR5Qgca2/J4TCVEytJf4JpbokoL9yXPJwSPP5k6r1dUmwZ44xH4McGUbGYIZfWESNyyNmnoxGSehIQ8U32IEhQuleiksOqnfpbxau8WuaZrVZTMpWB6wKyre+e3Ym+RdFHBq5S3d6joGhLfJ9WxHa66Jfvv973zM4WqJ1MazhaP5KYVF21CdtTQ69Hi+3c1pS1ikcBIN99Sgop6wXMCYjbh7nenc2msV6MLA+YOIy5snfG9UhS3S12Aqqr7cipJCFG2NsZBEppcGBFpA1wvjkNHCEgcxZXvwZL2xIsQQS6oXhQsMZ6j4BKoySDpWDhkkMHIOYFcIZGMtqVKZ7SVupd3zh82CY05T67Lu97DQmRtJs6dNw7RcFRs0iYzJZf2JEmr3phCdqLMiLRVXD+iF9NgEdVVMIKlNuA3rhHuaLqBrq0rhFe7SlAnqCwiR6qtKIi3LXRcs4UqOpmCcQBPFmh6CDm+u5rXHB5nu4/2AaYnyM8seH57LqDhkYwLAUiY+TCjsFJZfzPVYJWXOrVU1uwk/ZZIdD6oMdB1YJH1y6aWzcASjw0Th";
    int ret = [Kiwi Init:appkey];
    NSNumber *retNum = @(ret);
    [backJson setObject:retNum forKey:@"result"];

    // 获取电池电量
    [backJson setObject:sequence forKey:@"sequence"];
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"SDKInit" arg1:backJsonStr];
    return nil;
}


/**
 发送get请求
 */
+ (id) sendNativeGetRequest:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];

    NSURL *url = [NSURL URLWithString: jsonDict[@"url"]];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    //start
    // 创建请求对象
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"GET"];
    // 发送请求
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSNumber *value = @(-1);
            [backJson setObject:value forKey:@"code"];
        }else{
            // 处理响应数据
            NSString *responseData = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            // 如果请求成功，你可以在这里处理响应数据
            NSString *responseDataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
//            NSDictionary *jsonDict = [SubGameView parseJSONString:responseData];
            [backJson setObject:responseDataString forKey:@"result"];
        }
        NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
        NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
        dispatch_async(dispatch_get_main_queue(), ^{
            JsbBridge* m = [JsbBridge sharedInstance];
            [m sendToScript:@"sendNativeGetRequest" arg1:backJsonStr];
        });
        
    }];
    [dataTask resume];
    //end
    return nil;
}



/**
 获取设备唯一编码
 */
+ (id) getAppVersion:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    NSString *build = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    [backJson setObject:version forKey:@"versionName"];
    [backJson setObject:build forKey:@"versionCode"];
    
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"get_app_version" arg1:backJsonStr];
    return nil;
}

/**
 获取设备唯一编码
 */
+ (id) getMacAddress:(NSString *)data {
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    NSString *IDFV = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    [backJson setObject:IDFV forKey:@"uniId"];
    
    
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"getMacAddress" arg1:backJsonStr];
    return nil;
}

+(id)getDeviceInfo:(NSString *)data {
//    [[ViewController sharedInstance] rotationHeng];
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSNumber *sequence = jsonDict[@"sequence"];
    struct utsname systemInfo;
    uname(&systemInfo);
    
    NSString *deviceModel = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    NSMutableDictionary *info = [NSMutableDictionary dictionary];
    [info setObject:deviceModel forKey:@"model"];
    
    NSMutableDictionary *backJson = [NSMutableDictionary dictionary];
    [backJson setObject:sequence forKey:@"sequence"];
    [backJson setObject:info forKey:@"info"];
    
    NSData *backData = [NSJSONSerialization dataWithJSONObject:backJson options:NSJSONWritingPrettyPrinted error:nil];
    
 
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"getDeviceInfo" arg1:backJsonStr];
    return nil;
}


-(id)init{
    self = [super init];
        
    static ICallback cb = ^void (NSString* eventName, NSString* data){
        //open Ad
        if ([eventName isEqualToString:@"getMacAddress"]) {
            [GameScriptBridge getMacAddress:data];
        } else if ([eventName isEqualToString:@"goUrl"]) {
            [GameScriptBridge goUrl:data];
        } else if ([eventName isEqualToString:@"setClipboardData"]) {
            [GameScriptBridge setClipboardData:data];
        } else if ([eventName isEqualToString:@"getClipBoardStr"]) {
            [GameScriptBridge getClipBoardStr:data];
        } else if ([eventName isEqualToString:@"open_qq"]) {
            [GameScriptBridge open_qq:data];
        } else if ([eventName isEqualToString:@"open_wechat"]) {
            [GameScriptBridge open_wechat:data];
        } else if ([eventName isEqualToString:@"open_subgame_url"]) {
            [GameScriptBridge open_subgame_url:data];
        } else if ([eventName isEqualToString:@"upload_header_start"]) {
            [GameScriptBridge upload_header_start:data];
        } else if ([eventName isEqualToString:@"getDeviceInfo"]) {
            [GameScriptBridge getDeviceInfo:data];
        } else if ([eventName isEqualToString:@"getOpenInstallData"]) {
            [GameScriptBridge getOpenInstallData:data];
        } else if ([eventName isEqualToString:@"getPackageName"]) {
            [GameScriptBridge getPackageName:data];
        }else if ([eventName isEqualToString:@"get_app_version"]) {
            [GameScriptBridge getAppVersion:data];
        }else if ([eventName isEqualToString:@"get_native_orientation"]){
            [GameScriptBridge getNativeOrientation:data];
        }else if ([eventName isEqualToString:@"fix_orientation"]){
            [GameScriptBridge fixOrientation:data];
        }else if ([eventName isEqualToString:@"get_battery_value"]){
            [GameScriptBridge getBatteryValue:data];
        }else if ([eventName isEqualToString:@"getDosServer"]){
            [GameScriptBridge getDosServer:data];
        }else if ([eventName isEqualToString:@"getDosServerInfo"]){
            [GameScriptBridge getDosServerInfo:data];
        }else if ([eventName isEqualToString:@"SDKInit"]){
            [GameScriptBridge SDKInit:data];
        }else if ([eventName isEqualToString:@"sendNativeGetRequest"]){
            [GameScriptBridge sendNativeGetRequest:data];
        }else if ([eventName isEqualToString:@"getLocationInfo"]){
            [GameScriptBridge getLocationInfo:data];
        }else if ([eventName isEqualToString:@"getImage"]){
            [GameScriptBridge getImage:data];
        }
    };

    JsbBridge* m = [JsbBridge sharedInstance];
    [m setCallback:cb];
  
    return self;
}


+ (id)sendLocationInfo:(NSMutableDictionary *)jsonDict {
    NSData *backData = [NSJSONSerialization dataWithJSONObject:jsonDict options:NSJSONWritingPrettyPrinted error:nil];
    NSString *backJsonStr = [[NSString alloc] initWithData:backData encoding:NSUTF8StringEncoding];
    
    JsbBridge* m = [JsbBridge sharedInstance];
    [m sendToScript:@"getLocationInfo" arg1:backJsonStr];
}

@end
