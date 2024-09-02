package com.cocos.game.utils;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;

import java.io.OutputStream;

public class ScreenShot {
    private static final String TAG = "ScreenShot";

    @SuppressLint("LongLogTag")
    public static boolean takeScreenShot(Activity activiy){
        View view = activiy.getWindow().getDecorView();
        view.setDrawingCacheEnabled(true);
        view.buildDrawingCache();
        Bitmap b1 = view.getDrawingCache();


        Rect frame = new Rect();
        activiy.getWindow().getDecorView().getWindowVisibleDisplayFrame(frame);
        int statusBarHeight = frame.top;
        Log.e( TAG,""+statusBarHeight);

        WindowManager wm = (WindowManager)activiy.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics outMstrics = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(outMstrics);
        int width = outMstrics.widthPixels;
        int height = outMstrics.heightPixels;

        Bitmap b = Bitmap.createBitmap(b1,0,statusBarHeight,width,height-statusBarHeight);
        view.destroyDrawingCache();
        Log.e( TAG,"aaaaaaaaaaaa"+statusBarHeight);
        savePic(activiy,b,"");
        return true;



    }

    @SuppressLint("LongLogTag")
    public static void savePic(Activity activity,Bitmap b, String strFileName) {

        try {
            ContentValues value = new ContentValues();
            value.put(MediaStore.Images.Media.DISPLAY_NAME,System.currentTimeMillis()+"code.png");
            value.put(MediaStore.Images.Media.MIME_TYPE,"image/png");
//            value.put(MediaStore.Images.Media.PATH, Environment.DIRECTORY_PICTURES);
            Uri saveUri = activity.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,value);
            if (TextUtils.isEmpty(saveUri.toString())){
                Toast.makeText(activity,"保存失败",Toast.LENGTH_SHORT).show();

            }
            OutputStream outputStream = activity.getContentResolver().openOutputStream(saveUri);
            if (b.compress(Bitmap.CompressFormat.PNG,100,outputStream)){
                Toast.makeText(activity,"保存成功",Toast.LENGTH_SHORT).show();

            }else{
                Toast.makeText(activity,"保存失败",Toast.LENGTH_SHORT).show();
            }
        }catch (Exception e){
            e.printStackTrace();
        }

    }
}
