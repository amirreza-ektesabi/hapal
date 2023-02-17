import * as React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ErrorPage from "src/pages/_error";
import ListItems from "src/components/listItems";
import Statistic from "src/components/objectRelated/statistic";
import Header from "src/components/objectRelated/header";
import PostPreview from "src/components/post/preview";
import User from "src/components/objectRelated/user";
import FloatingBox from "src/components/objectRelated/floatingBox";
import CommentDrawer from "src/components/comment/drawer";
import { dateFormat, timeFormat } from "src/general/functions/datetimeFormat";
import {
  addedManyPosts,
  selectPostUuidsByAddedTo,
} from "src/general/reducers/posts";
import {
  addedManyComments,
  selectCommentUuidsByRepliedTo,
} from "src/general/reducers/comments";
import { addedOneList, selectListByUuid } from "src/general/reducers/lists";
import { getDefaultStaticPaths } from "src/components/routing";
import { getList, getListComments, getListPosts } from "api/lists";
import pluralize from "src/general/functions/pluralize";

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

function PostList({ data, post_uuids, className }) {
  return (
    <React.Fragment>
      <Typography
        variant="body2"
        className="font-normal ml-6"
        children={`${data.posts_count} ${pluralize(data.posts_count, "post")}`}
        paragraph={true}
      />
      <ListItems
        data={post_uuids}
        itemKey="uuid"
        component={PostPreview}
        itemComponentClassName="mx-4"
      />
    </React.Fragment>
  );
}

export default function ListPage({
  uuid,
  response,
  posts_response,
  comments_response,
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!router.isFallback && response.error) {
    return <ErrorPage statusCode={response.status} />;
  }

  dispatch(addedOneList(response.data));
  dispatch(addedManyPosts(posts_response.data));
  dispatch(addedManyComments(comments_response.data));

  const data = useSelector((state) => selectListByUuid(state, uuid));
  const post_uuids = useSelector((state) =>
    selectPostUuidsByAddedTo(state, data)
  );
  const comment_uuids = useSelector((state) =>
    selectCommentUuidsByRepliedTo(state, data)
  );

  const [state, setState] = React.useState({
    drawerIsOpen: false,
  });

  const toggleDrawer = (open) => () => {
    setState({ ...state, drawerIsOpen: open });
  };

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full">
        <Top data={data} className="flex justify-center place-items-center" />
        <Divider className="w-full mt-3.5 mb-2" />
        <PostList data={data} post_uuids={post_uuids} />
      </Box>
      <FloatingBox data={data} toggleDrawer={toggleDrawer} />
      <CommentDrawer
        uuids={comment_uuids}
        toggleDrawer={toggleDrawer}
        drawerIsOpen={state.drawerIsOpen}
      />
    </Box>
  );
}

export async function getStaticProps({ params }) {
  const response = await getList(params.uuid);
  const posts_response = await getListPosts(params.uuid);
  const comments_response = await getListComments(params.uuid);

  return {
    props: {
      uuid: params.uuid,
      response,
      posts_response,
      comments_response,
    },
  };
}
export { getDefaultStaticPaths as getStaticPaths };
