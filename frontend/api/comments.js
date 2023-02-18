import apiUrls from "./urls";
import responseApi from "./responseApi";
import { stringFormat } from "src/_helpers";

export async function getComments(type, uuid) {
  const url = stringFormat(apiUrls.comments, type, uuid);
  return await responseApi(url, "get");
}
