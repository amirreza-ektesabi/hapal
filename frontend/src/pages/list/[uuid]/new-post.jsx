import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import SetPostPage from "src/components/post/setPage";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { listsActions, listsSelectors, postsActions } from "src/_store";
import { getList } from "api";
import withAuth from "src/components/auth/withAuth";
import AuthContext from "src/components/auth/authContext";
import { pageTitle, useSwrNoFocus } from "src/_helpers";

export default withAuth(function NewPostPage({ uuid }) {
  const dispatch = useDispatch();
  const { currentUser } = React.useContext(AuthContext);

  const handleOnSave = async (dataToSave) => {
    return await dispatch(
      postsActions.created({ ...dataToSave, addedToUuid: uuid })
    );
  };

  let listData = useSelector((state) =>
    listsSelectors.selectByUuid(state, uuid)
  );

  const swrKey = `list/${uuid}`;
  const swrFetcher = () => getList(uuid);
  const { data: response, isLoading } = useSwrNoFocus(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    document.title = pageTitle("Adding post to {0}", listData?.title);
  }, [listData]);

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(listsActions.retrieved(response.data));
  }, [response]);

  if (isError) return <ErrorPage statusCode={response.status} />;
  if (listData === undefined || isLoading) return <Loading fullScreen />;
  if (currentUser?.username !== listData.user.username)
    return <ErrorPage statusCode={404} />;

  const data = { title: "", properties: [] };

  return <SetPostPage data={data} handleOnSave={handleOnSave} />;
});

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
