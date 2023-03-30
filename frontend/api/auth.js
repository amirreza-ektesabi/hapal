import apiUrls from "./urls";
import responseApi from "./responseApi";

export async function createToken(data) {
  return await responseApi(apiUrls.createToken, "post", data);
}

export async function createUser(data) {
  return await responseApi(apiUrls.createUser, "post", data);
}

export async function getCurrentUser() {
  return await responseApi(apiUrls.currentUser, "get");
}

export async function updateProfile(data) {
  return await responseApi(apiUrls.currentUser, "put", data);
}
