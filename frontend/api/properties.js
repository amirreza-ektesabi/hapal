import apiUrls from "./urls";
import responseApi from "./responseApi";
import { stringFormat } from "src/_helpers";

export async function getProperties(uuid) {
  const url = stringFormat(apiUrls.properties, uuid);
  return await responseApi(url, "get");
}
