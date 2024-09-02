/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org
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
#import <Foundation/Foundation.h>
#import "ViewController.h"
#import "AppDelegate.h"
#import "platform/ios/AppDelegateBridge.h"
#import <Photos/Photos.h>
#import "GameScriptBridge.h"
#include <string>
#import "SubGameView.h"
#import "TestGameView.h"
#import <CoreLocation/CoreLocation.h>
namespace {
//    cc::Device::Orientation _lastOrientation;
}

@interface ViewController () <CLLocationManagerDelegate>

@property (nonatomic, strong) CLLocationManager *locationManager;
 
@end

static ViewController *sharedInstance = nil;

static NSMutableDictionary *locationBackJson = nil;

@implementation ViewController

@synthesize direction = _direction;

//------定位权限----------

- (void)requestGetLocation: (NSMutableDictionary *) jsonDict{
    // 请求定位权限
    if(self.locationManager == nil){
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
    }
    self.backDict = jsonDict;
    if ([CLLocationManager locationServicesEnabled]) {
        CLAuthorizationStatus authorizationStatus = [CLLocationManager authorizationStatus];
        if (authorizationStatus == kCLAuthorizationStatusNotDetermined) {
            // 请求权限
            //NSLog(@"js 请求权限");
            [self.locationManager requestWhenInUseAuthorization];
        } else if (authorizationStatus == kCLAuthorizationStatusDenied) {
            // 处理拒绝权限的情况
            //NSLog(@"js 没有权限");
            NSNumber *latitude = @(0);
            NSNumber *longitude =@(0);
            [self.backDict setObject:longitude forKey:@"j"];
            [self.backDict setObject:latitude forKey:@"w"];
            [GameScriptBridge sendLocationInfo: self.backDict];
        } else {
            //NSLog(@"js 有权限");
            // 已经有权限，可以开始获取位置信息
            [self.locationManager startUpdatingLocation];
        }
    } else {
        // 处理设备未启用位置服务的情况
        //NSLog(@"js 没有启动位置服务");
        NSNumber *latitude = @(0);
        NSNumber *longitude =@(0);
        [self.backDict setObject:longitude forKey:@"j"];
        [self.backDict setObject:latitude forKey:@"w"];
        [GameScriptBridge sendLocationInfo: self.backDict];
    }
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    if (status == kCLAuthorizationStatusDenied || status == kCLAuthorizationStatusRestricted) {
        // 用户拒绝了权限或权限受限，继续提示
        //NSLog(@"js 拒绝了权限");
        NSNumber *latitude = @(0);
        NSNumber *longitude =@(0);
        [self.backDict setObject:longitude forKey:@"j"];
        [self.backDict setObject:latitude forKey:@"w"];
        [GameScriptBridge sendLocationInfo: self.backDict];
    }else{
        //NSLog(@"js 给与了权限");
        [self.locationManager startUpdatingLocation];
    }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
    //NSLog(@"js 4");
    CLLocation *location = [locations lastObject];
    [self.locationManager stopUpdatingLocation];
    if (location) {
        //NSLog(@"js 5");
        NSNumber *latitude = @(location.coordinate.latitude);
        NSNumber *longitude = @(location.coordinate.longitude);
        //NSLog(@"js 经度: %@, 纬度: %@", longitude, latitude);
        [self.backDict setObject:longitude forKey:@"j"];
        [self.backDict setObject:latitude forKey:@"w"];
    }else{
        //NSLog(@"js 6");
        NSNumber *latitude = @(0);
        NSNumber *longitude =@(0);
        [self.backDict setObject:longitude forKey:@"j"];
        [self.backDict setObject:latitude forKey:@"w"];
    }
    //NSLog(@"js 7");
    [GameScriptBridge sendLocationInfo: self.backDict];
    
}

- (void)openAppSettings {
    NSURL *settingsURL = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
    if ([[UIApplication sharedApplication] canOpenURL:settingsURL]) {
        [[UIApplication sharedApplication] openURL:settingsURL];
    }
}

- (void)showLocationPermissionAlert {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"需要定位权限" message:@"请前往设置以启用应用的定位权限。" preferredStyle:UIAlertControllerStyleAlert];
       
       UIAlertAction *settingsAction = [UIAlertAction actionWithTitle:@"前往设置" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
           [self openAppSettings]; // 跳转到应用设置页
       }];
       
       UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil];
       
       [alertController addAction:settingsAction];
       [alertController addAction:cancelAction];
       
       [self presentViewController:alertController animated:YES completion:nil];
//    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"需要定位权限" message:@"请授予应用定位权限以获取位置信息。" preferredStyle:UIAlertControllerStyleAlert];
//    
//    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
//        // 用户点击确定，再次请求权限
//        [self.locationManager requestWhenInUseAuthorization];
//    }];
//    
//    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil];
//    
//    [alertController addAction:okAction];
//    [alertController addAction:cancelAction];
//    
//    [self presentViewController:alertController animated:YES completion:nil];
}

//------定位权限---------

- (void)setDirection:(NSString *)direction {
    _direction = direction;  // 使用成员变量 _name 来存储传入的 name 值
}

- (NSString *)getDirection {
    return _direction;  // 返回成员变量 _name 的值
}

-(void)showSubGameView: (NSDictionary *) jsonDict{
//    TestGameView *testGameView = [[TestGameView alloc] init];
//    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:testGameView];
//    [self presentViewController:navigationController animated:YES completion:nil];
//    [self presentViewController:testGameView animated:YES completion:nil];
    
    
//    NSNumber *direction = jsonDict[@"direction"];
//    NSInteger directionValue = [direction integerValue];
//    if(directionValue == 1){
//        [[ViewController sharedInstance] rotationShu];
//    }else{
//        [[ViewController sharedInstance] rotationHeng];
//    }
//    SubGameView *subGameView = [[SubGameView alloc] init];
//    [subGameView initWithParameter: jsonDict];
//    subGameView.modalPresentationStyle = UIModalPresentationFullScreen;
//    [self presentViewController:subGameView animated:YES completion:nil];
}


+ (instancetype)sharedInstance {
    static ViewController *sharedInstance = nil;
     static dispatch_once_t once;
     dispatch_once(&once, ^{
         sharedInstance = [[ViewController alloc] init];
     });

     return sharedInstance;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskLandscapeLeft|UIInterfaceOrientationMaskLandscapeRight|UIInterfaceOrientationMaskPortrait;
}

//////// LandscapeViewController内部代码
//- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
//    return UIInterfaceOrientationMaskPortrait|UIInterfaceOrientationMaskLandscapeLeft|UIInterfaceOrientationMaskLandscapeRight ;
//}

-(void)rotationBack{
    NSString *direction = [self getDirection];
    if([direction isEqualToString:@"1"]){
        [[ViewController sharedInstance] rotationHeng];
    }
}

-(void)rotationHeng{
    [self setDirection:@"1"];
    if (@available(iOS 16.0, *)) {
          [self setNeedsUpdateOfSupportedInterfaceOrientations];
          [self.navigationController setNeedsUpdateOfSupportedInterfaceOrientations];
          NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
          UIWindowScene *scene = (UIWindowScene *)array[0];
          UIWindowSceneGeometryPreferencesIOS *geometryPreferences = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:UIInterfaceOrientationMaskLandscape];
          [scene requestGeometryUpdateWithPreferences:geometryPreferences
              errorHandler:^(NSError * _Nonnull error) {
          }];
      }
    else if ([[[UIDevice currentDevice] systemVersion] compare:@"13.0" options:NSNumericSearch] == NSOrderedDescending) {
          UIWindowScene *windowScene = (UIWindowScene *)[UIApplication sharedApplication].connectedScenes.allObjects.firstObject;
             if (windowScene.activationState == UISceneActivationStateForegroundActive) {
                 UIInterfaceOrientationMask supportedOrientations = UIInterfaceOrientationMaskLandscape;
                 if ([[UIDevice currentDevice] respondsToSelector:@selector(setOrientation:)]) {
                     NSNumber *orientationValue = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeLeft]; // 想要改变的方向
                     [[UIDevice currentDevice] setValue:orientationValue forKey:@"orientation"];
                 }
                 [UIViewController attemptRotationToDeviceOrientation];
             }
      } else {
          NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
          [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
          [UIViewController attemptRotationToDeviceOrientation];
      }
}

-(void)rotationShu{
    [self setDirection:@"0"];
    if (@available(iOS 16.0, *)) {
          [self setNeedsUpdateOfSupportedInterfaceOrientations];
          [self.navigationController setNeedsUpdateOfSupportedInterfaceOrientations];
          NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
          UIWindowScene *scene = (UIWindowScene *)array[0];
          UIWindowSceneGeometryPreferencesIOS *geometryPreferences = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:UIInterfaceOrientationMaskPortrait];
          [scene requestGeometryUpdateWithPreferences:geometryPreferences
              errorHandler:^(NSError * _Nonnull error) {
          }];
      } else if ([[[UIDevice currentDevice] systemVersion] compare:@"13.0" options:NSNumericSearch] == NSOrderedDescending) {
          UIWindowScene *windowScene = (UIWindowScene *)[UIApplication sharedApplication].connectedScenes.allObjects.firstObject;
             if (windowScene.activationState == UISceneActivationStateForegroundActive) {
                 UIInterfaceOrientationMask supportedOrientations = UIInterfaceOrientationMaskPortrait;
                 if ([[UIDevice currentDevice] respondsToSelector:@selector(setOrientation:)]) {
                     NSNumber *orientationValue = [NSNumber numberWithInt:UIInterfaceOrientationPortrait]; // 想要改变的方向
                     [[UIDevice currentDevice] setValue:orientationValue forKey:@"orientation"];
                 }
                 [UIViewController attemptRotationToDeviceOrientation];
             }
      } else {
          NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
         [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
          [UIViewController attemptRotationToDeviceOrientation];
      }
}
- (BOOL) shouldAutorotate {
    return YES;
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
    
   AppDelegate* delegate = [[UIApplication sharedApplication] delegate];
   [delegate.appDelegateBridge viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
   float pixelRatio = [delegate.appDelegateBridge getPixelRatio];

   //CAMetalLayer is available on ios8.0, ios-simulator13.0.
   CAMetalLayer *layer = (CAMetalLayer *)self.view.layer;
   CGSize tsize             = CGSizeMake(static_cast<int>(size.width * pixelRatio),
                                         static_cast<int>(size.height * pixelRatio));
   layer.drawableSize = tsize;
}

- (id) uploadHeader:(NSString *)data{
    NSDictionary *jsonDict = [GameScriptBridge parseJSONString:data];
    NSString *fileURL = jsonDict[@"url"];
    [ViewController sharedInstance].fileUrl = fileURL;
    // 创建 UIImagePickerController 实例
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    picker.delegate = self;
    // 允许编辑选项，即裁剪
    picker.allowsEditing = YES;
    // 弹出相册选择器
    [self presentViewController:picker animated:YES completion:nil];
    
}


#pragma mark - UIImagePickerControllerDelegate

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<UIImagePickerControllerInfoKey,id> *)info {
    UIImage *selectedImage = info[UIImagePickerControllerEditedImage];
    
    // 裁剪选取的图片
    CGSize croppedSize = CGSizeMake(150, 150);
    UIImage *croppedImage = [self cropImage:selectedImage toSize:croppedSize];
    
    // 上传图片到服务器
    [self uploadImage:croppedImage];
    
    [picker dismissViewControllerAnimated:YES completion:nil];
}

// UIImagePickerControllerDelegate方法，用户取消选取图片
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [picker dismissViewControllerAnimated:YES completion:nil];
}

- (UIImage *)cropImage:(UIImage *)image toSize:(CGSize)size {
    // 计算缩放比例和裁剪区域
    CGFloat scale = MAX(size.width / image.size.width, size.height / image.size.height);
    CGRect cropRect = CGRectMake(0, 0, image.size.width * scale, image.size.height * scale);
    
    // 创建绘制上下文
    UIGraphicsBeginImageContextWithOptions(size, NO, 0.0);
    
    // 在上下文中绘制裁剪区域
    [image drawInRect:cropRect];
    
    // 获取裁剪后的图片
    UIImage *croppedImage = UIGraphicsGetImageFromCurrentImageContext();
    
    // 关闭上下文
    UIGraphicsEndImageContext();
    
    return croppedImage;
}

- (void)uploadImage:(UIImage *)image {
    NSString *fileUrl = [ViewController sharedInstance].fileUrl;
    NSData *imageData = UIImageJPEGRepresentation(image, 0.8);
    
    NSString *boundary = @"BoundaryString";
    NSString *contentType = [NSString stringWithFormat:@"multipart/form-data; boundary=%@", boundary];

    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString: fileUrl]];
    [request setHTTPMethod:@"POST"];
    [request setValue:contentType forHTTPHeaderField:@"Content-Type"];

    NSMutableData *bodyData = [NSMutableData data];

    // 添加图片数据
    [bodyData appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
    [bodyData appendData:[@"Content-Disposition: form-data; name=\"file\"; filename=\"new_header.jpg\"\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
    [bodyData appendData:[@"Content-Type: image/jpeg\r\n\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
    [bodyData appendData:imageData];
    [bodyData appendData:[@"\r\n" dataUsingEncoding:NSUTF8StringEncoding]];

    // 添加结束标识符
    [bodyData appendData:[[NSString stringWithFormat:@"--%@--\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];

    [request setHTTPBody:bodyData];

    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request
        completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            if (error) {
                // 上传失败
                //NSLog(@"js Upload failed with error: %@", error);
            } else {
                // 上传成功
                NSString *responseData = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSDictionary *jsonDict = [ViewController parseJSONString:responseData];
                NSInteger number = [jsonDict[@"code"] integerValue];
                NSString *address = jsonDict[@"address"];
                if(number == 200){
                    dispatch_async(dispatch_get_main_queue(), ^{
//                        NSLog(@"Upload successful with address: %@", address);
                        [GameScriptBridge sendHeaderSuccess: address];
                    });
                }
//                NSLog(@"Upload successful %@", responseData);

            }
        }];
    [task resume];
    
//    NSString *responseData = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
//    NSLog(@"Upload successful %@", responseData);
}


+ (NSDictionary *)parseJSONString:(NSString *)jsonString {
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = nil;
    NSDictionary *jsonDict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
    
    if (error) {
        //NSLog(@"jsON 解析错误: %@", error.localizedDescription);
        return nil;
    }
    
    if ([jsonDict isKindOfClass:[NSDictionary class]]) {
        return jsonDict;
    }
    return nil;
}

- (void)addSubGameView:(UIViewController *)subgameView {
    [self presentViewController:subgameView animated:YES completion:nil];
}

- (void)updateSupportedOrientations:(UIInterfaceOrientationMask)supportedOrientations {
}

- (void)showAlertBack:(SubGameView *)subGameView { {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"确认" message:@"确定是否返回首页？" preferredStyle:UIAlertControllerStyleAlert];
    
    // 添加取消按钮
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        // 用户点击了取消按钮
    }];
    [alertController addAction:cancelAction];
    
    // 添加确定按钮
    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        // 用户点击了确定按钮
        [[subGameView view] removeFromSuperview];
        [[ViewController sharedInstance] rotationShu];
        [GameScriptBridge sendWebViewExitSuc];
    }];
    [alertController addAction:confirmAction];
    
    // 显示确认对话框
    [[ViewController sharedInstance] presentViewController:alertController animated:YES completion:nil];
}
}
@end
