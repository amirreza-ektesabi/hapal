import apiUrls from "./urls";
import responseApi from "./responseApi";
import { getLists } from "./lists";
import { stringFormat } from "src/_helpers";
import { follow, unfollow } from "./follows";

export async function getUser(uuid) {
  const url = stringFormat(apiUrls.user, uuid);
  return await responseApi(url, "get");
}

export async function getUserLists(uuid) {
  return await getLists("account", uuid);
}

export async function followUser(uuid) {
  return await follow("account", uuid);
}

export async function unfollowUser(uuid) {
  return await unfollow("account", uuid);
}
