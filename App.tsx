import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  Alert,
  useColorScheme,
  NativeEventEmitter,
} from 'react-native';

import ZoomUs, {ZoomEmitter, ZoomUsVideoView} from 'react-native-zoom-us';
import {extractDataFromJoinLink} from './extractDataFromJoinLink';

import sdkJwtTokenJson from './api/sdk.jwt.json';
import zakJson from './api/api.zak.json';

declare const global: {HermesInternal: null | {}};

// 1. `TODO`: Go to https://marketplace.zoom.us/develop/create and Create SDK App then fill `sdkKey` and `sdkSecret`
// There are TWO options to initialize zoom sdk: without jwt token OR with jwt token

// 1a. without jwt token (quick start while developing)
const sdkKey = '';
const sdkSecret = '';

// 1b. with jwt token (should be used in production)
// - Replace you sdkKey and sdkSecret and run the following in the terminal:
// SDK_KEY=sdkKey SDK_SECRET=sdkSecret yarn run sdk:get-jwt
// This will fill up ./api/sdk.jwt.json that will be used instead of sdkKey and sdkSecret
const sdkJwtToken = sdkJwtTokenJson.jwtToken;

// 2a. `TODO` Fill in start meeting data:
// Replace userId, meetingNumber, zoomAccessToken in `./api/api.zak.json` manually
// OR follow these instructions for getting data automatically for starting you personal meeting:
// - Go to https://marketplace.zoom.us/develop/create and Create JWT App to get apiKey and apiSecret
// - Replace your apiKey and apiSecret and run the following in the terminal:
// API_KEY=apiKey API_SECRET=apiSecret yarn run api:get-jwt
// This will create JWT token in `./api/api.jwt.json` that you can use for the step of getting your personal meeting data.
// - Run the following in the terminal:
// yarn run api:get-zak
const exampleStartMeeting = {
  userId: zakJson.userId,
  meetingNumber: zakJson.meetingNumber,
  zoomAccessToken: zakJson.zoomAccessToken,
};

// 2b. `TODO` Fill in invite link:
const exampleJoinLink = 'https://us02web.zoom.us/j/MEETING_NUMBER?pwd=PASSWORD';

const exampleJoinMeeting = extractDataFromJoinLink(exampleJoinLink);

type CustomViewerProps = {
  leaveMeeting: () => void;
};

const CustomViewer = ({leaveMeeting}: CustomViewerProps) => {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Button onPress={leaveMeeting} title="Leave meeting" />
      <ZoomUsVideoView
        style={styles.customViewer}
        layout={[
          // The active speaker
          {
            kind: 'active',
            x: 0,
            y: 0,
            width: 1,
            height: 1,
          },
          // Selfcamera preview
          {
            kind: 'preview',
            // The percent of video view (required)
            x: 0.73,
            y: 0.73,
            width: 0.25,
            height: 0.2,
            // Enable border (optional)
            border: true,
            // Disable show user name (optional)
            showUsername: false,
            // Show audio off (optional)
            showAudioOff: true,
            // Background color (optional)
            background: '#ccc',
          },
          // active speaker's share
          /*
          {
            kind: 'active-share',
          },
          // share video
          {
            kind: 'share',
            // The index of user list (required)
            userIndex: 0,
          },
          // Specify attendee
          {
            kind: 'attendee',
            // The index of user list (required)
            userIndex: 0,
          },
          {
            kind: 'attendee',
            userIndex: 1,
          },
          */
        ]}
      />
    </View>
  );
};

// 3. `TODO` Enable custom view
const enableCustomizedMeetingUI = false;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMeetingOngoing, setIsMeetingOngoing] = useState(false);

  console.log({isDarkMode});

  useEffect(() => {
    (async () => {
      try {
        const initializeResult = await ZoomUs.initialize(
          sdkJwtToken
            ? {jwtToken: sdkJwtToken}
            : {clientKey: sdkKey, clientSecret: sdkSecret},
          {
            language: 'pt-PT',
            enableCustomizedMeetingUI,
          },
        );

        console.log({initializeResult});

        setIsInitialized(true);
      } catch (e) {
        Alert.alert('Error', 'Could not execute initialize');
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    // For more see https://github.com/mieszko4/react-native-zoom-us/blob/master/docs/EVENTS.md
    const zoomEmitter = new NativeEventEmitter(ZoomEmitter);
    const eventListener = zoomEmitter.addListener(
      'MeetingEvent',
      ({event, status}) => {
        console.log({event, status}); //e.g.  "endedByHost" (see more: https://github.com/mieszko4/react-native-zoom-us/blob/ded76d63c3cd42fd75dc72d2f31b09bae953375d/android/src/main/java/ch/milosz/reactnative/RNZoomUsModule.java#L397-L450)

        if (status === 'MEETING_STATUS_CONNECTING') {
          setIsMeetingOngoing(true);
        }

        if (status === 'MEETING_STATUS_DISCONNECTING') {
          // Once it is set it is good to render
          setIsMeetingOngoing(false);
        }
      },
    );

    return () => eventListener.remove();
  }, [isInitialized]);

  const startMeeting = async () => {
    try {
      const startMeetingResult = await ZoomUs.startMeeting({
        userName: 'John',
        meetingNumber: exampleStartMeeting.meetingNumber,
        userId: exampleStartMeeting.userId,
        zoomAccessToken: exampleStartMeeting.zoomAccessToken,
      });

      console.log({startMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute startMeeting');
      console.error(e);
    }
  };

  const joinMeeting = async () => {
    try {
      const joinMeetingResult = await ZoomUs.joinMeeting({
        autoConnectAudio: true,
        userName: 'Wick',
        meetingNumber: exampleJoinMeeting.meetingNumber || '',
        password: exampleJoinMeeting.password || '',
      });

      console.log({joinMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute joinMeeting');
      console.error(e);
    }
  };

  const leaveMeeting = async () => {
    try {
      const leaveMeetingResult = await ZoomUs.leaveMeeting();

      console.log({leaveMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute leaveMeeting');
      console.error(e);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Button
          onPress={() => startMeeting()}
          title="Start example meeting"
          disabled={!isInitialized}
        />
        <Text>-------</Text>
        <Button
          onPress={() => joinMeeting()}
          title="Join example meeting"
          disabled={!isInitialized}
        />
      </View>
      {enableCustomizedMeetingUI && isMeetingOngoing && (
        <CustomViewer leaveMeeting={leaveMeeting} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  customViewer: {
    width: '100%',
    flex: 1,
    backgroundColor: 'red',
  },
});

export default App;
