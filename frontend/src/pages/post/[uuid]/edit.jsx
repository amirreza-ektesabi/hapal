import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import SetPostPage from "src/components/post/setPage";
import {
  postsActions,
  postsSelectors,
  propertiesActions,
  propertiesSelectors,
  usersActions,
} from "src/_store";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { getPost, getPostProperties } from "api";

export default function EditPostPage({ uuid }) {
  const dispatch = useDispatch();

  let postData = useSelector((state) =>
    postsSelectors.selectByUuid(state, uuid)
  );
  let propertiesData = useSelector((state) =>
    propertiesSelectors.selectByPostUuid(state, uuid)
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
    if (!postIsLoading && !postIsError) {
      dispatch(postsActions.addedOne(postResponse.data));
      dispatch(usersActions.addedOne(postResponse.data.user));
    }
  }, [postIsLoading]);

  React.useEffect(() => {
    if (!propertiesIsLoading && !propertiesIsError)
      dispatch(propertiesActions.addedMany(propertiesResponse.data));
  }, [propertiesIsLoading]);

  if (
    postData === undefined ||
    postIsLoading ||
    propertiesData === undefined ||
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
