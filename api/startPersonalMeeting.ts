import fetch from 'node-fetch';

import apiOauthTokenJson from './api.oauth.json';

const baseUrl = 'https://api.zoom.us/v2';
const headers = {
  'User-Agent': 'React-Native-Zoom-Us-Test',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiOauthTokenJson.oauthToken.access_token}`,
};

type Error = {
  code: string;
  message: string;
};

const processRequest = async <Response>(url: URL) => {
  const response = await fetch(url.toString(), {
    headers,
  });

  const json = (await response.json()) as Error | Response;

  if (typeof json === 'object' && json && 'code' in json) {
    throw new Error(json.message);
  }

  return json;
};

type UserResponse = {
  id: string;
  pmi: number;
};
const getUser = async () => {
  const url = new URL(`${baseUrl}/users/me`);

  return processRequest<UserResponse>(url);
};

type UserTokenResponse = {
  token: string;
};
const getUserToken = async () => {
  const url = new URL(`${baseUrl}/users/me/token`);
  url.searchParams.append('type', 'zak');
  url.searchParams.append('ttl', '3600');

  return processRequest<UserTokenResponse>(url);
};

const main = async () => {
  const userResponse = await getUser();
  if (!userResponse || !userResponse.pmi) {
    throw new Error('Could not find personal meeting id');
  }

  const userTokenResponse = await getUserToken();
  if (!userTokenResponse.token) {
    throw new Error('Could not find token');
  }

  const data = {
    meetingNumber: userResponse.pmi.toString(),
    zoomAccessToken: userTokenResponse.token,
  };

  console.log(JSON.stringify(data, null, 2));
};

main().catch(e => console.error(e));

// Do not treat it as a global script
export {}
