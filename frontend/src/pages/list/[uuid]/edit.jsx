import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import SetListPage from "src/components/list/setList";
import { listsActions, listsSelectors, usersActions } from "src/_store";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { getList } from "api";
import withAuth from "src/components/auth/withAuth";
import AuthContext from "src/components/auth/authContext";

export default withAuth(function EditListPage({ uuid }) {
  const dispatch = useDispatch();
  const { currentUser } = React.useContext(AuthContext);

  let data = useSelector((state) => listsSelectors.selectByUuid(state, uuid));

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
  if (data === undefined || isLoading) return <Loading fullScreen />;
  if (currentUser?.username !== data.user.username)
    return <ErrorPage statusCode={404} />;

  return <SetListPage data={data} />;
});

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
