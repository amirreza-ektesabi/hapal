import apiUrls from "./urls";
import responseApi from "./responseApi";
import { getPosts } from "./posts";
import { getComments } from "./comments";
import { stringFormat } from "src/_helpers";

export async function getList(uuid) {
  const url = stringFormat(apiUrls.list, uuid);
  return await responseApi(url, "get");
}

export async function getListComments(uuid) {
  return await getComments("list", uuid);
}

export async function getListPosts(uuid) {
  return await getPosts("list", uuid);
}

export async function getLists(type, uuid) {
  const url = stringFormat(apiUrls.lists, type, uuid);
  return await responseApi(url, "get");
}
