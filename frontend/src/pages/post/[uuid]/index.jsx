import * as React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ErrorPage from "src/pages/_error";
import Loading from "src/components/loading";
import HeaderImage from "src/components/objectRelated/headerImage";
import HeaderIcons from "src/components/objectRelated/headerIcons";
import FloatingBox from "src/components/objectRelated/floatingBox";
import { PropertyList } from "src/components/post/propertyList";
import CommentDrawer from "src/components/comment/drawer";
import Statistic from "src/components/objectRelated/statistic";
import User from "src/components/objectRelated/user";
import {
  stringFormat,
  stringToColor,
  dateFormat,
  timeFormat,
  useSwrNoFocus,
  pageTitle,
} from "src/_helpers";
import { postsActions, postsSelectors } from "src/_store";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { getPost } from "api";
import urls from "src/general/urls";

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

export default function PostPage({ uuid }) {
  const dispatch = useDispatch();

  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);
  const toggleDrawer = (open) => () => setDrawerIsOpen(open);

  const data = useSelector((state) => postsSelectors.selectByUuid(state, uuid));

  const swrKey = `post/${uuid}`;
  const swrFetcher = () => getPost(uuid);
  const { data: response, isLoading } = useSwrNoFocus(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    document.title = pageTitle("{0}", data?.title);
  }, [data]);

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(postsActions.retrieved(response.data));
  }, [response]);

  if (isError) return <ErrorPage statusCode={response.status} />;
  if (data === undefined || isLoading) return <Loading fullScreen />;

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full">
        <Top data={data} className="flex justify-center place-items-center" />
        <Divider className="w-full mt-3.5 mb-2" />
        <PropertyList postData={data} className="px-4 mb-10" />
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
