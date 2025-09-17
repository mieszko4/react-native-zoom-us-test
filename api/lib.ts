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

const processRequest = async <Response>(endpoint: string, urlSearchParams = new URLSearchParams()) => {
  const url = new URL(`${baseUrl}${endpoint}`);
  [...urlSearchParams.entries()].forEach(([name, value]) => url.searchParams.append(name, value))
  
  const response = await fetch(url.toString(), {
    headers,
  });

  const json = (await response.json()) as Error | Response;

  if (typeof json === 'object' && json && 'code' in json) {
    throw new Error(json.message);
  }

  return json;
};

export {processRequest}