package com.cocos.game;

import android.animation.FloatEvaluator;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Base64;
import android.util.Log;
import android.view.Display;
import android.view.Surface;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.Toast;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSONPObject;
import com.cocos.game.subgame.SubGameInfo;
import com.cocos.lib.JsbBridge;
import com.cocos.lib.JsbBridgeWrapper;

import com.fm.openinstall.OpenInstall;
import com.fm.openinstall.listener.AppInstallAdapter;
import com.fm.openinstall.model.AppData;
import com.kiwi.sdk.Kiwi;
import com.yalantis.ucrop.UCrop;
import com.yalantis.ucrop.UCropActivity;

import org.apache.commons.lang3.StringUtils;
import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.OkHttpClient;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.net.NetworkInterface;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.Date;
import java.util.List;


public class GameUtils {

    private static final String TAG = "GameUtils";
    private static GameUtils _instance = null;

    public static int battery = 100;

    private static ClipboardManager clipboardManager = null;
    BatteryReceiver batteryReceiver;

    OkHttpClient client = new OkHttpClient();

    /**
     * 邀请数据
     */
    public JSONObject curOpenInstall;

    void getOpenInstallData(JSONObject jsonObject){
        if(curOpenInstall != null){
            jsonObject.put("data", curOpenInstall);
            JsbBridge.sendToScript("getOpenInstallData", jsonObject.toJSONString());
            return;
        }
        /*
          获取安装参数时请注意
          1. 不要在初始化之后，紧接着调用，容易导致获取数据失败；
          2. 在业务需要时再获取数据，保证SDK有充足的时间进行数据还原；
          3. 不要在返回AppData为空时，尝试使用此api进行重试获取数据。
         */
        OpenInstall.getInstall(new AppInstallAdapter() {
            @Override
            public void onInstall(AppData appData) {
                //获取渠道数据
                String channelCode = appData.getChannel();
                //获取自定义数据
                String bindData = appData.getData();
                if(StringUtils.isBlank(bindData)){
                    bindData = "{}";
                }
                JSONObject bindJson = JSONObject.parseObject(bindData);
                if(curOpenInstall == null){
                    curOpenInstall = new JSONObject();
                    curOpenInstall.put("channelCode", channelCode);
                    curOpenInstall.put("bindData", bindJson);
                }
                jsonObject.put("data", curOpenInstall);
                JsbBridge.sendToScript("getOpenInstallData", jsonObject.toJSONString());
            }
        });
    }

    public static GameUtils getInstance() {
        if (GameUtils._instance == null) {
            GameUtils._instance = new GameUtils();
        }
        return GameUtils._instance;
    }

    AppActivity activity;
    public void init(AppActivity activity){
        this.activity = activity;
        this.start();
        clipboardManager = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
    }

    public void start(){
        JsbBridge.setCallback(new JsbBridge.ICallback() {
            @Override
            public void onScript(String event, String data) {
                Log.e(TAG, "onScript: " + event + "----data:---" + data);
                JSONObject jsonData = null;
                if (StringUtils.isNotBlank(data)){
                    jsonData = JSONObject.parse(data);
                }else{
                    jsonData = new JSONObject();
                }
                switch (event){
                    case "getPackageName":
                        GameUtils.getInstance().getPackageName(jsonData);
                        break;
                    case "getDeviceInfo":
                        GameUtils.getInstance().getDeviceInfo(jsonData);
                        break;
                    case "setClipboardData":
                        GameUtils.getInstance().setClipboardData(jsonData);
                        break;
                    case "getClipBoardStr":
                        GameUtils.getInstance().getClipBoardStr(jsonData);
                        break;
                    case "goUrl":
                        GameUtils.getInstance().goUrl(jsonData);
                        break;
                    case "getMacAddress":
                        GameUtils.getInstance().getMacAddress(jsonData);
                        break;
                    case "get_native_orientation":
                        GameUtils.getInstance().getNativeOrientation(jsonData);
                        break;
                    case "getOpenInstallData":
                        GameUtils.getInstance().getOpenInstallData(jsonData);
                        break;
                    case "open_qq":
                        GameUtils.getInstance().openQQ(jsonData);
                        break;
                    case "open_wechat":
                        GameUtils.getInstance().openWechat(jsonData);
                        break;
                    case "open_subgame_url":
                        GameUtils.getInstance().openSubGameUrl(data);
                        break;
                    case "upload_header_start":
                        GameUtils.getInstance().activity.openUploadHeader(jsonData);
                        break;
                    case "get_app_version":
                        GameUtils.getInstance().getAppVersion(jsonData);
                        break;
                    case "get_battery_value":
                        GameUtils.getInstance().getBatteryValue(jsonData);
                        break;
                    case "getDosServer":
                        GameUtils.getInstance().getDosServer(jsonData);
                        break;
                    case "getDosServerInfo":
                        GameUtils.getInstance().getDosServerInfo(jsonData);
                        break;
                    case "SDKInit":
                        GameUtils.getInstance().SDKInit(jsonData);
                        break;
                    case "sendNativeGetRequest":
                        GameUtils.getInstance().sendGetRequest(jsonData);
                        break;
                    case "saveImage":
                        GameUtils.getInstance().saveImage(jsonData);
                        break;
                    case "getImage":
                        GameUtils.getInstance().getImage(jsonData);
                        break;
                    default:
                        Log.e(TAG, "event " + event + " call not found"  );
                        break;
                }
            }
        });
    }

    public void getDosServerInfo(JSONObject jsonObject){
        final StringBuffer ip = new StringBuffer();
        final StringBuffer port = new StringBuffer();
        // 请替换真实rs标识
        String httpName = jsonObject.getString("serverName");
        final int ret = Kiwi.ServerToLocal(httpName, ip, port);
        if (ret < 0) {
            jsonObject.put("code", ret);
            this.callToJs("getDosServerInfo", jsonObject.toJSONString());
            Log.d("kiwidemo", "call ServerToLocal failed " + ret);
        }else{
            jsonObject.put("ip",  ip.toString());
            jsonObject.put("port",  port.toString());
        }
        jsonObject.put("code", 0);
        this.callToJs("getDosServerInfo", jsonObject.toJSONString());
    }

    public void SDKInit(JSONObject jsonObject) {
        int rsult = Kiwi.init("o0Zg8npztGr9exGnLajeSOLzdCJGFQHrnwN+9nJ1RMayMtuNDxhCNruMOcrEaGlM/DCnCEfu5Bf72flUOk5pGBNlg2pXXUrCjXpvQDrRiSmFla3yXNvJgv42gYZk7RLGL5IJslQdVkLl2G06xOyLGybAFVCUxdsXxHWBoeLPBZ1726VwAAzHnd3eJcRCe1Rp+A2+TZbVhuY9W7SdvOnytMaCPZ1BlvZo4AxTLGkZ78w64WaWsFJoMTPJnVMwz7aS/NG+o90JR9j1UVGpbJ35zskKbLt4ZQZWLY7UWxNT4Tnq2iBvPhOX894/glv2LceLyRhQJl+V7iWMq7HdxYZheyTW9xvHq0RAlihEtYf31k9bS4SS0VtmfnXUwHqbsXXbGTQ8UQl7ygHLYUr0vD5jEIQFvtNKTTDGT8SFms4luXvuNiE0fbw5XAtyYfCMRRQyC3h/KS5e9gjv6NP9DyVHrbEnOYNrUf/kMuwDqoZas47RtWRAbT3MHinkfbp+xyyXFOpSpEBTb0Sk2Vtj2hU27/8J3gCRPzwHULXXdW2k71ygMxMEu1O2K2piD9g8HjjT+gmu47uU7ZCM6ASEHtpVs6f0PAfIXXAQMkpDCjqB/xcyyvkycr1EhErYnZgfJ2YWp+sb/hwjlzmedYhvGMhWt7ZpiG6mP4rJoYkJtQcbY0d+j30YDvuNtueCmfb9kUk/RS/O1ufOq/PafFKC1FZX6vIAShTDhZ3bFY0P2Tyn1FxXkZDnylI8aWuEv5Ee84LY+Z5kx6xll+r7EgiePvTc7DUknh7E3ffq6tjFJFr7IY/hhbRbB0nJL4H9bcNd+mAXw82ou2hIKNFcaXCY2aAEvfhCnYssz/1acOTP1tIeO0Lz/Ejgpk2YtyIWieTndLRro2QEoWxp/0mMQQawcPk2TYVtNHNA3crd/2tTYf2SeVChBKglXAbPj3JY9fehAK2jg77NU2KQ19/9xCZMgTS6S3GQBVAQX2eaFY1RjeMN1/Ca5FwOKW9Afg/PZqOmSCzL9jn9rdPriWiivpOzvajsgjVwz55v14O+K7v7qW9JQig/C2vSocc5VBFP5DmEIi7db68/ObbYIsfnXJ45DMafClJ8HbKo5hSPP6ShW8KpgWB2a6o5U4mBY6wr/UO2Ruv3G/YkRqzwp/QWoYVaWZfL3zL6cwPt34vte6LOQ1ykzL42tZscXEzIG96Yjm39k/97jd1jvK5r2aPXChzKJL/J4ff5jcftI+KvWMJXVSrNQSSydJZOjc9SY60t+CW5nozdigersI6Wd3YwJb/TG91DzbqONJsauPz8rTQuA0lSUtIBC1q23W3q01F0ff1ECZUfJXxFx0qBQ5A+Xo2GNT8z6VyH3ManZiOHXyr/kyy+iw8J7VF2vED0OIocHDZ4Ybw0zuJh+g8wLCq9QR5Qgca2/J4TCVEytJf4JpbokoL9yXPJwSPP5k6r1dUmwZ44xH4McGUbGYIZfWESNyyNmnoxGSehIQ8U32IEhQuleiksOqnfpbxau8WuaZrVZTMpWB6wKyre+e3Ym+RdFHBq5S3d6joGhLfJ9WxHa66Jfvv973zM4WqJ1MazhaP5KYVF21CdtTQ69Hi+3c1pS1ikcBIN99Sgop6wXMCYjbh7nenc2msV6MLA+YOIy5snfG9UhS3S12Aqqr7cipJCFG2NsZBEppcGBFpA1wvjkNHCEgcxZXvwZL2xIsQQS6oXhQsMZ6j4BKoySDpWDhkkMHIOYFcIZGMtqVKZ7SVupd3zh82CY05T67Lu97DQmRtJs6dNw7RcFRs0iYzJZf2JEmr3phCdqLMiLRVXD+iF9NgEdVVMIKlNuA3rhHuaLqBrq0rhFe7SlAnqCwiR6qtKIi3LXRcs4UqOpmCcQBPFmh6CDm+u5rXHB5nu4/2AaYnyM8seH57LqDhkYwLAUiY+TCjsFJZfzPVYJWXOrVU1uwk/ZZIdD6oMdB1YJH1y6aWzcASjw0Th");
        jsonObject.put("result", rsult);
        this.callToJs("SDKInit", jsonObject.toJSONString());
    }

    public void getImage(JSONObject jsonObject){
        String imageUrl = jsonObject.getString("path");
        File file = new File(imageUrl);
        String base64Image = this.fileToBase64(file);
        byte[] decodedBytes = Base64.decode(base64Image, Base64.DEFAULT);
        Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        this.saveImageToGallery(activity, bitmap, file.getName(), "");
    }

    public String fileToBase64(File file) {
        FileInputStream fileInputStream = null;
        try {
            // 读取文件到字节数组
            fileInputStream = new FileInputStream(file);
            byte[] bytes = new byte[(int) file.length()];
            fileInputStream.read(bytes);
            // 使用Base64编码字节数组
            return Base64.encodeToString(bytes, Base64.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } finally {
            try {
                if (fileInputStream != null) {
                    fileInputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void saveImage(JSONObject jsonObject){
        String base64Image = jsonObject.getString("imageStr");
        String imageName = jsonObject.getString("imageName");
        byte[] decodedBytes = Base64.decode(base64Image, Base64.DEFAULT);
        Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        this.saveImageToGallery(activity, bitmap, imageName, "");
    }

    public  void saveImageToGallery(Context context, Bitmap bitmap, String title, String description) {
        ContentValues values = new ContentValues();
        values.put(MediaStore.Images.Media.TITLE, title);
        values.put(MediaStore.Images.Media.DESCRIPTION, description);
        values.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
        values.put(MediaStore.Images.Media.DATE_ADDED, System.currentTimeMillis());
        values.put(MediaStore.Images.Media.DATE_TAKEN, System.currentTimeMillis());

        // Inserting the Bitmap into MediaStore and getting the content URI
        android.net.Uri uri = context.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);

        // Open an OutputStream to the URI and write the bitmap data
        try {
            java.io.OutputStream outputStream = context.getContentResolver().openOutputStream(uri);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
            if (outputStream != null) {
                outputStream.close();
            }
        } catch (java.io.IOException e) {
            e.printStackTrace();
        }
    }

    public void sendGetRequest(JSONObject jsonObject) {

        String url = jsonObject.getString("url");
        Request request = new Request.Builder()
                .url(url)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // 请求失败时的处理
                jsonObject.put("code", -1);
                GameUtils.getInstance().callToJs("sendGetRequest", jsonObject.toJSONString());
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    // 请求成功，处理响应数据
                    String responseData = response.body().string();
                    jsonObject.put("result", JSON.parse(responseData));
                    GameUtils.getInstance().callToJs("sendGetRequest", jsonObject.toJSONString());
                    // 在这里处理响应数据，例如解析JSON等操作
                } else {
                    jsonObject.put("code", -1);
                    GameUtils.getInstance().callToJs("sendGetRequest", jsonObject.toJSONString());
                    // 请求失败，处理失败响应
                    // response.code() 包含了响应的HTTP状态码
                }
            }
        });

    }

    public void getDosServer(JSONObject jsonObject){
        final StringBuffer ip = new StringBuffer();
        final StringBuffer port = new StringBuffer();
        // 请替换真实rs标识
        String httpName = jsonObject.getString("httpName");
        final int ret = Kiwi.ServerToLocal(httpName, ip, port);
        if (ret < 0) {
            jsonObject.put("code", ret);
            this.callToJs("getDosServer", jsonObject.toJSONString());
            Log.d("kiwidemo", "call ServerToLocal failed " + ret);
            return;
        }else{
            jsonObject.put("http", "http://" + ip.toString() + ":" + port.toString());
        }

        final StringBuffer sip = new StringBuffer();
        final StringBuffer sport = new StringBuffer();
        String socketName = jsonObject.getString("socketName");
        final int tcpret = Kiwi.ServerToLocal(socketName, sip, sport);
        if (tcpret < 0) {
            jsonObject.put("code", tcpret);
            this.callToJs("getDosServer", jsonObject.toJSONString());
            Log.d("kiwidemo", "call ServerToLocal failed " + tcpret);
            return;
        }else{
            jsonObject.put("ws", "ws://" + sip.toString() + ":" + sport.toString());
        }
        jsonObject.put("code", 0);
        this.callToJs("getDosServer", jsonObject.toJSONString());
    }

    /**
     * 获取设备唯一编码
     * @param jsonObject
     */

    public void getMacAddress(JSONObject jsonObject){
        try{
            String value = MarAddressUtils.getUniId(activity);
            jsonObject.put("uniId", value);
            this.callToJs("getMacAddress", jsonObject.toJSONString());
        }catch (Exception E){

        }

    }


    /**
     * 获取设备唯一编码
     * @param jsonObject
     */

    public void goUrl(JSONObject jsonObject){
        Intent intent = new Intent();
        intent.setAction("android.intent.action.VIEW");
        Uri content_url = Uri.parse(jsonObject.getString("url"));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setData(content_url);
        activity.startActivity(intent);
    }

    public void getDeviceInfo(JSONObject jsonObject) {
        JSONObject info = new JSONObject();
        info.put("model", Build.MODEL);
        info.put("brand", Build.BRAND);
        info.put("system", Build.VERSION.RELEASE);
        jsonObject.put("info", info);
        this.callToJs("getDeviceInfo", jsonObject.toJSONString());
    }

    public void getPackageName(JSONObject jsonObject) {
        jsonObject.put("packageName", AppActivity.packageName);
        this.callToJs("getPackageName", jsonObject.toJSONString());
    }


    /**
     * 设置粘贴板
     * @param jsonObject
     */
    public void setClipboardData(JSONObject jsonObject){
        ClipData myClip = ClipData.newPlainText("text", jsonObject.getString("str"));
        clipboardManager.setPrimaryClip(myClip);
    }


    /**
     * 获取粘贴板
     * @param jsonObject
     */
    public void getClipBoardStr(JSONObject jsonObject){
        String str = "";
        if (clipboardManager.hasPrimaryClip()){
            ClipData clipData = clipboardManager.getPrimaryClip();
            if (clipData != null)
            {
                ClipData.Item item = clipData.getItemAt(0);
                if (item != null)
                {
                    CharSequence charTemp = item.getText();
                    if(charTemp != null)
                        str= charTemp.toString();
                }
            }
        }
        jsonObject.put("str", str);
        this.callToJs("getClipBoardStr", jsonObject.toJSONString());
    }



    public String toMD5(String text) throws NoSuchAlgorithmException {
        //获取摘要器 MessageDigest
        MessageDigest messageDigest = MessageDigest.getInstance("MD5");
        //通过摘要器对字符串的二进制字节数组进行hash计算
        byte[] digest = messageDigest.digest(text.getBytes());

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < digest.length; i++) {
            //循环每个字符 将计算结果转化为正整数;
            int digestInt = digest[i] & 0xff;
            //将10进制转化为较短的16进制
            String hexString = Integer.toHexString(digestInt);
            //转化结果如果是个位数会省略0,因此判断并补0
            if (hexString.length() < 2) {
                sb.append(0);
            }
            //将循环结果添加到缓冲区
            sb.append(hexString);
        }
        //返回整个结果
        return sb.toString();
    }


    public void getNativeOrientation(JSONObject jsonObject){
        int value = GameUtils.getInstance().getScreenOrientation(this.activity);
        jsonObject.put("type", value);
        JsbBridge.sendToScript("get_native_orientation", jsonObject.toJSONString());
    }

    public void sendWebViewExitSuc(SubGameInfo subGameInfo){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("gameId", subGameInfo.getGameId());
        jsonObject.put("direction", subGameInfo.getDirection());
        JsbBridge.sendToScript("exit_subgame", jsonObject.toJSONString());
    }

    public void sendHeaderResult(String body){
        JSONObject json = JSONObject.parse(body);
        String address = json.getString("address");
        JsbBridge.sendToScript("header_upload_end", address);
    }

    public boolean checkApkExist(Context context, String packageName) {
        if (packageName == null || "".equals(packageName))
            return false;
        try {
            ApplicationInfo info = context.getPackageManager().getApplicationInfo(packageName,
                    PackageManager.GET_UNINSTALLED_PACKAGES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    public void getAppVersion(JSONObject jsonObject){
        jsonObject.put("versionName", GameUtils.getAppVersion(this.activity));
//        jsonObject.put("versionCode", GameUtils.getAppCode(this.activity));
        this.callToJs("get_app_version", jsonObject.toJSONString());
    }

    public void getBatteryValue(JSONObject jsonObject){
        jsonObject.put("versionName", GameUtils.getAppVersion(this.activity));
//        jsonObject.put("versionCode", GameUtils.getAppCode(this.activity));
        this.callToJs("get_app_version", jsonObject.toJSONString());
    }

    public static void openSubGameUrl(String data){
        AppActivity mActivity = GameUtils.getInstance().activity;
        Intent intent = new Intent(mActivity, SubGameWebView.class);
        SubGameInfo subGameInfo = JSONObject.parseObject(data,SubGameInfo.class);
        mActivity.subGameInfo = subGameInfo;
        intent.putExtra("gameInfo", JSONObject.toJSONString(subGameInfo));
        mActivity.startActivityForResult(intent,5200);
    }

    public static void showToastInMainThread(final Context context, final String message) {
        Handler handler = new Handler(Looper.getMainLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
            }
        });
    }


    private void openQQ(JSONObject data){
        try {
            String qqNumber = data.getString("value");
            if (checkApkExist(this.activity, "com.tencent.mobileqq")) {
                String qqUrl = "mqqwpa://im/chat?chat_type=wpa&uin="+ qqNumber +"&version=1";
                this.activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(qqUrl)));
            } else {
                this.showToastInMainThread(this.activity,"未检测到QQ应用");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void openWechat(JSONObject data){
        try {
            String wechatId = data.getString("value");
            if (checkApkExist(this.activity, "com.tencent.mm")) {
                this.activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("weixin://")));
                ClipData myClip = ClipData.newPlainText("text", wechatId);
                clipboardManager.setPrimaryClip(myClip);
                this.showToastInMainThread(this.activity,"微信账号以复制到粘贴板,请添加好友");
            } else {
                this.showToastInMainThread(this.activity,"未检测到微信应用");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void callToJs(String eventName, String data){
        JsbBridge.sendToScript(eventName, data);
    }


    public int getScreenOrientation(Context context) {
        WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        Display display = windowManager.getDefaultDisplay();

        int rotation = display.getRotation();
        int orientation = context.getResources().getConfiguration().orientation;
        if ((rotation == android.view.Surface.ROTATION_0 || rotation == Surface.ROTATION_90) && orientation == android.content.res.Configuration.ORIENTATION_LANDSCAPE) {
            // 左横屏模式
            return 0;
        } else if ((rotation == android.view.Surface.ROTATION_90 || rotation == android.view.Surface.ROTATION_270) && orientation == android.content.res.Configuration.ORIENTATION_LANDSCAPE) {
            // 右横屏模式
            return 1;
        } else {
            // 其他模式，例如竖屏或反向竖屏
            return -1;
        }
    }

    public static int getBattery() {
        GameUtils.battery =PlatformUtils.getBattery();
        return GameUtils.battery;
    }



    private static int getAppCode(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            Log.e("AppUtils", "Error while retrieving app version", e);
        }
        return 1;
    }


    private static String getAppVersion(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            Log.e("AppUtils", "Error while retrieving app version", e);
        }
        return "";
    }
}

