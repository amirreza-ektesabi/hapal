import apiUrls from "./urls";
import responseApi from "./responseApi";
import { stringFormat } from "src/_helpers";

export async function follow(type, uuid) {
  const url = stringFormat(apiUrls.follows, type, uuid);
  return await responseApi(url, "post");
}

export async function unfollow(type, uuid) {
  const url = stringFormat(apiUrls.follows, type, uuid);
  return await responseApi(url, "delete");
}
