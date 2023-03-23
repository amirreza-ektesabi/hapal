import apiUrls from "./urls";
import responseApi from "./responseApi";
import { like, unlike } from "./likes";
import { stringFormat } from "src/_helpers";

export async function getComments(type, uuid) {
  const url = stringFormat(apiUrls.comments, type, uuid);
  return await responseApi(url, "get");
}

export async function createComment(body, repliedTo) {
  const url = stringFormat(apiUrls.comments, repliedTo.type, repliedTo.uuid);
  const data = { body };
  return await responseApi(url, "post", data);
}

export async function deleteComment(uuid) {
  const url = stringFormat(apiUrls.comment, uuid);
  return await responseApi(url, "delete");
}

export async function likeComment(uuid) {
  return await like("comment", uuid);
}

export async function unlikeComment(uuid) {
  return await unlike("comment", uuid);
}
