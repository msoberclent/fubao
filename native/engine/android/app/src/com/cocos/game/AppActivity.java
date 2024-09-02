/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package com.cocos.game;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration;
import android.util.Log;
import android.view.OrientationEventListener;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.ImageView;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.util.JSONObject1O;
import com.cocos.game.subgame.SubGameInfo;
import com.cocos.lib.JsbBridge;
import com.cocos.service.SDKWrapper;
import com.cocos.lib.CocosActivity;
import com.fm.openinstall.OpenInstall;
import com.fm.openinstall.listener.AppInstallAdapter;
import com.fm.openinstall.listener.AppWakeUpAdapter;
import com.fm.openinstall.model.AppData;
import com.kiwi.sdk.Kiwi;
import com.yalantis.ucrop.UCrop;

import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.MediaType;
import org.cocos2dx.okhttp3.MultipartBody;
import org.cocos2dx.okhttp3.OkHttpClient;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.RequestBody;
import org.cocos2dx.okhttp3.Response;

import java.io.File;
import java.io.IOException;
import java.util.Date;

public class AppActivity extends CocosActivity {

    private static final String TAG = "AppActivity";

    public static String packageName;
    public static Activity mActivity;

    public static WebView mWebView;

    public static WindowLifecycle windowLifecycle;

    private OrientationEventListener orientationEventListener;

    public SubGameInfo subGameInfo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // DO OTHER INITIALIZATION BELOW
        AppActivity.packageName = getPackageName();
        windowLifecycle = new WindowLifecycle(this);
        SDKWrapper.shared().init(this);
        GameUtils.getInstance().init(this);
//        PlatformUtils.init(this);
        mActivity = this;
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);//屏幕保持高亮
        OpenInstall.init(this);
        OpenInstall.getWakeUp(getIntent(), wakeUpAdapter);
//        CrashReport.initCrashReport(getApplicationContext(), "123123", false);
//        this.setJSBCall();
//        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
//        GameUtils.getInstance().getNativeOrientation();
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.shared().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.shared().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }
        SDKWrapper.shared().onDestroy();
        wakeUpAdapter = null;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.shared().onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null) {
            Uri selectedImageUri = data.getData();
            cropImage(selectedImageUri);
        } else  if (resultCode == RESULT_OK && requestCode == UCrop.REQUEST_CROP) {
            Uri croppedImageUri = UCrop.getOutput(data);
            if (croppedImageUri != null) {
                uploadImageToServer(croppedImageUri);
            }
        } else if (resultCode == UCrop.RESULT_ERROR) {
            final Throwable cropError = UCrop.getError(data);
            cropError.printStackTrace();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.shared().onNewIntent(intent);
        OpenInstall.getWakeUp(intent, wakeUpAdapter);
    }

    AppWakeUpAdapter wakeUpAdapter = new AppWakeUpAdapter() {
        @Override
        public void onWakeUp(AppData appData) {
            //获取渠道数据
            String channelCode = appData.getChannel();
            //获取绑定数据
            String bindData = appData.getData();
            Log.d("OpenInstall", "getWakeUp : wakeupData = " + appData.toString());
        }
    };

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.shared().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.shared().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.shared().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.shared().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.shared().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.shared().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.shared().onStart();
        super.onStart();
    }

    @Override
    public void onLowMemory() {
        SDKWrapper.shared().onLowMemory();
        super.onLowMemory();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        PermissionHelper.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }


    //--------------上传图片
    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int CROP_IMAGE_REQUEST = UCrop.REQUEST_CROP;
    private static String UPLOAD_HEADER_PATH;
    public void openUploadHeader(JSONObject data){
        AppActivity.UPLOAD_HEADER_PATH = data.getString("url");
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("image/*");
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }

    private void cropImage(Uri sourceUri) {
        Uri destinationUri = Uri.fromFile(new File(getCacheDir(), "cropped_image.jpg"));
        UCrop.of(sourceUri, destinationUri)
                .withAspectRatio(1, 1) // 设置裁剪比例为1:1
                .withMaxResultSize(150, 150) // 设置裁剪后的最大尺寸
                .start(this);
    }


    public void uploadImageToServer(Uri imageUri){
        if(AppActivity.UPLOAD_HEADER_PATH == null){
            return;
        }
        // 使用您选择的网络请求库或方法将图像上传到服务器
        // 这里只是一个简单的示例，您需要根据您的具体情况进行相应的实现
        // 示例中使用了 OkHttp 库进行网络请求
        File imageFile = new File(imageUri.getPath());

        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", imageFile.getName(), RequestBody.create(MediaType.parse("image/*"), imageFile))
                .build();

        Request request = new Request.Builder()
                .url(AppActivity.UPLOAD_HEADER_PATH)
                .post(requestBody)
                .build();

        OkHttpClient client = new OkHttpClient();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // 处理上传失败的情况
            }
            @Override
            public void onResponse(Call call, Response response) throws IOException {
                // 处理上传成功的情况
                // 根据服务器返回的响应进行相应的操作
                if(response.code() == 200){
                    GameUtils.getInstance().sendHeaderResult(response.body().string());
                }else{
                    GameUtils.showToastInMainThread(AppActivity.mActivity, "上传头像失败");
                }
            }
        });
    }
}
