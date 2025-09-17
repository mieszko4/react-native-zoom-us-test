const getOauthToken = async (
  accountId: string,
  clientId: string,
  clientSecret: string,
) => {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: accountId,
    }).toString(),
  })

  if (res.status !== 200) {
    throw new Error('Invalid response');
  }

  return await res.json()
};

if (!process.env.ACCOUNT_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error('You must provide envs: ACCOUNT_ID, CLIENT_ID and CLIENT_SECRET');
}

getOauthToken(
  process.env.ACCOUNT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
).then(oauthToken => console.log(JSON.stringify({oauthToken}, null, 2)));

// Do not treat it as a global script
export {}
