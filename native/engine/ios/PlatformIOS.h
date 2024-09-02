#include "cocos/platform/ios/IOSPlatform.h"
#include "GameScriptBridge.h"
namespace cc{
class PlatformIOS : public cc::IOSPlatform {
public:
    /**
     * @brief Start base platform initialization.
     */
    int32_t run(int argc, const char** argv) override;
private:
    GameScriptBridge* gameScriptBridge{nullptr};
};
}
