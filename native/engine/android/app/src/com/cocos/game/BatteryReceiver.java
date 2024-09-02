package com.cocos.game;

import static android.content.Context.BATTERY_SERVICE;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.BatteryManager;
import android.util.Log;

import com.alibaba.fastjson2.JSONObject;

public class BatteryReceiver extends BroadcastReceiver {
    private int nowPercent = -1;
    private boolean bNowCharging = false;

    public BatteryReceiver(Context sContext) {
        BatteryManager manager = (BatteryManager) sContext.getSystemService(BATTERY_SERVICE);
        nowPercent = manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
        bNowCharging = manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_STATUS) == BatteryManager.BATTERY_STATUS_CHARGING;
    }

    public int getBattery(){
        return nowPercent;
    }

    public boolean isCharging() {
        return bNowCharging;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if(intent == null)
            return;

        int status = intent.getIntExtra("status",BatteryManager.BATTERY_STATUS_UNKNOWN);
        boolean bCharging = status == BatteryManager.BATTERY_STATUS_CHARGING;
        if (bCharging != bNowCharging){
            bNowCharging = bCharging;
            JSONObject data = new JSONObject();
            data.put("value",(bCharging ? 1 : 0));
            GameUtils.getInstance().callToJs("BatteryCharging", data.toJSONString());
        }

        int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL,0);
        int total = intent.getIntExtra(BatteryManager.EXTRA_SCALE,0);
        if(total <= 0)
            return;

        int percent = level * 100 / total;
        if(nowPercent != percent)
        {
            nowPercent = percent;
            JSONObject data = new JSONObject();
            data.put("percent",percent);
            GameUtils.getInstance().callToJs("BatteryChange", data.toJSONString());
        }
    }
}
