import * as React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import ErrorPage from "src/pages/_error";
import SetPostPage from "src/components/post/setPage";
import { getDefaultStaticPaths } from "src/components/routing";
import { addedOneList } from "src/_store";
import { getList } from "api";

export default function NewPostPage({ posted_in_uuid, response }) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!router.isFallback && response.error) {
    return <ErrorPage statusCode={404} />;
  }

  dispatch(addedOneList(response.data));

  const data = { title: "", properties: [] };

  return <SetPostPage data={data} />;
}

export async function getStaticProps({ params }) {
  const response = await getList(params.uuid);

  return {
    props: {
      posted_in_uuid: params.uuid,
      response,
    },
  };
}
export { getDefaultStaticPaths as getStaticPaths };
