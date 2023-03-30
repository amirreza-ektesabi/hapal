import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import SetListPage from "src/components/list/setPage";
import { listsActions, listsSelectors } from "src/_store";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { getList } from "api";
import withAuth from "src/components/auth/withAuth";
import AuthContext from "src/components/auth/authContext";
import { useSwrNoFocus } from "src/_helpers";

export default withAuth(function EditListPage({ uuid }) {
  const dispatch = useDispatch();
  const { currentUser } = React.useContext(AuthContext);

  const handleOnSave = async (dataToSave) => {
    return await dispatch(listsActions.updated({ ...dataToSave, uuid }));
  };

  let data = useSelector((state) => listsSelectors.selectByUuid(state, uuid));

  const swrKey = `list/${uuid}`;
  const swrFetcher = () => getList(uuid);
  const { data: response, isLoading } = useSwrNoFocus(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(listsActions.retrieved(response.data));
  }, [response]);

  if (isError) return <ErrorPage statusCode={response.status} />;
  if (data === undefined || isLoading) return <Loading fullScreen />;
  if (currentUser?.username !== data.user.username)
    return <ErrorPage statusCode={404} />;

  return <SetListPage data={data} handleOnSave={handleOnSave} />;
});

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
