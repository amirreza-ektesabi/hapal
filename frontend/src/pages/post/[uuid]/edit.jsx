import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import SetPostPage from "src/components/post/setPage";
import {
  postsActions,
  postsSelectors,
  propertiesActions,
  propertiesSelectors,
} from "src/_store";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { getPost, getPostProperties } from "api";
import withAuth from "src/components/auth/withAuth";
import { AlertContext } from "src/components/alert";
import AuthContext from "src/components/auth/authContext";
import { pageTitle, stringFormat, truncate, useSwrNoFocus } from "src/_helpers";
import messages from "src/general/messages";

export default withAuth(function EditPostPage({ uuid }) {
  const dispatch = useDispatch();
  const { currentUser } = React.useContext(AuthContext);
  const { setAlert } = React.useContext(AlertContext);

  const handleOnSave = async (dataToSave) => {
    setAlert(
      stringFormat(messages.postEdited, truncate(dataToSave.title, 20)),
      "success"
    );
    return await dispatch(postsActions.updated({ ...dataToSave, uuid }));
  };

  let postData = useSelector((state) =>
    postsSelectors.selectByUuid(state, uuid)
  );
  let propertiesData = useSelector((state) =>
    propertiesSelectors.selectByPostUuid(state, uuid)
  );

  const postSwrKey = `post/${uuid}`;
  const postSwrFetcher = () => getPost(uuid);
  const { data: postResponse, isLoading: postIsLoading } = useSwrNoFocus(
    postSwrKey,
    postSwrFetcher
  );
  const postIsError = postResponse && postResponse.error;

  const propertiesSwrKey = `properties/post/${uuid}`;
  const propertiesSwrFetcher = () => getPostProperties(uuid);
  const { data: propertiesResponse, isLoading: propertiesIsLoading } =
    useSwrNoFocus(propertiesSwrKey, propertiesSwrFetcher);
  const propertiesIsError = propertiesResponse && propertiesResponse.error;

  React.useEffect(() => {
    document.title = pageTitle("Editing {0}", postData?.title);
  }, [postData]);

  React.useEffect(() => {
    if (!postIsLoading && !postIsError)
      dispatch(postsActions.retrieved(postResponse.data));
  }, [postResponse]);

  React.useEffect(() => {
    if (!propertiesIsLoading && !propertiesIsError)
      dispatch(
        propertiesActions.retrievedList({
          list: propertiesResponse.data,
          postUuid: uuid,
        })
      );
  }, [propertiesResponse]);

  if (
    postData === undefined ||
    postIsLoading ||
    propertiesData === undefined ||
    propertiesIsLoading
  )
    return <Loading fullScreen />;

  if (postIsError) return <ErrorPage statusCode={postResponse.status} />;
  if (currentUser?.username !== postData.user.username)
    return <ErrorPage statusCode={404} />;

  if (propertiesIsError)
    return <ErrorPage statusCode={propertiesResponse.status} />;

  const data = {
    title: postData.title,
    properties: propertiesData.map((property, index) => ({
      ...property,
      index: index,
    })),
  };

  return <SetPostPage data={data} handleOnSave={handleOnSave} />;
});

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
