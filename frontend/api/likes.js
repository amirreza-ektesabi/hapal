import apiUrls from "./urls";
import responseApi from "./responseApi";
import { stringFormat } from "src/_helpers";

export async function like(type, uuid) {
  const url = stringFormat(apiUrls.likes, type, uuid);
  return await responseApi(url, "post");
}

export async function unlike(type, uuid) {
  const url = stringFormat(apiUrls.likes, type, uuid);
  return await responseApi(url, "delete");
}
