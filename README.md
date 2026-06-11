# FitTransform

Personal 3-month fitness transformation app — 93kg → strong. Built with Expo (React Native).

## Features
- **Today** — Daily workout logger with set/rep/weight tracking, auto-rotation A→E
- **Plan** — Full gym + home (no-equipment) weekly plans, tap any exercise for form cues
- **Progress** — Live fitness scores (strength, stamina, endurance, VO₂max), streak & calorie chart
- **Diet** — Daily Nepali-food-aware checklist with protein tracking and supplement reminders
- **Anatomy diagram** — SVG muscle map highlights exactly what each exercise trains
- **YouTube links** — Tap any exercise to open a verified form tutorial

## Run locally

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your Android phone to run instantly — no build needed.

## Build an APK (Android)

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in / create an Expo account (free)
eas login

# Configure build
eas build:configure

# Build a preview APK (free tier, ~15 min queue)
eas build -p android --profile preview
```

EAS will give you a download link for the `.apk`. For Play Store submission use `--profile production`.

## Publish to Play Store

1. Run `eas build -p android --profile production` → downloads an `.aab`
2. Create app in [Google Play Console](https://play.google.com/console)
3. Upload the `.aab` to Internal Testing → promote to Production

## Tech stack
- **Expo SDK 56** / Expo Router (file-based navigation)
- **React Native** with TypeScript
- `react-native-svg` — anatomy muscle diagram
- `@react-native-async-storage/async-storage` — offline-first data persistence
