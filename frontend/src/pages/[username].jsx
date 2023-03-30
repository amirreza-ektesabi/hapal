import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import ListItems from "src/components/listItems";
import Statistic from "src/components/objectRelated/statistic";
import Header from "src/components/objectRelated/header";
import ListPreview from "src/components/list/preview";
import {
  usersActions,
  usersSelectors,
  listsActions,
  listsSelectors,
} from "src/_store";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { getUser, getUserLists } from "api";
import { pluralize, useSwrNoFocus } from "src/_helpers";

function Statistics({ data, className }) {
  return (
    <Box className={className + " flex space-x-10"}>
      <Statistic
        variant="horizontal"
        title={"Following"}
        value={data.following_count}
      />
      <Statistic
        variant="horizontal"
        title={pluralize(data.followers_count, "Follower")}
        value={data.followers_count}
      />
    </Box>
  );
}

function About({ data, className }) {
  return (
    <Box className={className}>
      <Typography
        variant="h6"
        className="font-bold whitespace-pre-wrap break-words"
        children={data.name}
      />
      <Typography
        variant="body1"
        className="font-normal whitespace-pre-wrap break-words"
        color="text.secondary"
        children={"@" + data.username}
      />
      <Typography
        variant="body1"
        className="font-light mt-2.5 whitespace-pre-wrap break-words"
        children={data.bio}
      />
      <Statistics data={data} className="mt-2.5" />
    </Box>
  );
}

function Top({ data, className }) {
  return (
    <Box className={className}>
      <Box className="max-w-lg w-full">
        <Header
          data={data}
          colorDecider={data.name + data.username}
          includeProfileAvatar={true}
        />
        <About data={data} className="mt-12 ml-4" />
      </Box>
    </Box>
  );
}

function ListList({ uuids, isLoading, isError, className }) {
  return (
    <React.StrictMode>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        ""
      ) : (
        <ListItems
          data={uuids}
          itemKey="uuid"
          component={ListPreview}
          itemComponentClassName="mx-4"
        />
      )}
    </React.StrictMode>
  );
}

function Lists({ data, className }) {
  const dispatch = useDispatch();

  let uuids = useSelector((state) =>
    listsSelectors.selectUuidsByCreatedBy(state, data)
  );

  const swrKey = `lists/user/${data.username}`;
  const swrFetcher = () => getUserLists(data.username);
  const { data: response, isLoading } = useSwrNoFocus(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError)
      dispatch(
        listsActions.retrievedList({
          list: response.data,
          userUsername: data.username,
        })
      );
  }, [response]);

  return (
    <React.StrictMode>
      <Typography
        variant="body2"
        className="font-normal ml-6"
        children={`${data.lists_count} ${pluralize(data.lists_count, "list")}`}
        paragraph={true}
      />
      <ListList uuids={uuids} isLoading={isLoading} isError={isError} />
    </React.StrictMode>
  );
}

export default function ProfilePage({ username }) {
  const dispatch = useDispatch();

  const data = useSelector((state) =>
    usersSelectors.selectByUsername(state, username)
  );

  const swrKey = `user/${username}`;
  const swrFetcher = () => getUser(username);
  const { data: response, isLoading } = useSwrNoFocus(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(usersActions.addedOne(response.data));
  }, [response]);

  if (isError) return <ErrorPage statusCode={response.status} />;
  if (data === undefined || isLoading) return <Loading fullScreen />;

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full">
        <Top data={data} className="flex justify-center place-items-center" />
        <Divider className="w-full my-2.5" />
        <Lists data={data} />
      </Box>
    </Box>
  );
}

export const getStaticProps = getDefaultStaticProps("username");
export { getDefaultStaticPaths as getStaticPaths };
