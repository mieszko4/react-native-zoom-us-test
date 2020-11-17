import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Button, Text, Alert} from 'react-native';

import ZoomUs from 'react-native-zoom-us';

declare const global: {HermesInternal: null | {}};

// 1. `TODO`: Go to https://marketplace.zoom.us/develop/create and Create SDK App then fill `sdkKey` and `sdkSecret`
const skdKey = '';
const sdkSecret = '';

// 2. `TODO` Fill in the following fields:
const exampleMeeting = {
  // for both startMeeting and joinMeeting
  meetingNumber: '',

  // for startMeeting
  userId: '',
  zoomAccessToken: '',

  // for joinMeeting
  password: '',
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const initializeResult = await ZoomUs.initialize({
          clientKey: skdKey,
          clientSecret: sdkSecret,
        });

        console.log({initializeResult});

        setIsInitialized(true);
      } catch (e) {
        Alert.alert('Error', 'Could not execute initialize');
        console.error(e);
      }
    })();
  }, []);

  const startMeeting = async () => {
    try {
      const startMeetingResult = await ZoomUs.startMeeting({
        userName: 'John',
        meetingNumber: exampleMeeting.meetingNumber,
        userId: exampleMeeting.zoomAccessToken,
        zoomAccessToken: exampleMeeting.zoomAccessToken,
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
        userName: 'Wick',
        meetingNumber: exampleMeeting.meetingNumber,
        password: exampleMeeting.password,
      });

      console.log({joinMeetingResult});
    } catch (e) {
      Alert.alert('Error', 'Could not execute startMeeting');
      console.error(e);
    }
  };

  return (
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
