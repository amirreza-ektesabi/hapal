import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ListItems from "src/components/listItems";
import Statistic from "src/components/objectRelated/statistic";
import Header from "src/components/objectRelated/header";
import PostPreview from "src/components/post/preview";
import User from "src/components/objectRelated/user";
import FloatingBox from "src/components/objectRelated/floatingBox";
import CommentDrawer from "src/components/comment/drawer";
import { dateFormat, timeFormat } from "src/general/datetimeFormat";
import numberFormat from "src/general/numberFormat";
import { selectPostUuids } from "src/general/reducers/posts";
import { selectCommentUuids } from "src/general/reducers/comments";
import { selectListByUuid } from "src/general/reducers/lists";
import list_items from "public/sample_data/list_items";

function Statistics({ data, className }) {
  return (
    <Grid className={className + " flex space-x-10"}>
      <Statistic
        variant="horizontal"
        title={"Followers"}
        value={data.followers_count}
      />
      <Statistic
        variant="horizontal"
        title={dateFormat(data.created)}
        value={timeFormat(data.created)}
      />
    </Grid>
  );
}

function About({ data, className }) {
  return (
    <Grid className={className}>
      <Grid>
        <Typography
          variant="h6"
          className="font-bold whitespace-pre-wrap"
          children={data.title}
        />
        <Typography
          variant="body1"
          className="font-light mt-2.5 whitespace-pre-wrap"
          children={data.description}
        />
        <User
          data={data.user}
          includeUsername={true}
          className="mt-4"
          wrap={true}
        />
        <Statistics data={data} className="mr-4 mt-3" />
      </Grid>
    </Grid>
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

function PostList({ data, className }) {
  const post_uuids = useSelector(selectPostUuids);
  return (
    <React.Fragment>
      <Typography
        variant="body2"
        className="font-normal ml-6"
        children={`${numberFormat(data.posts_count, true)} posts`}
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

export default function ListPage({ uuid, className }) {
  const [state, setState] = React.useState({
    drawerIsOpen: false,
  });
  uuid = list_items[0].uuid;
  const comment_uuids = useSelector(selectCommentUuids);
  const data = useSelector((state) => selectListByUuid(state, uuid));

  const toggleDrawer = (open) => () => {
    setState({ ...state, drawerIsOpen: open });
  };

  return (
    <Box className="flex flex-col place-items-center">
      <Grid className="max-w-lg w-full">
        <Top data={data} className="flex justify-center place-items-center" />
        <Divider className="w-full mt-3.5 mb-2" />
        <PostList data={data} />
      </Grid>
      <FloatingBox data={data} toggleDrawer={toggleDrawer} />
      <CommentDrawer
        uuids={comment_uuids}
        toggleDrawer={toggleDrawer}
        drawerIsOpen={state.drawerIsOpen}
      />
    </Box>
  );
}
