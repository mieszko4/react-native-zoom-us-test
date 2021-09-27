import jwt from 'jsonwebtoken';

const getApiJwtToken = (
  apiKey: string,
  apiSecret: string,
  expiresInSeconds: number,
) => {
  const epochInSeconds = Math.round(new Date().getTime() / 1000);

  const payload = {
    iss: apiKey,
    exp: epochInSeconds + expiresInSeconds,
  };

  const token = jwt.sign(payload, apiSecret, {
    algorithm: 'HS256',
    encoding: 'utf-8',
  });

  return token;
};

const expiresInSeconds = 3600; // 1h
if (!process.env.API_KEY || !process.env.API_SECRET) {
  throw new Error('You must provide envs: API_KEY and API_SECRET');
}

const jwtToken = getApiJwtToken(
  process.env.API_KEY,
  process.env.API_SECRET,
  expiresInSeconds,
);

console.log(JSON.stringify({jwtToken}, null, 2));
