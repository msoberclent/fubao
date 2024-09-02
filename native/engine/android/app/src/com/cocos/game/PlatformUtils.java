package com.cocos.game;

import static android.content.Context.WIFI_SERVICE;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;


import com.cocos.lib.CocosHelper;


import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.net.NetworkInterface;
import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class PlatformUtils {
    private static Context sContext = null;
    private static Activity sActivity = null;
    private static ClipboardManager clipboardManager = null;
    private static BatteryReceiver sBatteryReceiver = null;
    public final static int REQUEST_READ_PHONE_STATE = 1;
    static ConnectionChangeReceiver mNetworkStateReceiver = null;

    public static void init(Context context) {
        Log.d("js", "--------------###############Platform Help init ");

//        sContext = context;
//        sActivity = (Activity)context;
//        clipboardManager = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);

        //电量监听
        IntentFilter filter2 = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        sBatteryReceiver = new BatteryReceiver(context);
        sContext.registerReceiver(sBatteryReceiver, filter2);

        //网络切换监听
//        mNetworkStateReceiver = new ConnectionChangeReceiver();
//        IntentFilter filter = new IntentFilter();
//        filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
//        sContext.registerReceiver(mNetworkStateReceiver, filter);

    }


    public static int getBattery() {
        return sBatteryReceiver.getBattery();
    }



    public static void openSetting() {
        Intent localIntent = new Intent();
        localIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= 9) {
            localIntent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            localIntent.setData(Uri.fromParts("package", sActivity.getPackageName(), null));
        } else if (Build.VERSION.SDK_INT <= 8) {
            localIntent.setAction(Intent.ACTION_VIEW);
            localIntent.setClassName("com.android.settings","com.android.settings.InstalledAppDetails");
            localIntent.putExtra("com.android.settings.ApplicationPkgName", sActivity.getPackageName());
        }
        sContext.startActivity(localIntent);
    }



    public static String getIMSI() {
        String result = "";
        try {
            TelephonyManager tm = (TelephonyManager) sContext.getSystemService(Context.TELEPHONY_SERVICE);
            result = tm.getSubscriberId();
        } catch (Exception e) {
            Log.e("VersionInfo", "Exception", e);
        }
        return result;
    }

    public static String getSimSerialNumber() {
        String result = "";
        try {
            TelephonyManager tm = (TelephonyManager) sContext.getSystemService(Context.TELEPHONY_SERVICE);
            result = tm.getSimSerialNumber();
        } catch (Exception e) {
            Log.e("VersionInfo", "Exception", e);
        }
        return result;
    }

    public static String getSystemId() {
        String result = "";
        try {
            TelephonyManager tm = (TelephonyManager) sContext.getSystemService(Context.TELEPHONY_SERVICE);
            result = tm.getDeviceId();
        } catch (Exception e) {
            Log.e("VersionInfo", "Exception", e);
        }
        return result;
    }

    public static String getPhoneModel() {
        return Build.MODEL;
    }

    public static String getPhoneBrand() {
        return Build.BRAND;
    }

    public static String getSystemVersion() {
        return Build.VERSION.RELEASE;
    }

    public static int getAppCode() {
        int versionCode = 0;
        try {
            // ---get the package info---
            PackageManager pm = sContext.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(sContext.getPackageName(), 0);
            versionCode = pi.versionCode;
        } catch (Exception e) {
            Log.e("getEngineCode", "Exception", e);
        }
        return versionCode;
    }

    public static boolean isAppInstalled(final String pkgName) {
        PackageInfo packageinfo = null;
        try {
            packageinfo = sContext.getPackageManager().getPackageInfo(pkgName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        if (packageinfo == null) {
            return false;
        }
        return true;
    }

    public static void openApp(final String pkgName) {
        PackageInfo packageinfo = null;
        try {
            packageinfo = sContext.getPackageManager().getPackageInfo(pkgName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        if (packageinfo == null) {
            return;
        }

        // 创建一个类别为CATEGORY_LAUNCHER的该包名的Intent
        Intent resolveIntent = new Intent(Intent.ACTION_MAIN, null);
        resolveIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        resolveIntent.setPackage(packageinfo.packageName);

        // 通过getPackageManager()的queryIntentActivities方法遍历
        List<ResolveInfo> resolveinfoList = sContext.getPackageManager()
                .queryIntentActivities(resolveIntent, 0);

        ResolveInfo resolveinfo = resolveinfoList.iterator().next();
        if (resolveinfo != null) {
            // packagename = 参数packname
            String packageName = resolveinfo.activityInfo.packageName;
            // 这个就是我们要找的该APP的LAUNCHER的Activity[组织形式：packagename.mainActivityname]
            String className = resolveinfo.activityInfo.name;
            // LAUNCHER Intent
            Intent intent = new Intent(Intent.ACTION_MAIN);
            intent.addCategory(Intent.CATEGORY_LAUNCHER);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            // 设置ComponentName参数1:packagename参数2:MainActivity路径
            ComponentName cn = new ComponentName(packageName, className);

            intent.setComponent(cn);
            sContext.startActivity(intent);
        }
    }

    public static void vibrate(int milSecond) {
        CocosHelper.vibrate(milSecond * 1.0f / 1000);
    }

    public static int getPermission(int permissionCode){
        return PermissionHelper.getPermission(sContext, permissionCode);
    }

    public static int requestPermission(int permissionCode){
        return PermissionHelper.requestPermission(sActivity, permissionCode);
    }


}
