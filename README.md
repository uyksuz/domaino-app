# Domaino App

React Native mobile app (iOS & Android) for the Domaino domain scanner. Displays real-time scan progress, available domains, statistics, and a remote control panel — all powered by Firebase Realtime Database.

## Features

- Live scanner status with progress bar
- Browse and filter available domains
- Favorite domains with one tap
- Domain quality score visualization
- Stats dashboard with charts
- Remote scanner control (start/stop, concurrency, thresholds)
- Push notifications for scan completion
- Dark UI

## Tech Stack

- [Expo](https://expo.dev) ~56 / React Native 0.85
- Expo Router (file-based navigation)
- Firebase JS SDK v12
- Zustand for state management
- Shopify Flash List for performant domain lists
- React Native Reanimated + Gesture Handler

## Setup

```bash
npm install
```

Configure Firebase in `lib/firebase.ts` with your project credentials.

## Run

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Build (EAS)

```bash
npx eas build --platform android
npx eas build --platform ios
```

## Project Structure

```
app/
  (tabs)/
    index.tsx       # Scanner status
    available.tsx   # Available domains list
    favorites.tsx   # Saved favorites
    stats.tsx       # Statistics & charts
    control.tsx     # Remote scanner control
  domain/[id].tsx   # Domain detail screen
components/
  DomainCard.tsx
  FilterBar.tsx
  ScoreBar.tsx
  ScanProgress.tsx
lib/
  firebase.ts
  scoring.ts
  notifications.ts
  useScanner.ts
  useAvailable.ts
  useStats.ts
```
