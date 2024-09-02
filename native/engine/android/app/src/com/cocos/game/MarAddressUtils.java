package com.cocos.game;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Log;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.net.NetworkInterface;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.List;

public class MarAddressUtils {

    public static String getUniqueId(Context context){
        String androidID = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
        String id = androidID + Build.SERIAL;
        try {
            return GameUtils.getInstance().toMD5(id);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return id;
        }
    }


    public static String getUniId(Activity activity){
        if (activity.getApplicationInfo().targetSdkVersion >= 29 && Build.VERSION.SDK_INT >= 29 ){
            //大于等于29使用特殊方法
            return getUniqueId(activity);
        }
        try{
            String uuid = getIMEI(activity);
            if(uuid == null || uuid.equals("") || uuid.equals("02:00:00:00:00:00")){
                uuid = getMacDefault(activity);
            }
            if(uuid == null || uuid.equals("") || uuid.equals("02:00:00:00:00:00")){
                uuid = getMacDefault2();
            }
            if(uuid == null || uuid.equals("") || uuid.equals("02:00:00:00:00:00")){
                uuid = getMacFromHardware();
            }
            if(uuid == null || uuid.equals("02:00:00:00:00:00")){
                uuid = getUniqueId(activity);
            }else {
                uuid = GameUtils.getInstance().toMD5(uuid);
            }
            return uuid;
        }
        catch (Exception e){
//            return getUniqueId(activity);
//            Log.e("getMacAddress", "Exception", e);
        }
        return getUniqueId(activity);
    }


    public static String getIMEI(Activity activity) {
        String result = "";
        try {
            TelephonyManager tm = (TelephonyManager) activity.getSystemService(Context.TELEPHONY_SERVICE);
            result = tm.getDeviceId();
        } catch (Exception e) {
//            Log.e("VersionInfo", "Exception", e);
        }
        return result;
    }



    /**
     * Android 6.0 之前（不包括6.0）获取mac地址
     */
    private static String getMacDefault(Activity activity) {
        WifiManager wifi = (WifiManager) activity.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiInfo info = null;
        try {
            info = wifi.getConnectionInfo();
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (info == null) {
            return null;
        }
        return info.getMacAddress();
    }

    /**
     * Android 6.0-Android 7.0 获取mac地址
     */
    private static String getMacDefault2() {
        String macSerial = null;
        String str = "";

        try {
            Process pp = Runtime.getRuntime().exec("cat /sys/class/net/wlan0/address");
            InputStreamReader ir = new InputStreamReader(pp.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);

            while (null != str) {
                str = input.readLine();
                if (str != null) {
                    macSerial = str.trim();//去空格
                    break;
                }
            }
        } catch (IOException ex) {
            // 赋予默认值
            ex.printStackTrace();
        }

        if(macSerial != null){
            return macSerial.toUpperCase();
        }
        return null;
    }

    /**
     * Android 7.0之后获取Mac地址
     * 遍历循环所有的网络接口，找到接口是 wlan0
     * 必须的权限 <uses-permission android:name="android.permission.INTERNET"></uses-permission>
     * @return
     */
    private static String getMacFromHardware() {
        String wlan0Mac = null;
        try {
            List<NetworkInterface> all = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface nif : all) {
                if (!nif.getName().equalsIgnoreCase("wlan0")) {
                    continue;
                }

                byte[] macBytes = nif.getHardwareAddress();
                if (macBytes == null) {
                    Log.e("getMacFromHardware", nif.getName() + " getHardwareAddress null.");
                    return null;
                }

                StringBuilder res1 = new StringBuilder();
                for (byte b : macBytes) {
                    res1.append(String.format("%02X:", b));
                }

                if (res1.length() > 0) {
                    res1.deleteCharAt(res1.length() - 1);
                }
                wlan0Mac = res1.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return wlan0Mac;
    }
}
