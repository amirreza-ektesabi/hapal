import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ListItems from "../components/listItems";
import Statistic from "../components/objectRelated/statistic";
import Header from "../components/objectRelated/header";
import PostPreview from "../components/post/preview";
import User from "../components/objectRelated/user";
import FloatingBox from "../components/objectRelated/floatingBox";
import CommentDrawer from "../components/comment/drawer";
import { dateFormat, timeFormat } from "../general/datetimeFormat";
import numberFormat from "../general/numberFormat";
import { selectPostUuids } from "../general/reducers/posts";
import { selectCommentUuids } from "../general/reducers/comments";
import { selectListByUuid } from "../general/reducers/lists";

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
        <Header data={data} colorDecider={data.title} />
        <About data={data} className="mt-7 ml-4" />
      </Box>
    </Box>
  );
}

function Timeline({ data, className }) {
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
        <Timeline data={data} />
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
