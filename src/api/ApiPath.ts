export const ApiPath = {
  // Auth
  LOGIN: getApiPath("auth/login"),


};

function getApiPath(path: string) {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT!}/api/v1/${path}`;
} 