# zoom-us-test

Example repository of using [react-native-zoom-us bridge](https://www.npmjs.com/package/react-native-zoom-us).

## Usage

* `yarn`
* Go to https://marketplace.zoom.us/develop/create and Create SDK App, then copy `sdkKey` and `sdkSecret`
* Open `App.tsx` and look for `TODO` - update it with your `sdkKey`, `sdkSecret`.
  * For `startMeeting` provide: `meetingNumber`, `userId`, and `zoomAccessToken`.
  * For `joinMeeting` provide: `meetingNumber` and `password`
* `yarn start`
* `npx react-native run-android` or `npx react-native run-ios`
