const hostUrl = "http://localhost:8000";

const apiUrls = {
  user: `${hostUrl}/account/{0}/`,

  list: `${hostUrl}/list/{0}/`,
  lists: `${hostUrl}/{0}/{1}/lists/`,
  newList: `${hostUrl}/list/create/`,

  post: `${hostUrl}/post/{0}/`,
  posts: `${hostUrl}/{0}/{1}/posts/`,
  newPost: `${hostUrl}/list/{0}/posts/`,

  comment: `${hostUrl}/comment/{0}/`,
  comments: `${hostUrl}/{0}/{1}/comments/`,

  properties: `${hostUrl}/post/{0}/properties/`,

  likes: `${hostUrl}/{0}/{1}/likes/`,

  follows: `${hostUrl}/{0}/{1}/followers/`,

  // auth
  createToken: `${hostUrl}/auth/jwt/create/`,
  createUser: `${hostUrl}/auth/users/`,
  currentUser: `${hostUrl}/auth/users/me/`,
};

export default apiUrls;
