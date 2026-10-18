# ZiuuGas

ZiuuGas is a React Native mobile app built with TypeScript for gas station discovery and related utility features. It integrates Firebase services, Google Sign-In, push notifications, maps, and image handling. A lightweight Vercel serverless backend is included for Firebase Cloud Messaging and ImageKit authentication.

This README is intended for a public repository and provides a clear setup guide for local development.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Backend](#backend)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

ZiuuGas is a mobile-first application designed to help users interact with gas station-related services and data. The app uses React Native and TypeScript for the client experience, while Firebase powers authentication, Firestore, and push messaging.

## Features

- Firebase Authentication
- Firebase Firestore integration
- Firebase Cloud Messaging support
- Google Sign-In
- Maps and location features
- Image picker and image upload support
- Local state management with Zustand
- Persistent storage with MMKV
- Adaptive UI and navigation with React Navigation

## Tech stack

- React Native 0.85.2
- TypeScript
- Firebase SDKs for React Native
- React Navigation
- Zustand
- MMKV
- React Native Maps
- Vercel serverless backend

## Prerequisites

Before running the project, make sure you have:

- Node.js 22.11.0 or newer
- npm or Yarn
- Android Studio for Android development
- Xcode and CocoaPods for iOS development on macOS

For environment setup, follow the official React Native guide:
https://reactnative.dev/docs/environment-setup

## Installation

1. Clone the repository

```bash
git clone https://github.com/FahadIqball/ZiuuGas.git
cd ZiuuGas
```

2. Install dependencies

With npm:

```bash
npm install
```

With Yarn:

```bash
yarn install
```

3. Install iOS dependencies (macOS only)

```bash
bundle install
bundle exec pod install
```

## Running the app

Start Metro:

```bash
npm start
# or
yarn start
```

Run the app:

### Android

```bash
npm run android
# or
yarn android
```

### iOS

```bash
npm run ios
# or
yarn ios
```

## Backend

This repository includes a small serverless backend under `vercel-backend/` for tasks such as:

- Firebase Cloud Messaging integration
- ImageKit token generation/authentication

Deploy the backend to Vercel and configure the required environment variables.

## Environment variables

This project uses external services and should not expose secrets in version control.

You may need to configure values such as:

- Firebase configuration files
- Google Sign-In credentials
- Cloud messaging configuration
- ImageKit keys
- Any app-specific API keys or service secrets

Recommended approach:

- Use `.env` files for local development
- Use Vercel environment variables for the backend deployment
- Store secrets in your platform's secret manager or CI/CD environment

## Scripts

The root app includes the following scripts:

- `npm start` or `yarn start` — starts Metro
- `npm run android` or `yarn android` — runs Android app
- `npm run ios` or `yarn ios` — runs iOS app
- `npm test` — runs Jest tests
- `npm run lint` — runs ESLint

## Project structure

```text
ZiuuGas/
├── android/
├── ios/
├── src/
├── App.tsx
├── app.json
├── babel.config.js
├── index.js
├── metro.config.js
├── package.json
├── tsconfig.json
├── vercel-backend/
│   ├── package.json
│   └── ...
└── README.md
```

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear description

## License

This project does not currently include a license file. If you plan to make the repository public, consider adding an open-source license such as MIT to clarify how others may use and modify the code.

## Contact

- GitHub: https://github.com/FahadIqball
- Repository: https://github.com/FahadIqball/ZiuuGas

If you want, you can also add a screenshot section, app features, and screenshots of the UI to make the README more polished for public visibility.
