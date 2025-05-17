export const ApiPath = {
  // Auth
  LOGIN: getApiPath("auth/login"),
  REGISTER: getApiPath("auth/register"),
  // Category
  CATEGORY_ALL: getApiPath("category/all"),
  CATEGORY_CREATE: getApiPath("category/create"),
  CATEGORY_UPDATE: getApiPath("category/update/"),
  CATEGORY_DELETE: getApiPath("category/delete/"),
  CATEGORY_DETAIL: getApiPath("category/detail/"),
  CATEGORY_LIST: getApiPath("category/list"),

};

function getApiPath(path: string) {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT!}/api/${path}`;
} 