import {processRequest} from './lib'

type UserResponse = {
  id: string;
  pmi: number;
};
const getUser = async () => {
  return processRequest<UserResponse>('/users/me');
};

type UserTokenResponse = {
  token: string;
};
const getUserToken = async () => {
  const urlSearchParams = new URLSearchParams({
    type: 'zak',
    ttl: '3600'
  })

  return processRequest<UserTokenResponse>('/users/me/token', urlSearchParams);
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
