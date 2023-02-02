import * as React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ErrorPage from "src/pages/_error";
import FloatingBox from "src/components/objectRelated/floatingBox";
import { PropertyList } from "src/components/post/propertyList";
import CommentDrawer from "src/components/comment/drawer";
import Statistic from "src/components/objectRelated/statistic";
import User from "src/components/objectRelated/user";
import { dateFormat, timeFormat } from "src/general/datetimeFormat";
import stringToColor from "src/general/stringToColor";
import { selectCommentUuids } from "src/general/reducers/comments";
import { selectPostByUuid } from "src/general/reducers/posts";
import { selectPropertyPuuids } from "src/general/reducers/properties";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";

function PostedIn({ data, className }) {
  return (
    <Box className="flex space-x-1.5 place-items-center">
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
    </Box>
  );
}

function Statistics({ data, className }) {
  return (
    <Box className={className + " flex space-x-10"}>
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
      </Box>
    </Box>
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

export default function PostPage({ uuid }) {
  const router = useRouter();
  
  const data = useSelector((state) => selectPostByUuid(state, uuid));
  if (!router.isFallback && (!uuid || !data)) {
    return <ErrorPage statusCode={404} />;
  }

  const property_puuids = useSelector(selectPropertyPuuids);
  const comment_uuids = useSelector(selectCommentUuids);

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
        <PropertyList data={data} puuis={property_puuids} className="px-4" />
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

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
