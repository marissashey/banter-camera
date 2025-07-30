# Banter Camera - Expo App

A React Native app built with Expo that includes camera functionality for taking pictures.

## Prerequisites

- Node.js (16+)
- iOS Simulator (Xcode) or Android Emulator
- Expo CLI
- EAS CLI (for builds)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Build

**For iOS Simulator:**
```bash
npx expo run:ios
```

**For Android Emulator:**
```bash
npx expo run:android
```

**For Web:**
```bash
npx expo start --web
```

> **Note:** This app uses a **development build** (not Expo Go) because it includes native camera modules.

### 3. Development Server Only

To start just the Metro bundler (for already-built development clients):

```bash
npx expo start --dev-client
```

## Features

- **TypeScript** support
- **React Navigation** with tab-based routing
- **Camera functionality** with these modules:
  - `expo-camera` - Direct camera access
  - `expo-image-picker` - Image picker with camera
  - `expo-media-library` - Save images to device
- **EAS Build** configured for different build profiles

## Build Profiles

Configure different builds using EAS:

```bash
# Development build (includes dev tools)
eas build --profile development --platform ios

# Preview build (for testing)
eas build --profile preview --platform ios

# Production build (for App Store)
eas build --profile production --platform ios
```

## Project Structure

```
expo/
├── app/              # App screens (Expo Router)
├── components/       # Reusable components
├── constants/        # App constants
├── assets/          # Images, fonts, etc.
├── app.json         # Expo configuration
├── eas.json         # EAS Build configuration
└── package.json     # Dependencies
```

## Camera Permissions

Camera permissions are pre-configured in `app.json`:

- **iOS**: Camera, microphone, and photo library access
- **Android**: Camera, audio recording, and storage permissions

## Bundle Identifier

- **iOS**: `com.banter-app-rc.banter`
- **Android**: Will use the same format

## Troubleshooting

**First build taking long?**
- Initial builds compile all native modules (5-10 minutes)
- Subsequent builds are much faster

**Camera not working?**
- Ensure you're using a development build (`npx expo run:ios`)
- Don't use Expo Go for camera functionality
- Test on a real device for full camera features

**Need to rebuild?**
- Run `npx expo run:ios` again after adding new native modules
- Or when changing native configurations

## Commands Reference

```bash
# Development
npx expo start --dev-client     # Start Metro bundler
npx expo run:ios               # Build & run iOS
npx expo run:android           # Build & run Android

# EAS Builds
eas build --profile development --platform ios
eas build --profile production --platform all

# Project Info
npx expo whoami                # Check logged in account
eas project:info              # Check project details
```

## Next Steps

1. Start building camera features in `app/(tabs)/index.tsx`
2. Customize the UI in `components/`
3. Configure app icons and splash screen in `assets/`
4. Set up EAS builds for testing and production

Happy coding! 📱📸
