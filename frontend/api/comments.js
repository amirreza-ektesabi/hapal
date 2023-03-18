import apiUrls from "./urls";
import responseApi from "./responseApi";
import { like, unlike } from "./likes";
import { stringFormat } from "src/_helpers";

export async function getComments(type, uuid) {
  const url = stringFormat(apiUrls.comments, type, uuid);
  return await responseApi(url, "get");
}

export async function likeComment(uuid) {
  return await like("comment", uuid);
}

export async function unlikeComment(uuid) {
  return await unlike("comment", uuid);
}
