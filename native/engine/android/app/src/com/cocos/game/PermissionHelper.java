package com.cocos.game;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONException;
import org.json.JSONObject;

public class PermissionHelper {
    public static int PHONE_STATE = 1;
    public static int sPermissionID = 0;
    private final static int NONE = 0;
    private final static int ALLOW = 1;
    private final static int REFUSE = 2;
    private final static int NOT_FIND = -1;

    private static PermissionHelper _instance = null;

    public static PermissionHelper getInstance() {
        if (PermissionHelper._instance == null) {
            PermissionHelper._instance = new PermissionHelper();
        }
        return PermissionHelper._instance;
    }

    public static String getPermissionKey(int code){
        if (code == PHONE_STATE){
            return "android.permission.READ_PHONE_STATE";
        }
        return null;
    }

    public static int getPermissionCode(String permissionKey){
        if (permissionKey.equals("android.permission.READ_PHONE_STATE")){
            return PHONE_STATE;
        }
        return 0;
    }

    public static int getPermission(Context sContext, int nPermissionCode){
        String permissionKey = getPermissionKey(nPermissionCode);
        if(permissionKey == null){
            return NOT_FIND;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            int i = ContextCompat.checkSelfPermission(sContext, permissionKey);
            if (i == PackageManager.PERMISSION_GRANTED){
                return ALLOW;
            }
            else if (i == PackageManager.PERMISSION_DENIED){
                return NONE;
            }
            return REFUSE;
        }
        return ALLOW;
    }

    public static int requestPermission(Activity sActivity, int permissionCode){
        String permissionKey = getPermissionKey(permissionCode);
        if(permissionKey == null){
            return NOT_FIND;
        }
        ++sPermissionID;
        String[] permissList = new String[]{
                permissionKey
        };
        ActivityCompat.requestPermissions(sActivity, permissList, sPermissionID);
        return sPermissionID;
    }

    public static void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        for (int i = 0; i < permissions.length; i++) {
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("permissionID", requestCode);
                jsonObject.put("permissionCode", getPermissionCode(permissions[i]));
                jsonObject.put("permissionResult", grantResults[i] == PackageManager.PERMISSION_GRANTED ? ALLOW : REFUSE);
                Log.d("PlatformHelper", "PermissionResult: " + jsonObject.toString());
//                PlatformHelper.nativeDealCallBack(NATIVE_CODE.SYSTEM, "PermissionResult", jsonObject.toString());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
}
