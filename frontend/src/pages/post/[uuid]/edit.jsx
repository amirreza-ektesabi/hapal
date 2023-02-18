import * as React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import ErrorPage from "src/pages/_error";
import SetPostPage from "src/components/post/setPage";
import {
  addedOnePost,
  selectPostByUuid,
  addedManyProperties,
  selectPropertiesByPostUuid,
} from "src/_store";
import { getDefaultStaticPaths } from "src/components/routing";
import { getPost, getPostProperties } from "api";

export default function EditPostPage({ uuid, response, properties_response }) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!router.isFallback && response.error) {
    return <ErrorPage statusCode={response.status} />;
  }

  dispatch(addedOnePost(response.data));
  dispatch(addedManyProperties(properties_response.data));

  const postData = useSelector((state) => selectPostByUuid(state, uuid));
  const propertiesData = useSelector((state) =>
    selectPropertiesByPostUuid(state, postData)
  );

  const data = {
    title: postData.title,
    properties: propertiesData.map((property, index) => ({
      ...property,
      index: index,
    })),
  };

  return <SetPostPage data={data} />;
}

export async function getStaticProps({ params }) {
  const response = await getPost(params.uuid);
  const properties_response = await getPostProperties(params.uuid);

  return {
    props: {
      uuid: params.uuid,
      response,
      properties_response,
    },
  };
}
export { getDefaultStaticPaths as getStaticPaths };
