package com.scorebuddy.app;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // Small pause once the icon animation is fully drawn, then fade out
    // instead of cutting straight to the app.
    private static final long POST_ANIMATION_HOLD_MS = 150;
    private static final long FADE_OUT_MS = 250;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);

        // The WebView otherwise scales rendered content with the system font-size
        // accessibility setting, which breaks the (mostly rem-based) layout on
        // devices where that setting is increased (e.g. reported on a Galaxy S23 Ultra).
        getBridge().getWebView().getSettings().setTextZoom(100);

        // Android only forces edge-to-edge automatically on API 35+ (targetSdk).
        // On older versions (e.g. Android 14) the window never actually goes
        // edge-to-edge on its own, so the WindowInsetsCompat system-bar insets
        // the capacitor-android-edge-to-edge-support plugin relies on stay at
        // 0, and its status/navigation bar color overlays collapse to zero
        // height. Forcing it here makes the plugin's color calls take effect
        // consistently across OS versions.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Dismiss the splash once the icon animation finishes, no sooner and no
        // later: the exit listener can fire before the animation is done, so we
        // wait out whatever time is left on it before starting the exit transition.
        // getIconAnimationStartMillis() is epoch time (Instant.toEpochMilli()),
        // so it must be compared against System.currentTimeMillis(), not SystemClock.
        splashScreen.setOnExitAnimationListener(splashScreenView -> {
            long remainingMs = splashScreenView.getIconAnimationStartMillis()
                + splashScreenView.getIconAnimationDurationMillis()
                - System.currentTimeMillis();

            new Handler(Looper.getMainLooper()).postDelayed(
                () -> {
                    View view = splashScreenView.getView();
                    ObjectAnimator fadeOut = ObjectAnimator.ofFloat(view, View.ALPHA, 1f, 0f);
                    fadeOut.setDuration(FADE_OUT_MS);
                    fadeOut.addListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationEnd(Animator animation) {
                            splashScreenView.remove();
                        }
                    });
                    fadeOut.start();
                },
                Math.max(remainingMs, 0) + POST_ANIMATION_HOLD_MS
            );
        });
    }
}
