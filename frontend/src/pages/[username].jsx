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
import ListPreview from "src/components/list/preview";
import {
  addedManyLists,
  selectListUuidsByCreatedBy,
} from "src/general/reducers/lists";
import { addedOneUser, selectUserByUsername } from "src/general/reducers/users";
import { getDefaultStaticPaths } from "src/components/routing";
import { getUser, getUserLists } from "api/users";
import { pluralize } from "src/_helpers";

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

export default function ProfilePage({ username, response, lists_response }) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!router.isFallback && response.error) {
    return <ErrorPage statusCode={response.status} />;
  }

  dispatch(addedOneUser(response.data));
  dispatch(addedManyLists(lists_response.data));

  const data = useSelector((state) => selectUserByUsername(state, username));
  const list_uuids = useSelector((state) =>
    selectListUuidsByCreatedBy(state, data)
  );

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full">
        <Top data={data} className="flex justify-center place-items-center" />
        <Divider className="w-full my-2.5" />
        <Typography
          variant="body2"
          className="font-normal ml-6"
          children={`${data.lists_count} ${pluralize(
            data.lists_count,
            "list"
          )}`}
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

export async function getStaticProps({ params }) {
  const response = await getUser(params.username);
  const lists_response = await getUserLists(params.username);

  return {
    props: {
      username: params.username,
      response,
      lists_response,
    },
  };
}
export { getDefaultStaticPaths as getStaticPaths };
