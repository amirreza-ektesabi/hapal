import { properties } from "api/urls";
import responseApi from "api/responseApi";
import { stringFormat } from "src/_helpers";

export async function getProperties(uuid) {
    const url = stringFormat(properties, uuid);
    return await responseApi(url, "get");
}