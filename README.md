# Score Buddy

Score Buddy is an application designed to make it easier to track points during your board game sessions. No more need for pen and paper—follow your scores in real-time and keep a history of your games during a session.

## Features

- [ ] Logo
- [X] Mobile app with capacitor
- [ ] Web responsive
- [ ] PWA
- [X] Disable mobile stand-by
- [X] Duel mode
- [ ] French translation
- [X] Game history and statistics

## Installation

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Android Build

> **WSL users:** the build runs entirely from WSL via Gradle CLI. Android Studio on Windows is not used for building — only the Android SDK installed on Windows is required (accessible from WSL via `/mnt/c/...`).

### Prerequisites

- [Android Studio](https://developer.android.com/studio) installed on Windows (provides the Android SDK)
- Java 21 installed in WSL (`sudo apt install openjdk-21-jdk`)
- A device connected via USB with USB debugging enabled (for `run` only)
- `android/local.properties` must point to the SDK: `sdk.dir=/mnt/c/Users/<you>/AppData/Local/Android/Sdk`

### Debug build

Generates a debug APK, no signing required. Install it directly on any device with "Unknown sources" enabled.

```bash
pnpm generate
pnpm exec cap sync android
cd android && ./gradlew assembleDebug
```

APK output:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Accessible from Windows at:
```
\\wsl$\Ubuntu\home\jboilevin\dev\score-buddy\android\app\build\outputs\apk\debug\app-debug.apk
```

### Release build

Generates an unsigned release APK. Requires a keystore to sign it before publishing to the Play Store.

```bash
pnpm generate
pnpm exec cap sync android
cd android && ./gradlew assembleRelease
```

APK output:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

To sign the APK, use `apksigner` from the Android SDK build-tools:

```bash
apksigner sign --ks my-release-key.jks --out app-release.apk app-release-unsigned.apk
```

### App info

| Property | Value |
|---|---|
| App ID | `com.scorebuddy.app` |
| App Name | Score Buddy |
| Min SDK | 23 (Android 6.0) |
| Target SDK | 35 (Android 15) |
