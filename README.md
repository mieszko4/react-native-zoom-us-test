# zoom-us-test

Example repository of using [react-native-zoom-us bridge](https://www.npmjs.com/package/react-native-zoom-us).

## Usage

* `yarn`
* `nvm use`
* on ios only: `cd ios/ && pod install && cd ..`
* Go to https://marketplace.zoom.us/develop/create and Create SDK App, then copy `sdkKey` and `sdkSecret`
* Open `App.tsx` and look for `TODO` - update it with your `sdkKey`, `sdkSecret`.
  * For `startMeeting` provide: `meetingNumber`, `userId`, and `zoomAccessToken`.
  * For `joinMeeting` provide: `meetingNumber` and `password`
* `yarn start`
* `yarn run android` or `yarn run ios`

## Developing with the lib

Currently because of react-native symlink limitation the following must be done manually:

* `cd ..`
* clone and set up `react-native-zoom-us`
* `npm run prepack`
* `cd react-native-zoom-us-test`
* `rm -fr node_modules/react-native-zoom-us/ && cp -R ../react-native-zoom-us node_modules/`
* repeat on each lib change

## Upgrading react-native

This repository was generated using https://github.com/react-native-community/react-native-template-typescript
Use diff between two versions of react-native to apply the changes, e.g. (https://github.com/react-native-community/react-native-template-typescript/compare/6.6.4...6.8.0). Use `/template/*` folder only

## Smoke Test Procedure
The following procedure covers testing of the bridge (initialization and join meeting only).

### Android

#### Emulator
1. [ ] Development: `yarn run android`

#### Real Device
1. [ ] Development: `yarn run android`
2. [ ] Release: `cd android && ./gradlew assembleRelease && cd ..`, `adb install android/app/build/outputs/apk/release/app-release.apk`

### iOS

#### Simulator
1. [ ] Development: `yarn run ios` (Note that M1 chip is not supported by Zoom SDK)

#### Real Device
Note: You will need to allow to install app; look for: Settings -> General -> Device Management -> Apple Development

1. [ ] Development: Xcode: Product -> Run
2. [ ] Release: Xcode: Product -> Profile
3. [ ] Archive: Xcode: Product -> Archive
