import fetch from 'node-fetch';

import apiJwtTokenJson from './api.jwt.json';

const baseUrl = 'https://api.zoom.us/v2';
const headers = {
  'User-Agent': 'React-Native-Zoom-Us-Test',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiJwtTokenJson.jwtToken}`,
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

type UsersResponse = {
  users: {
    pmi: string;
    id: string;
  }[];
};
const getUsers = async () => {
  const url = new URL(`${baseUrl}/users`);
  url.searchParams.append('status', 'active');

  return processRequest<UsersResponse>(url);
};

type UserTokenResponse = {
  token: string;
};
const getUserToken = async (id: string) => {
  const url = new URL(`${baseUrl}/users/${id}/token`);
  url.searchParams.append('type', 'zak');
  url.searchParams.append('ttl', '3600');

  return processRequest<UserTokenResponse>(url);
};

const main = async () => {
  const usersResponse = await getUsers();

  const [firstUser] = usersResponse.users || [];
  if (!firstUser || !firstUser.pmi || !firstUser.id) {
    throw new Error('Could not find user with personal meeting id');
  }

  const userTokenResponse = await getUserToken(firstUser.id);
  if (!userTokenResponse.token) {
    throw new Error('Could not find token');
  }

  const data = {
    meetingNumber: firstUser.pmi.toString(),
    zoomAccessToken: userTokenResponse.token,
  };

  console.log(JSON.stringify(data, null, 2));
};

main().catch(e => console.error(e));
