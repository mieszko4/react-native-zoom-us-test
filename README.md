# zoom-us-test

Example repository of using [react-native-zoom-us bridge](https://www.npmjs.com/package/react-native-zoom-us).

## Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

- `yarn`
- on iOS only (requires at least Ruby@3.2.2):
  - `bundle install`
  - `cd ios/ && bundle exec pod install && cd ..`
- Go to https://marketplace.zoom.us/develop/create and Create SDK App, then copy `sdkKey` and `sdkSecret`
- Open `App.tsx` and look for `TODO` - update it with your `sdkKey`, `sdkSecret`.
  - For `startMeeting` provide: `meetingNumber` and `zoomAccessToken`.
  - For `joinMeeting` provide: `meetingNumber` and `password`
- Change `DEVELOPMENT_TEAM` on iOS
- `yarn start`
- `yarn android` or `yarn ios`

## Developing with the lib

Currently because of react-native symlink limitation the following must be done manually:

- open new terminal and make sure you are in the parent's folder (`cd ..`)
- clone and set up `react-native-zoom-us`
- pack `react-native-zoom-us` and copy it to `react-native-zoom-us-test` using `npm run dev`
- repeat on each lib change

## Upgrading react-native

This repository was generated using `npx react-native@0.72.2 init ZoomUsTest --version 0.72.2`.
Use diff between two versions of react-native to apply the changes using https://react-native-community.github.io/upgrade-helper/.

## Smoke Test Procedure

The following procedure covers testing of the bridge (initialization and join meeting only).

### Android

#### Emulator

1. [ ] Development: `yarn android`

#### Real Device

1. [ ] Development: `yarn android`
2. [ ] Release: `yarn android --variant=release`

### iOS

#### Simulator

1. [ ] Development: `yarn ios`

#### Real Device

Note: You will need to allow to install app; look for: Settings -> General -> Device Management -> Apple Development

1. [ ] Development: Xcode: Product -> Run
2. [ ] Release: Xcode: Product -> Profile
3. [ ] Archive: Xcode: Product -> Archive
