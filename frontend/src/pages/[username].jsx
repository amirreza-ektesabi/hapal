import * as React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ErrorPage from "src/pages/_error";
import ListItems from "src/components/listItems";
import Statistic from "src/components/objectRelated/statistic";
import Header from "src/components/objectRelated/header";
import ListPreview from "src/components/list/preview";
import { selectListUuids } from "src/general/reducers/lists";
import { selectUserByUsername } from "src/general/reducers/users";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";

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
        title={"Followers"}
        value={data.followers_count}
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
          children={data.name}
        />
        <Typography
          variant="body1"
          className="font-normal whitespace-pre-wrap"
          color="text.secondary"
          children={"@" + data.username}
        />
        <Typography
          variant="body1"
          className="font-light mt-2.5 whitespace-pre-wrap"
          children={data.bio}
        />
        <Statistics data={data} className="mt-2.5" />
      </Box>
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

export default function ProfilePage({ username, className }) {
  const router = useRouter();

  const data = useSelector((state) => selectUserByUsername(state, username));
  if (!router.isFallback && (!username || !data)) {
    return <ErrorPage statusCode={404} />;
  }
  const list_uuids = useSelector(selectListUuids);

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg">
        <Top data={data} className="flex justify-center place-items-center" />
        <Divider className="w-full my-2.5" />
        <Typography
          variant="body2"
          className="font-normal ml-6"
          children={`${data.lists_count} lists`}
          paragraph={true}
        />
        <ListItems
          data={list_uuids}
          itemKey="uuid"
          component={ListPreview}
          itemComponentClassName="mx-4"
        />
      </Box>
    </Box>
  );
}

export const getStaticProps = getDefaultStaticProps("username");
export { getDefaultStaticPaths as getStaticPaths };
