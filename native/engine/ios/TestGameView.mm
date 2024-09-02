// TestGameView.m
#import "TestGameView.h"

@implementation TestGameView

// 在这里重写 supportedInterfaceOrientations 方法来支持横竖屏两种方向
- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskAll; // 支持横竖屏两种方向
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    UIButton *closeButton = [UIButton buttonWithType:UIButtonTypeSystem];
    [closeButton setTitle:@"关闭" forState:UIControlStateNormal];
    [closeButton addTarget:self action:@selector(closeButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    closeButton.frame = CGRectMake(20, 20, 100, 40);
    [self.view addSubview:closeButton];
}

- (void)closeButtonTapped:(UIButton *)sender {
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
