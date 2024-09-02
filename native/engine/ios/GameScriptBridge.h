
#import <Foundation/Foundation.h>

@interface GameScriptBridge:NSObject

+(id) sendWebViewExitSuc;

+(id) sendHeaderSuccess:(NSString *) address;

+(id) sendLocationInfo: (NSMutableDictionary *) jsonDict;
@end
