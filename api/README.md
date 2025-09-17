# Dummy Backend API

This is just a dummy backend. All files in this folder should be implemented on your Backend API

Your react-native app should request the backend for:
1. a JWT token to initialize zoom sdk used in `ZoomUs.initialize` - implemented in `getSdkJwtToken`
2. a meetingNumber and zoomAccessToken to start a meeting used in `ZoomUs.startMeeting` - implemented in `getOauthToken` and `getPersonalMeeting`
