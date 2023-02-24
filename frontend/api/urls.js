const hostUrl = "http://localhost:8000";

const apiUrls = {
  user: `${hostUrl}/account/{0}/`,
  list: `${hostUrl}/list/{0}/`,
  lists: `${hostUrl}/{0}/{1}/lists/`,
  post: `${hostUrl}/post/{0}/`,
  posts: `${hostUrl}/{0}/{1}/posts/`,
  comments: `${hostUrl}/{0}/{1}/comments/`,
  properties: `${hostUrl}/post/{0}/properties/`,

  // auth
  createToken: `${hostUrl}/auth/jwt/create/`,
  createUser: `${hostUrl}/auth/users/`,
  getMe: `${hostUrl}/auth/users/me/`,
};

export default apiUrls;
