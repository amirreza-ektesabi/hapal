import { post, posts } from "api/urls";
import responseApi from "api/responseApi";
import { getComments } from "api/comments";
import { getProperties } from "api/properties";
import { stringFormat } from "src/_helpers";

export async function getPost(uuid) {
    const url = stringFormat(post, uuid);
    return await responseApi(url, "get");
}

export async function getPostComments(uuid) {
    return await getComments("post", uuid);
}

export async function getPostProperties(uuid) {
    return await getProperties(uuid);
}

export async function getPosts(type, uuid) {
    const url = stringFormat(posts, type, uuid);
    return await responseApi(url, "get");
}