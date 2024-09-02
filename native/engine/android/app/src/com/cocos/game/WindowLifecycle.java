package com.cocos.game;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.io.Closeable;
import java.io.IOException;

public class WindowLifecycle implements Application.ActivityLifecycleCallbacks, Closeable {
    private Activity currentActivity;
    public WindowLifecycle(Context context){
        if (context ==null){
            return ;
        }
        if (context instanceof Application){
            ((Application)context).registerActivityLifecycleCallbacks(this);

        }else{
            ((Application)context.getApplicationContext()).registerActivityLifecycleCallbacks(this);
        }
    }
    public Activity getCurrentActivity(){
        return this.currentActivity;
    }
    @Override
    public void onActivityCreated(@NonNull Activity activity, @Nullable Bundle savedInstanceState) {

    }

    @Override
    public void onActivityStarted(@NonNull Activity activity) {

    }

    @Override
    public void onActivityResumed(@NonNull Activity activity) {
        this.currentActivity = activity;
    }

    @Override
    public void onActivityPaused(@NonNull Activity activity) {
        this.currentActivity = null;
    }

    @Override
    public void onActivityStopped(@NonNull Activity activity) {

    }

    @Override
    public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {

    }

    @Override
    public void onActivityDestroyed(@NonNull Activity activity) {

    }

    @Override
    public void close() throws IOException {
        if (currentActivity !=null){
            currentActivity =null;
        }
    }
    public void destroyed(){
        if (currentActivity != null){
            currentActivity = null;
        }
    }
}
