/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#import "AppDelegate.h"
#import "ViewController.h"
#import "View.h"

#include "platform/ios/IOSPlatform.h"
#import "platform/ios/AppDelegateBridge.h"
#import "service/SDKWrapper.h"
#import "SubGameView.h"
#import "OpenInstallSDK.h"
#import <Kiwi/Kiwi.h>

@implementation AppDelegate
@synthesize window;
@synthesize appDelegateBridge;

#pragma mark -
#pragma mark Application lifecycle、


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[SDKWrapper shared] application:application didFinishLaunchingWithOptions:launchOptions];
    appDelegateBridge = [[AppDelegateBridge alloc] init];
    NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight];
    [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
    // Add the view controller's view to the window and display.
    CGRect bounds = [[UIScreen mainScreen] bounds];
    self.window   = [[UIWindow alloc] initWithFrame:bounds];

    // Should create view controller first, cc::Application will use it.
    
//    _viewController                           = [[ViewController alloc] init];
    _viewController                           = [ViewController sharedInstance];
    _viewController.view                      = [[View alloc] initWithFrame:bounds];
    _viewController.view.contentScaleFactor   = UIScreen.mainScreen.scale;
    _viewController.view.multipleTouchEnabled = true;

    _viewController.view.translatesAutoresizingMaskIntoConstraints = NO;
    
    // 设置根视图控制器的自动布局约束
    
    [self.window setRootViewController:_viewController];


    [self.window makeKeyAndVisible];
   
    [NSLayoutConstraint activateConstraints:@[
        [_viewController.view.topAnchor constraintEqualToAnchor:self.window.topAnchor],
        [_viewController.view.leadingAnchor constraintEqualToAnchor:self.window.leadingAnchor],
        [_viewController.view.trailingAnchor constraintEqualToAnchor:self.window.trailingAnchor],
        [_viewController.view.bottomAnchor constraintEqualToAnchor:self.window.bottomAnchor]
    ]];
    [appDelegateBridge application:application didFinishLaunchingWithOptions:launchOptions];
    
    [OpenInstallSDK initWithDelegate:self];
    double delayInSeconds = 1.0; // 延迟时间，单位为秒
//    [[ViewController sharedInstance] rotationHeng];
    dispatch_time_t delayTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));

    dispatch_after(delayTime, dispatch_get_main_queue(), ^{
        // 在延迟之后执行的代码块
//        [[ViewController sharedInstance] rotationHeng];
    });
//
    [UIApplication sharedApplication].idleTimerDisabled = YES;
    
    
    
    return YES;
}


//// 获取当前显示的ViewController
- (UIViewController *)getCurrentVC {
    UIViewController *rootVC = self.window.rootViewController;
    if (!rootVC || ![rootVC isKindOfClass:[UINavigationController class]]) {
        return nil;
    }
    UINavigationController *rootNav = (UINavigationController *)rootVC;
    UITabBarController *tab = (UITabBarController *)rootNav.topViewController;
    if (!tab || ![tab isKindOfClass:[UITabBarController class]]) {
        return nil;
    }
    UINavigationController *nav = tab.selectedViewController;
    if (!nav || ![nav isKindOfClass:[UINavigationController class]]) {
        return nil;
    }
    UIViewController *currentVC = nav.topViewController;
    return currentVC;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    [[SDKWrapper shared] applicationWillResignActive:application];
    [appDelegateBridge applicationWillResignActive:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    [[SDKWrapper shared] applicationDidBecomeActive:application];
    [appDelegateBridge applicationDidBecomeActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    [[SDKWrapper shared] applicationDidEnterBackground:application];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    [[SDKWrapper shared] applicationWillEnterForeground:application];
//    NSLog(@"奇幻到前台");
    double delayInSeconds = 0.5; // 延迟时间，以秒为单位
    dispatch_time_t delayTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
    dispatch_after(delayTime, dispatch_get_main_queue(), ^{
        // 在延迟之后执行的代码
//        NSLog(@"延迟执行");
        [[ViewController sharedInstance] rotationBack];
    });
    
}

- (void)applicationWillTerminate:(UIApplication *)application {
    [[SDKWrapper shared] applicationWillTerminate:application];
    [appDelegateBridge applicationWillTerminate:application];
}

#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    [[SDKWrapper shared] applicationDidReceiveMemoryWarning:application];
}




@end
