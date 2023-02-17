import { properties } from "api/urls";
import responseApi from "api/responseApi";
import stringFormat from "src/general/functions/stringFormat";

export async function getProperties(uuid) {
  const url = stringFormat(properties, uuid);
  return await responseApi(url, "get");
}
