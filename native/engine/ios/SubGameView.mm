#import <Foundation/Foundation.h>
#import "SubGameView.h"
#import "GameScriptBridge.h"
#import "AppDelegate.h"

@implementation SubGameView

static NSString *token;

static NSString *exitRequestUrl;

static NSNumber *gameId;

static NSString *gameUrl;

static NSNumber *direction;

static NSString *uid;

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

- (id) getExitUrl{
    return exitRequestUrl;
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
  
       // 在屏幕方向变化时调整 WKWebView 的大小
       [coordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext>  _Nonnull context) {
         
       } completion:nil];
}


- (BOOL)isLandscapeOrientation {
    UIDeviceOrientation deviceOrientation = [[UIDevice currentDevice] orientation];
    return UIDeviceOrientationIsLandscape(deviceOrientation);
}

- (BOOL)isPortraitOrientation {
    UIDeviceOrientation deviceOrientation = [[UIDevice currentDevice] orientation];
    return UIDeviceOrientationIsPortrait(deviceOrientation);
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskAll;
}

//// LandscapeViewController内部代码
//- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
//    NSLog(@"js preferredInterfaceOrientationForPresentation SubGameView");
//    return UIInterfaceOrientationPortrait;
//}

+ (void)setSubGameData:(NSDictionary *)value {
    exitRequestUrl = value[@"exitRequestUrl"];
    token = value[@"token"];
    gameId = value[@"gameId"];
    direction = value[@"direction"];
    gameUrl = value[@"gameUrl"];
    uid = value[@"uid"];
    // 使用stringByReplacingOccurrencesOfString:withString:方法替换所有双引号为单引号
    NSString *replacedUrl = [value[@"gameUrl"] stringByReplacingOccurrencesOfString:@"\"" withString:@"'"];
    gameUrl = replacedUrl;
}



- (instancetype)initWithParameter:(NSDictionary *)parameter {
    self = [super init];
    if (self) {
        // 在初始化过程中使用传递的参数
        _parameter = parameter;
        
        [SubGameView setSubGameData: parameter];
        
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
//    self.containerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height)];
//    self.containerView.translatesAutoresizingMaskIntoConstraints = NO;
//    [self.view addSubview:self.containerView];
    // 使用 Auto Layout 设置容器视图的约束
//    [NSLayoutConstraint activateConstraints:@[
//        [self.containerView.topAnchor constraintEqualToAnchor:self.view.topAnchor],
//        [self.containerView.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor],
//        [self.containerView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
//        [self.containerView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor]
//    ]];
    
    WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];

    
//    WKWebView *webView = [[WKWebView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height) configuration:configuration];
    
    WKWebView *webView = [[WKWebView alloc] initWithFrame:[UIScreen mainScreen].bounds configuration:configuration];
    
    
    
    webView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    webView.scrollView.scrollEnabled = NO;
    webView.scrollView.bounces = NO;
    webView.UIDelegate = self;
    webView.navigationDelegate = self;
    webView.backgroundColor = [UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:1.0]; // 黑色;
    webView.allowsBackForwardNavigationGestures = false;
    webView.allowsLinkPreview = false;
//    [webView stopLoading];
    self.webView = webView;
//    [self.containerView addSubview:self.webView];
    [self.view addSubview:self.webView];
    
    self.webView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.webView.topAnchor constraintEqualToAnchor:self.view.topAnchor].active = YES;
    [self.webView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor].active = YES;
    [self.webView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor].active = YES;
    [self.webView.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor].active = YES;
    
    
    // 加载网页	
   NSURL *url = [NSURL URLWithString: gameUrl];
//    NSURL *url=[NSURL URLWithString:@"https://www.baidu.com"];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
   [self.webView loadRequest:request];
    
    self.exitRequestUrl = exitRequestUrl;
    self.gameId = gameId;
    self.token = token;
    self.direction = direction;
    // 改为横屏方向
    // 创建悬浮按钮
    self.floatingButton = [UIButton buttonWithType:UIButtonTypeCustom];
  
    UIImage *image = [UIImage imageNamed:@"home"];
    self.floatingButton.transform = CGAffineTransformMakeScale(0.5, 0.5);
    self.floatingButton.frame = CGRectMake(15, 15, image.size.width, image.size.height);
    [self.floatingButton setImage:image forState:UIControlStateNormal];
    self.floatingButton.layer.cornerRadius = 5.0;
    self.floatingButton.userInteractionEnabled = true;
    self.floatingButton.layer.masksToBounds = YES;
    [self.view addSubview:self.floatingButton];
        
    // 创建UIPanGestureRecognizer对象
    UIPanGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(handlePan:)];
    // 将手势添加到按钮上
    [self.floatingButton addGestureRecognizer:panGesture];
        
    [self.floatingButton addTarget:self action:@selector(backBtnTouch:) forControlEvents:UIControlEventTouchUpInside];
    
    
   
}


- (void)handlePan:(UIPanGestureRecognizer *)gesture {
    // 获取手势在视图中的偏移量
    CGPoint translation = [gesture translationInView:self.view];
   CGPoint newCenter = CGPointMake(gesture.view.center.x + translation.x, gesture.view.center.y + translation.y);
   
   // 计算按钮在屏幕中的边界
   CGFloat minX = gesture.view.frame.size.width / 2.0;
   CGFloat maxX = self.view.bounds.size.width - gesture.view.frame.size.width / 2.0;
   CGFloat minY = gesture.view.frame.size.height / 2.0;
   CGFloat maxY = self.view.bounds.size.height - gesture.view.frame.size.height / 2.0;
       
       // 限制按钮的移动范围
   newCenter.x = MAX(minX, MIN(maxX, newCenter.x));
   newCenter.y = MAX(minY, MIN(maxY, newCenter.y));
   
   gesture.view.center = newCenter;
   [gesture setTranslation:CGPointZero inView:self.view];
}

- (void)forcePortraitOrientation {
    NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
    [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];
}


- (void) executeExitRequest:(UIButton *)sender {
    // 创建 URL 对象
//    sender.enabled = YES;
    [self.view removeFromSuperview];
    [[ViewController sharedInstance] rotationShu];
    [GameScriptBridge sendWebViewExitSuc];
    return;
//    sender.enabled = NO;
//    NSString *exitRequestUrl = self.exitRequestUrl;
//    NSURL *url = [NSURL URLWithString: exitRequestUrl];
//    // 创建请求对象
//    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
//    [request setHTTPMethod:@"POST"];
//
//    // 设置请求参数
//    NSDictionary *parameters = @{@"gameId": gameId, @"uid": uid};
//    NSError *error;
//    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:parameters options:0 error:&error];
//
//    // 设置请求头
//    [request setValue:token forHTTPHeaderField:@"token"];
//    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
//    [request setHTTPBody:jsonData];
//    
//    // 发送请求
//    NSURLSession *session = [NSURLSession sharedSession];
//    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
//        if (error) {
//            NSLog(@"请求发生错误：%@", error);
//            return;
//        }
//        // 处理响应数据
//        NSString *responseData = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
//        NSDictionary *jsonDict = [SubGameView parseJSONString:responseData];
//        NSInteger number = [jsonDict[@"code"] integerValue];
//        NSLog(@"result %@", responseData);
//        if(number == 200){
//            dispatch_async(dispatch_get_main_queue(), ^{
//                sender.enabled = YES;
//                [[ViewController sharedInstance] rotationHeng];
//                [self.view removeFromSuperview];
//    //            [ self dismissViewControllerAnimated:YES completion:nil];
//                [GameScriptBridge sendWebViewExitSuc];
//            });
//        }else{
//            dispatch_async(dispatch_get_main_queue(), ^{
//                sender.enabled = YES;
//            });
////            sender.enabled = YES;
//        }
//    }];
//    [dataTask resume];
}

// 定义按钮点击事件的处理方法
- (void)backBtnTouch:(UIButton *)sender {
//    // 创建确认对话框
//    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"确认" message:@"确定退出当前游戏？" preferredStyle:UIAlertControllerStyleAlert];
//
//    // 添加取消按钮
//    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//        // 用户点击了取消按钮
//    }];
//    [alertController addAction:cancelAction];
//
//    // 添加确定按钮
//    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
//        // 用户点击了确定按钮
//        [self executeExitRequest: sender];
//    }];
//    [alertController addAction:confirmAction];
//
//    // 显示确认对话框
//    [self presentViewController:alertController animated:YES completion:nil];
    [[ViewController sharedInstance] showAlertBack:self];
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

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    NSNumber *direction = self.direction;
    NSInteger directionValue = [direction integerValue];
    if(directionValue == 1){
//        //竖屏
    }else{
        [[ViewController sharedInstance] rotationHeng];
    }
}

@end
