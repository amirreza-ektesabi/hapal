import { user } from "api/urls";
import responseApi from "api/responseApi";
import { getLists } from "api/lists";
import stringFormat from "src/general/functions/stringFormat";

export async function getUser(uuid) {
  const url = stringFormat(user, uuid);
  return await responseApi(url, "get");
}

export async function getUserLists(uuid) {
  return await getLists("account", uuid);
}
