import { list, lists } from "api/urls";
import responseApi from "api/responseApi";
import { getPosts } from "./posts";
import { getComments } from "api/comments";
import { stringFormat } from "src/_helpers";

export async function getList(uuid) {
    const url = stringFormat(list, uuid);
    return await responseApi(url, "get");
}

export async function getListComments(uuid) {
    return await getComments("list", uuid);
}

export async function getListPosts(uuid) {
    return await getPosts("list", uuid);
}

export async function getLists(type, uuid) {
    const url = stringFormat(lists, type, uuid);
    return await responseApi(url, "get");
}