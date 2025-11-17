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
import Video from 'react-native-video';

import ZoomUs, {ZoomEmitter} from 'react-native-zoom-us';

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

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMeetingOngoing, setIsMeetingOngoing] = useState(false);

  console.log({isDarkMode, isMeetingOngoing});

  useEffect(() => {
    (async () => {
      try {
        const initializeResult = await ZoomUs.initialize(
          {jwtToken: sdkJwtToken},
          {
            language: 'pt-PT',
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

  return (
    <>
      <View style={styles.container}>
        <Video
          source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          controls
        />
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
});

export default App;
