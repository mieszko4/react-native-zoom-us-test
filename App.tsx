import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  Alert,
  useColorScheme,
  NativeEventEmitter,
  Platform,
} from 'react-native';

import ZoomUs, {ZoomEmitter, ZoomUsVideoView} from 'react-native-zoom-us';
import {type NativeLayoutUnit} from 'react-native-zoom-us/native';

import {extractDataFromJoinLink} from './api/extractDataFromJoinLink';

import * as sdkJwtTokenJson from './api/sdk.jwt.json';
import * as personalMeetingJson from './api/api.personalMeeting.json';

// 1. `TODO`: Go to https://marketplace.zoom.us/develop/create and create Meeting SDK App
// - Replace your sdkKey and sdkSecret and run the following in the terminal:
// SDK_KEY=sdkKey SDK_SECRET=sdkSecret yarn run sdk:get-jwt
// This will fill up ./api/sdk.jwt.json used below
const sdkJwtToken = sdkJwtTokenJson.jwtToken;

// 2a. `TODO` Fill in start meeting data:
// Replace meetingNumber and zoomAccessToken in `./api/api.personalMeeting.json` manually
// OR follow these instructions for getting data automatically for starting you personal meeting:
// - Go to https://marketplace.zoom.us/develop/create and create Server to Server OAuth App with user:read:token:admin and user:read:user:admin scopes
// - Replace your accountId, clientId and clientSecret and run the following in the terminal:
// ACCOUNT_ID=accountId CLIENT_ID=clientId CLIENT_SECRET=clientSecret yarn run api:get-oauth
// This will create oauth token in `./api/api.oauth.json` that you can use for the next step of getting your personal meeting data.
// - Run the following in the terminal:
// yarn run api:get-personal-meeting
const exampleStartMeeting = {
  meetingNumber: personalMeetingJson.meetingNumber,
  zoomAccessToken: personalMeetingJson.zoomAccessToken,
};

// 2b. `TODO` Fill in invite link:
const exampleJoinLink = 'https://us02web.zoom.us/j/MEETING_NUMBER?pwd=PASSWORD';

const exampleJoinMeeting = extractDataFromJoinLink(exampleJoinLink);

type CustomViewerProps = {
  leaveMeeting: () => void;
};

const CustomViewer = ({leaveMeeting}: CustomViewerProps) => {
  const [showScreenShare, setShowScreenShare] = useState(false);

  const activeConfig: NativeLayoutUnit = {
    kind: 'active',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  };

  const activeShareConfig: NativeLayoutUnit = {
    kind: 'active-share',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Button onPress={leaveMeeting} title="Leave meeting" />
      <Button onPress={() => ZoomUs.startShareScreen()} title="Share screen" />
      <Button
        onPress={() => setShowScreenShare(!showScreenShare)}
        title={!showScreenShare ? 'Show screen' : 'Show video'}
      />
      <ZoomUsVideoView
        style={styles.customViewer}
        layout={[
          // TODO: check why showing both at the same time does not work
          showScreenShare ? activeShareConfig : activeConfig,
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
          /*
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

// 3. `TODO` Enable custom view (android only)
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
          {jwtToken: sdkJwtToken},
          {
            language: 'pt-PT',
            enableCustomizedMeetingUI,
          },
        );

        console.log({initializeResult});

        setIsInitialized(true);
      } catch (e) {
        Alert.alert('Error', 'Could not execute initialize');
        console.error('ERR', e);
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
      ({event, status, ...params}) => {
        console.log({event, status, params}); //e.g.  "endedByHost" (see more: https://github.com/mieszko4/react-native-zoom-us/blob/master/docs/EVENTS.md)

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
        zoomAccessToken: exampleStartMeeting.zoomAccessToken,
        noMeetingErrorMessage: true, // Set this to be able to show Alert.alert
      });

      console.log({startMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute startMeeting');
      console.error('ERR', e);
    }
  };

  const joinMeeting = async () => {
    try {
      const joinMeetingResult = await ZoomUs.joinMeeting({
        autoConnectAudio: true,
        userName: `Wick ${Platform.OS}`,
        meetingNumber: exampleJoinMeeting.meetingNumber || '',
        password: exampleJoinMeeting.password || '',
        noMeetingErrorMessage: true, // Set this to be able to show Alert.alert
      });

      console.log({joinMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute joinMeeting');
      console.error('ERR', e);
    }
  };

  const leaveMeeting = async () => {
    try {
      const leaveMeetingResult = await ZoomUs.leaveMeeting();

      console.log({leaveMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute leaveMeeting');
      console.error('ERR', e);
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
  },
});

export default App;
