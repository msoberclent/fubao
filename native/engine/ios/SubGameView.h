#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import "ViewController.h"
@interface SubGameView : UIViewController <WKUIDelegate, WKNavigationDelegate>

@property (nonatomic, strong) NSDictionary *parameter;

@property (nonatomic, strong) NSString *token;

@property (nonatomic, strong) NSString *exitRequestUrl;

@property (nonatomic, strong) NSNumber *gameId;

@property (nonatomic, strong) NSString *gameUrl;

@property (nonatomic, strong) NSNumber *direction;

- (instancetype)initWithParameter:(NSDictionary *)parameter;

@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) UIView *containerView;
@property (nonatomic, strong) UIButton *floatingButton;

@end
