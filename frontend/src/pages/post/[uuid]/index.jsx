import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ErrorPage from "src/pages/_error";
import FloatingBox from "src/components/objectRelated/floatingBox";
import { PropertyList } from "src/components/post/propertyList";
import CommentDrawer from "src/components/comment/drawer";
import Statistic from "src/components/objectRelated/statistic";
import User from "src/components/objectRelated/user";
import { dateFormat, timeFormat } from "src/general/functions/datetimeFormat";
import stringToColor from "src/general/functions/stringToColor";
import {
  addedManyComments,
  selectCommentUuidsByRepliedTo,
} from "src/general/reducers/comments";
import { selectPostByUuid } from "src/general/reducers/posts";
import {
  addedManyProperties,
  selectpropertyPuuidsByPostUuid,
} from "src/general/reducers/properties";
import { getDefaultStaticPaths } from "src/components/routing";
import { getPost, getPostComments, getPostProperties } from "api/posts";
import { addedOnePost } from "src/general/reducers/posts";
import stringFormat from "src/general/functions/stringFormat";
import urls from "src/general/urls";
import HeaderImage from "src/components/objectRelated/headerImage";
import HeaderIcons from "src/components/objectRelated/headerIcons";

function PostedIn({ data, className }) {
  const listHref = stringFormat(urls.list, data.added_to.uuid);

  return (
    <Box className="flex space-x-1.5 place-items-center">
      <Typography
        variant="body1"
        className="font-normal"
        color="text.secondary"
        children={"Posted in"}
      />
      <Link href={listHref} className="cursor-pointer">
        <Box
          sx={{ bgcolor: stringToColor(data.added_to.title) }}
          className="w-4 h-4 rounded-sm"
        />
      </Link>
      <Link href={listHref} className="cursor-pointer">
        <Typography
          variant="body1"
          className="truncate font-medium whitespace-pre"
          children={data.added_to.title}
        />
      </Link>
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
    <Box className={className + " max-w-md w-full"}>
      <Typography
        variant="h6"
        className="font-bold whitespace-pre-wrap break-words"
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
  );
}

function Header({ data, className }) {
  return (
    <Box className="relative">
      <HeaderImage data={data} colorDecider={data.title} height="20" />
      <HeaderIcons
        data={data}
        includeMoreIcon={true}
        className="absolute top-4 space-x-3 px-4"
      />
    </Box>
  );
}

function Top({ data, className }) {
  return (
    <Box className={className}>
      <Box className="max-w-lg w-full space-y-4">
        <Header data={data} />
        <About data={data} className="ml-4" />
      </Box>
    </Box>
  );
}

export default function PostPage({
  uuid,
  response,
  comments_response,
  properties_response,
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!router.isFallback && response.error) {
    return <ErrorPage statusCode={response.status} />;
  }

  dispatch(addedOnePost(response.data));
  dispatch(addedManyComments(comments_response.data));
  dispatch(addedManyProperties(properties_response.data));

  const data = useSelector((state) => selectPostByUuid(state, uuid));
  const property_puuids = useSelector((state) =>
    selectpropertyPuuidsByPostUuid(state, data)
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

export async function getStaticProps({ params }) {
  const response = await getPost(params.uuid);
  const comments_response = await getPostComments(params.uuid);
  const properties_response = await getPostProperties(params.uuid);

  return {
    props: {
      uuid: params.uuid,
      response,
      comments_response,
      properties_response,
    },
  };
}

export { getDefaultStaticPaths as getStaticPaths };
