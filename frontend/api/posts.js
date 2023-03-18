import apiUrls from "./urls";
import responseApi from "./responseApi";
import { getComments } from "./comments";
import { getProperties } from "./properties";
import { like, unlike } from "./likes";
import { stringFormat } from "src/_helpers";

export async function getPost(uuid) {
  const url = stringFormat(apiUrls.post, uuid);
  return await responseApi(url, "get");
}

export async function getPostComments(uuid) {
  return await getComments("post", uuid);
}

export async function getPostProperties(uuid) {
  return await getProperties(uuid);
}

export async function getPosts(type, uuid) {
  const url = stringFormat(apiUrls.posts, type, uuid);
  return await responseApi(url, "get");
}

export async function likePost(uuid) {
  return await like("post", uuid);
}

export async function unlikePost(uuid) {
  return await unlike("post", uuid);
}
