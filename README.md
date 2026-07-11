<p align="center">
  <img src="public/logo.svg" alt="Score Buddy logo" width="96" height="96">
</p>

# Score Buddy

Score Buddy is an application designed to make it easier to track points during your board game sessions. No more need for pen and paper—follow your scores in real-time and keep a history of your games during a session.

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

### Dev build (debug APK, dev database)

Generates a debug APK signed with the default debug key (no setup required), using `.env.local` (dev Supabase). Install it directly on any device with "Unknown sources" enabled.

```bash
pnpm build:android:dev
```

Equivalent to:
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

### Dev bundle (signed AAB, dev database, for Play Store internal testing)

Same as the prod build below, but using `.env.local` (dev Supabase). Useful to upload to a Play Store internal/closed testing track without touching production data.

```bash
pnpm build:android:dev:bundle
```

AAB output:
```
android/app/build/outputs/bundle/release/app-release.aab
```

Requires the same signing setup as the prod build (see below).

### Prod build (signed AAB, prod database)

Generates a signed Android App Bundle (`.aab`), using `.env.production` (prod Supabase). This is the artifact uploaded to the Play Store.

```bash
pnpm build:android:prod
```

Equivalent to:
```bash
pnpm generate:prod
pnpm exec cap sync android
cd android && ./gradlew bundleRelease
```

AAB output:
```
android/app/build/outputs/bundle/release/app-release.aab
```

#### Signing setup (one-time)

The release build is signed using `android/keystore.properties`, which is gitignored. Generate the keystore once and keep it (and its passwords) safe — losing it means you can no longer publish updates to the same Play Store listing.

```bash
keytool -genkey -v -keystore android/score-buddy-release.keystore -alias scorebuddy -keyalg RSA -keysize 2048 -validity 10000
```

Then copy the template and fill in the real values:

```bash
cp android/keystore.properties.example android/keystore.properties
```

```
storeFile=score-buddy-release.keystore
storePassword=<your store password>
keyAlias=scorebuddy
keyPassword=<your key password>
```

Without `android/keystore.properties`, `bundleRelease` produces an unsigned AAB.

### App info

| Property | Value |
|---|---|
| App ID | `com.scorebuddy.app` |
| App Name | Score Buddy |
| Min SDK | 23 (Android 6.0) |
| Target SDK | 35 (Android 15) |
