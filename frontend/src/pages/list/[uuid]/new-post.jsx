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
import { addedOneList, selectListByUuid } from "src/_store";
import { getList } from "api";

export default function NewPostPage({ uuid }) {
  const dispatch = useDispatch();

  let listData = useSelector((state) => selectListByUuid(state, uuid));

  const swrKey = `list/${uuid}`;
  const swrFetcher = () => getList(uuid);
  const { data: response, isLoading } = useSWR(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(addedOneList(response.data));
  }, [isLoading]);

  if (isError) return <ErrorPage statusCode={response.status} />;
  if (listData === undefined || isLoading) return <Loading fullScreen />;

  const data = { title: "", properties: [] };

  return <SetPostPage data={data} />;
}

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
