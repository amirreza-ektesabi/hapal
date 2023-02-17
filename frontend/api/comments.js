import { comments } from "api/urls";
import responseApi from "api/responseApi";
import stringFormat from "src/general/functions/stringFormat";

export async function getComments(type, uuid) {
  const url = stringFormat(comments, type, uuid);
  return await responseApi(url, "get");
}
