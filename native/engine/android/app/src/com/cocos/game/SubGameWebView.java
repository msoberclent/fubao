package com.cocos .game;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.alibaba.fastjson2.JSONObject;
import com.cocos.game.subgame.SubGameInfo;
import com.game.slogame.R;

import org.apache.commons.lang3.StringUtils;
import org.cocos2dx.okhttp3.MediaType;
import org.cocos2dx.okhttp3.OkHttpClient;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.RequestBody;
import org.cocos2dx.okhttp3.Response;


public class SubGameWebView  extends Activity {

    private static final String TAG = "SubGameWebView";

    private Activity activity;

    private SubGameInfo subGameInfo;

    public static String LOCAL_PATH_WEB = "/webcache";

    private WebView gameWebView;

    private TextView mbutton2;

    private TextView rotationButton;
    // 控件上一次所处的坐标
    private float lastX = 0;
    private float lastY = 0;
    // 记录控件开始位置
    private float beginX = 0;
    private float beginY = 0;
    // 屏幕的宽度和高度
//    private int screenWidth;
//    private int screenHeight;

    WindowManager windowManager;
    void initViewInfo(){
        WindowManager windowManager = getWindowManager();
        this.windowManager = windowManager;
//        screenWidth = windowManager.getDefaultDisplay().getWidth();
//        screenHeight = windowManager.getDefaultDisplay().getHeight();
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);//屏幕保持高亮
        setContentView(R.layout.activity_web);

        activity = this;
        Intent intent = this.getIntent();
        Bundle bundle = intent.getExtras();
        String gameInfo  = bundle.getString("gameInfo");
        subGameInfo = JSONObject.parseObject(gameInfo, SubGameInfo.class);
//        this.rotationView();
        // setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
       if(subGameInfo.getDirection() == 0){
//            Log.e(TAG, "js 横屏");
           setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
       }else if(subGameInfo.getDirection() == 1){
//            Log.e(TAG, "js 竖屏" );
           setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT);
       }else{
           setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
       }
        initViewInfo();
        InitWebView();
    }

    @SuppressLint("LongLogTag")
    public static void showExitDialog(String text){
        new AlertDialog.Builder(AppActivity.windowLifecycle.getCurrentActivity())
                .setTitle("Notice")
                .setMessage(text)
                .setPositiveButton("OK",null)
                .show();
    }

    @SuppressLint("LongLogTag")
    private void InitWebView() {
        //mWebView = new WebView(getApplicationContext());
        gameWebView = (WebView) findViewById(R.id.wv_content);
        WebSettings settings = gameWebView.getSettings();

        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        settings.setJavaScriptEnabled(true);
        settings.setBlockNetworkImage(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setCacheMode(settings.LOAD_DEFAULT);
        settings.setAppCacheEnabled(true);
        settings.setAppCachePath(SubGameWebView.LOCAL_PATH_WEB);
        gameWebView.setWebContentsDebuggingEnabled(true);

        gameWebView.setBackgroundColor(0);
        gameWebView.getBackground().setAlpha(0);
        gameWebView.loadUrl(this.subGameInfo.getGameUrl());
        gameWebView.setWebViewClient(new WebViewClient(){
            public void onPageFinished(WebView view, String url) {
            }
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
            }
            public void onLoadResource(WebView view, String url) {
            }
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
            public void onReceivedError(WebView view,int errorCode,String description,String failingUrl){
            }
        });
        //mWebView.addJavascriptInterface(appToJsObject, "android");
        mbutton2 = findViewById(R.id.button2);
        mbutton2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                confirm2Exit();
//                exitWebViewGame();
            }
        });


        mbutton2.setOnTouchListener(new View.OnTouchListener() {


            @Override
            public boolean onTouch(View v, MotionEvent event) {
                return moveButton(v, event);
            }
        });

        rotationButton = findViewById(R.id.rotationButton);
        rotationButton.setVisibility(View.GONE);
    }



    private void confirm2Exit() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("确认");
        builder.setMessage("确定要退出吗？");
        // 设置取消按钮
        builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // 用户点击了取消按钮
                dialog.dismiss(); // 关闭对话框
            }
        });

        // 设置确定按钮
        builder.setPositiveButton("确定", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // 用户点击了确定按钮

                exitWebViewGame();
            }
        });
        // 显示对话框
        AlertDialog dialog = builder.create();
        dialog.show();
    }


    private boolean moveButton(View v, MotionEvent event){
        switch (event.getAction()) {

            case MotionEvent.ACTION_DOWN:

                //获取点击时x y 轴的数据

                lastX = event.getRawX();

                lastY = event.getRawY();

                // 记录控件开始位置

                beginX = lastX;

                beginY = lastY;

                break;

            case MotionEvent.ACTION_UP:
                // 解决拖拽的时候松手点击事件触发

                if (Math.abs(lastX - beginX) < 10 && Math.abs(lastY - beginY) < 10){
                }else{
                    return true;
                }
                break;

            case MotionEvent.ACTION_MOVE:

                //获得x y轴的偏移量

                int dx = (int) (event.getRawX() - lastX);

                int dy = (int) (event.getRawY() - lastY);

                //获得控件上下左右的位置信息,加上我们的偏移量,新得到的位置就是我们控件将要出现的位置

                int l = v.getLeft() + dx;

                int b = v.getBottom() + dy;

                int r = v.getRight() + dx;

                int t = v.getTop() + dy;

                //判断四个实际位置,如果有一边已经划出屏幕,那就把这边位置设置为0然后相反的边的位置就设置成控件的高度或者宽度

                if (l < 0) {

                    l = 0;

                    r = l + v.getWidth();

                }

                if (t < 0) {

                    t = 0;

                    b = t + v.getHeight();

                }

                if (r > windowManager.getDefaultDisplay().getWidth()) {

                    r = windowManager.getDefaultDisplay().getWidth();

                    l = r - v.getWidth();

                }

                if (b > windowManager.getDefaultDisplay().getHeight()) {

                    b = windowManager.getDefaultDisplay().getHeight();

                    t = b - v.getHeight();

                }

                //然后使用我们view的layout重新在布局中把我们的控件画出来

                v.layout(l, t, r, b);

                //并把现在的x y设置给lastx lasty

                lastX = (int) event.getRawX();

                lastY = (int) event.getRawY();

                v.postInvalidate();//绘制

                break;

            default:

                break;
        }
        return false;
    }

    @SuppressLint("LongLogTag")
    private void exitWebViewGame()  {
        mbutton2.setEnabled(false);
//        new Thread(new Runnable() {
//            @Override
//            public void run() {
//                try{
//                    String exitGameUrl = subGameInfo.getExitRequestUrl();
//                    if(StringUtils.isBlank(exitGameUrl) || "none".equals(exitGameUrl)){
//                        Intent intent = new Intent(activity,AppActivity.class);
//                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//                        startActivity(intent);
//                        return;
//                    }
//                    MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
//                    JSONObject reqData = new JSONObject();
//                    reqData.put("gameId", subGameInfo.getGameId());
//                    reqData.put("uid", subGameInfo.getUid());
//                    RequestBody body = RequestBody.create(mediaType, reqData.toJSONString());
//                    OkHttpClient okHttpClient = new OkHttpClient();
//                    String token = subGameInfo.getToken();
////                    String exitGameUrl = subGameInfo.getExitRequestUrl();
//                    Request request = new Request.Builder().addHeader("token", token).post(body).url(exitGameUrl).build();
//                    Response response = okHttpClient.newCall(request).execute();
//                    String responBody = response.body().string();
//                    JSONObject resp = JSONObject.parseObject(responBody);
//                    if( 200 == response.code() && resp.getIntValue("code") == 200){
//                        GameUtils.getInstance().sendWebViewExitSuc(subGameInfo);
//                        subGameInfo = null;
//                        Intent intent = new Intent(activity,AppActivity.class);
//                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//                        startActivity(intent);
//                    }else{
//                        mbutton2.setEnabled(true);
//                        GameUtils.showToastInMainThread(activity, resp.getString("msg"));
//                    }
//                }catch (Exception e){
//                    mbutton2.setEnabled(true);
//                    GameUtils.showToastInMainThread(activity, "关闭游戏失败,请重试");
//                }
//            }
//        }).start();
        GameUtils.getInstance().sendWebViewExitSuc(subGameInfo);
        subGameInfo = null;
        Intent intent = new Intent(activity,AppActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
    }

    @Override
    public void onBackPressed() {
        //这里写自己的处理逻辑代码
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(gameWebView != null){
            gameWebView.destroyDrawingCache();
            gameWebView.clearCache(true);
            gameWebView.destroy();

        }
    }
}
