import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ListItems from "../components/listItems";
import Property from "../components/property/view";
import FloatingBox from "../components/objectRelated/floatingBox";
import CommentDrawer from "../components/comment/drawer";
import Statistic from "../components/objectRelated/statistic";
import User from "../components/objectRelated/user";
import { dateFormat, timeFormat } from "../general/datetimeFormat";
import stringToColor from "../general/stringToColor";
import { selectCommentUuids } from "../general/reducers/comments";
import { selectPostByUuid } from "../general/reducers/posts";
import { selectPropertyPuuids } from "../general/reducers/properties";

function PostedIn({ data, className }) {
  return (
    <Grid container className="space-x-1.5 place-items-center">
      <Typography
        variant="body1"
        className="font-normal"
        color="text.secondary"
        children={"Posted in"}
      />
      <Box
        sx={{ bgcolor: stringToColor(data.added_to.title) }}
        className="w-4 h-4 rounded-sm"
      />
      <Typography
        variant="body1"
        className="truncate font-medium whitespace-pre"
        children={data.added_to.title}
      />
    </Grid>
  );
}

function Statistics({ data, className }) {
  return (
    <Grid className={className + " flex space-x-10"}>
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
        <PostedIn data={data} />
        <User
          data={data.user}
          className="mt-4"
          includeUsername={true}
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
        <About data={data} className="mt-7 ml-4" />
      </Box>
    </Box>
  );
}

function Timeline({ data, className }) {
  const property_puuids = useSelector(selectPropertyPuuids);
  return (
    <React.Fragment>
      <ListItems
        data={property_puuids}
        itemKey="uuid"
        component={Property}
        includeDivider={false}
        className="space-y-4"
        itemComponentClassName="mx-4"
      />
    </React.Fragment>
  );
}

export default function PostPage({ uuid, className }) {
  const [state, setState] = React.useState({
    drawerIsOpen: false,
  });
  const comment_uuids = useSelector(selectCommentUuids);
  const data = useSelector((state) => selectPostByUuid(state, uuid));

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
