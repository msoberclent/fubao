#include "PlatformIOS.h"

namespace cc{

int32_t PlatformIOS::run(int argc, const char** argv) {
    gameScriptBridge = [GameScriptBridge new];
    return 0;
}
}//namespace cc
