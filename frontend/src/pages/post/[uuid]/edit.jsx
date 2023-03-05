import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import SetPostPage from "src/components/post/setPage";
import {
  addedOnePost,
  selectPostByUuid,
  addedManyProperties,
  selectPropertiesByPostUuid,
} from "src/_store";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { getPost, getPostProperties } from "api";

export default function EditPostPage({ uuid }) {
  const dispatch = useDispatch();

  let postData = useSelector((state) => selectPostByUuid(state, uuid));
  let propertiesData = useSelector((state) =>
    selectPropertiesByPostUuid(state, uuid)
  );

  const postSwrKey = `post/${uuid}`;
  const postSwrFetcher = () => getPost(uuid);
  const { data: postResponse, isLoading: postIsLoading } = useSWR(
    postSwrKey,
    postSwrFetcher
  );
  const postIsError = postResponse && postResponse.error;

  const propertiesSwrKey = `properties/post/${uuid}`;
  const propertiesSwrFetcher = () => getPostProperties(uuid);
  const { data: propertiesResponse, isLoading: propertiesIsLoading } = useSWR(
    propertiesSwrKey,
    propertiesSwrFetcher
  );
  const propertiesIsError = propertiesResponse && propertiesResponse.error;

  React.useEffect(() => {
    if (!postIsLoading && !postIsError)
      dispatch(addedOnePost(postResponse.data));
  }, [postIsLoading]);

  React.useEffect(() => {
    if (!propertiesIsLoading && !propertiesIsError)
      dispatch(addedManyProperties(propertiesResponse.data));
  }, [propertiesIsLoading]);

  if (
    postData === undefined ||
    postIsLoading ||
    propertiesData === undefined ||
    propertiesData.length === 0 ||
    propertiesIsLoading
  )
    return <Loading fullScreen />;

  if (postIsError) return <ErrorPage statusCode={postResponse.status} />;

  if (propertiesIsError)
    return <ErrorPage statusCode={propertiesResponse.status} />;

  const data = {
    title: postData.title,
    properties: propertiesData.map((property, index) => ({
      ...property,
      index: index,
    })),
  };

  return <SetPostPage data={data} />;
}

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
