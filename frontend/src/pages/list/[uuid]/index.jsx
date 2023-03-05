import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import ListItems from "src/components/listItems";
import Statistic from "src/components/objectRelated/statistic";
import Header from "src/components/objectRelated/header";
import PostPreview from "src/components/post/preview";
import User from "src/components/objectRelated/user";
import FloatingBox from "src/components/objectRelated/floatingBox";
import CommentDrawer from "src/components/comment/drawer";
import { dateFormat, timeFormat, pluralize } from "src/_helpers";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import {
  addedManyPosts,
  addedOneList,
  selectListByUuid,
  selectPostUuidsByAddedTo,
} from "src/_store";
import { getList, getListPosts } from "api";

function Statistics({ data, className }) {
  return (
    <Box className={className + " flex space-x-10"}>
      <Statistic
        variant="horizontal"
        title={pluralize(data.followers_count, "Follower")}
        value={data.followers_count}
      />
      <Statistic
        variant="horizontal"
        title={dateFormat(data.created)}
        value={timeFormat(data.created)}
      />
    </Box>
  );
}

function About({ data, className }) {
  return (
    <Box className={className}>
      <Box>
        <Typography
          variant="h6"
          className="font-bold whitespace-pre-wrap break-words"
          children={data.title}
        />
        <Typography
          variant="body1"
          className="font-light mt-2.5 whitespace-pre-wrap break-words"
          children={data.description}
        />
        <User
          data={data.user}
          includeUsername={true}
          className="mt-4"
          wrap={true}
        />
        <Statistics data={data} className="mr-4 mt-3" />
      </Box>
    </Box>
  );
}

function Top({ data, className }) {
  return (
    <Box className={className}>
      <Box className="max-w-lg w-full">
        <Header data={data} colorDecider={data.title} includeMoreIcon={true} />
        <About data={data} className="mt-7 ml-4" />
      </Box>
    </Box>
  );
}

function PostList({ uuids, isLoading, isError, className }) {
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
          component={PostPreview}
          itemComponentClassName="mx-4"
        />
      )}
    </React.StrictMode>
  );
}

function Posts({ data, className }) {
  const dispatch = useDispatch();

  let uuids = useSelector((state) => selectPostUuidsByAddedTo(state, data));

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(addedManyPosts(response.data));
  });

  const { data: response, isLoading } = useSWR(
    `posts/${data.type}/${data.uuid}`,
    () => getListPosts(data.uuid)
  );
  const isError = response && response.error;

  return (
    <React.StrictMode>
      <Typography
        variant="body2"
        className="font-normal ml-6"
        children={`${data.posts_count} ${pluralize(data.posts_count, "post")}`}
        paragraph={true}
      />
      <PostList uuids={uuids} isLoading={isLoading} isError={isError} />
    </React.StrictMode>
  );
}

export default function ListPage({ uuid }) {
  const dispatch = useDispatch();

  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);
  const toggleDrawer = (open) => () => setDrawerIsOpen(open);

  const data = useSelector((state) => selectListByUuid(state, uuid));

  const swrKey = `list/${uuid}`;
  const swrFetcher = () => getList(uuid);
  const { data: response, isLoading } = useSWR(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(addedOneList(response.data));
  }, [isLoading]);

  if (isError) return <ErrorPage statusCode={response.status} />;
  if (data === undefined || isLoading) return <Loading fullScreen />;

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full">
        <Top data={data} className="flex justify-center place-items-center" />
        <Divider className="w-full mt-3.5 mb-2" />
        <Posts data={data} />
      </Box>
      <FloatingBox data={data} toggleDrawer={toggleDrawer} />
      <CommentDrawer
        repliedTo={data}
        toggleDrawer={toggleDrawer}
        drawerIsOpen={drawerIsOpen}
      />
    </Box>
  );
}

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
