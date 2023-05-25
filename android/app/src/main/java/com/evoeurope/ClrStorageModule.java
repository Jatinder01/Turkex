package com.evoeurope;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.IOException;

public class ClrStorageModule extends  ReactContextBaseJavaModule {
    public ClrStorageModule(ReactApplicationContext context){
        super(context);
    }
    ReactApplicationContext reactApplicationContext;
    @NonNull
    @Override
    public String getName() {
        return "ClrStorageModule";
    }


    @ReactMethod
    public void clearApplicationData() {
        try {
            File cache = getCurrentActivity().getCacheDir();
            File appDir = new File(cache.getParent());
            if (appDir.exists()) {
                String[] children = appDir.list();
                Log.e("Listtttttt", appDir.list().toString());
                for (String s : children) {
                    if (!s.equals("lib")) {
                        if (s.equals("shared_prefs")){
                            deleteDir(new File(appDir, s));

                        }
                    }
                }
            }
        } catch(Exception e) {
            System.out.println("IOException " + e.getLocalizedMessage());
        }


    }
    public static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        }

        return dir.delete();
    }
}
