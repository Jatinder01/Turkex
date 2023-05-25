package com.evoeurope;

import android.os.Bundle;
import android.view.View;

import com.facebook.react.ReactActivity;
import com.google.firebase.analytics.FirebaseAnalytics;

public class MainActivity extends ReactActivity {
  private FirebaseAnalytics mFirebaseAnalytics;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // get the root view and activate touch filtering to prevent tap jacking
    View v = findViewById(android.R.id.content);
    v.setFilterTouchesWhenObscured(true);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "evoeurope";
  }
}
