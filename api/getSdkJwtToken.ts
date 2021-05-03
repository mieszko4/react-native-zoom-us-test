import jwt from 'jsonwebtoken';

// NOTE1: zoom has two different types of JWT token
// 1. jwt token used to initialize zoom sdk (it is implemented HERE)
// 2. jwt token used to authenticate with Zoom API

// NOTE2: this should be implemented on your backend API
// and your app should request for a token to initialize zoom sdk
// do not hardcode and do not send (sdkKey, sdkSecret)

const getSdkJwtToken = (
  sdkKey: string,
  sdkSecret: string,
  expiresInSeconds: number,
) => {
  const epochInSeconds = Math.round(new Date().getTime() / 1000);

  const payload = {
    appKey: sdkKey,
    iat: epochInSeconds,
    exp: epochInSeconds + expiresInSeconds,
    tokenExp: epochInSeconds + expiresInSeconds,
  };

  const token = jwt.sign(payload, sdkSecret, {
    algorithm: 'HS256',
    encoding: 'utf-8',
  });

  return token;
};

const expiresInSeconds = 3600; // 1h
if (!process.env.SDK_KEY || !process.env.SDK_SECRET) {
  throw new Error('You must provide envs: SDK_KEY and SDK_SECRET');
}

const jwtToken = getSdkJwtToken(
  process.env.SDK_KEY,
  process.env.SDK_SECRET,
  expiresInSeconds,
);

console.log(JSON.stringify({jwtToken}, null, 2));
