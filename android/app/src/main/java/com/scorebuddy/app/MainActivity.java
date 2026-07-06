package com.scorebuddy.app;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import androidx.core.splashscreen.SplashScreen;
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
