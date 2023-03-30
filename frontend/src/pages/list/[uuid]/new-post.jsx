import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import SetPostPage from "src/components/post/setPage";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { listsActions, listsSelectors, usersActions } from "src/_store";
import { getList } from "api";
import withAuth from "src/components/auth/withAuth";
import AuthContext from "src/components/auth/authContext";
import { useSwrNoFocus } from "src/_helpers";

export default withAuth(function NewPostPage({ uuid }) {
  const dispatch = useDispatch();
  const { currentUser } = React.useContext(AuthContext);

  let listData = useSelector((state) =>
    listsSelectors.selectByUuid(state, uuid)
  );

  const swrKey = `list/${uuid}`;
  const swrFetcher = () => getList(uuid);
  const { data: response, isLoading } = useSwrNoFocus(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(listsActions.retrieved(response.data));
  }, [response]);

  if (isError) return <ErrorPage statusCode={response.status} />;
  if (listData === undefined || isLoading) return <Loading fullScreen />;
  if (currentUser?.username !== listData.user.username)
    return <ErrorPage statusCode={404} />;

  const data = { title: "", properties: [] };

  return <SetPostPage data={data} />;
});

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
