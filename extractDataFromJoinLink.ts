export const extractDataFromJoinLink = (link: string) => {
  const url = new URL(link);

  const password = url.searchParams.get('pwd');
  const meetingNumber = url.pathname.replace('/j/', '') || null;

  return {
    password,
    meetingNumber,
  };
};
