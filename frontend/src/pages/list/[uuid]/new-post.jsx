import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import SetPostPage from "src/components/post/setPage";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { listsActions, listsSelectors, usersActions } from "src/_store";
import { getList } from "api";

export default function NewPostPage({ uuid }) {
  const dispatch = useDispatch();

  let listData = useSelector((state) =>
    listsSelectors.selectByUuid(state, uuid)
  );

  const swrKey = `list/${uuid}`;
  const swrFetcher = () => getList(uuid);
  const { data: response, isLoading } = useSWR(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError) {
      dispatch(listsActions.addedOne(response.data));
      dispatch(usersActions.addedOne(response.data.user));
    }
  }, [isLoading]);

  if (isError) return <ErrorPage statusCode={response.status} />;
  if (listData === undefined || isLoading) return <Loading fullScreen />;

  const data = { title: "", properties: [] };

  return <SetPostPage data={data} />;
}

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
