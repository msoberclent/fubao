@REM @REM 加密图片
python encrypt.py \\build\\web-mobile\\assets

@REM @REM 混淆解密插件代码，防止分析解密算法与密钥，建议此处的加密插件文件名也设置为无意义的文件名，此处为了演示文件名具有意义
javascript-obfuscator ..\build\web-mobile\src\assets\plugin\decrypt_plugin.js --output ..\build\web-mobile\src\assets\plugin\decrypt_plugin.js


pause