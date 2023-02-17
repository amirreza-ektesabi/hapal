import * as React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import ErrorPage from "src/pages/_error";
import SetListPage from "src/components/list/setList";
import { addedOneList, selectListByUuid } from "src/general/reducers/lists";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { getList } from "api/lists";

export default function EditListPage({ uuid, response }) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!router.isFallback && response.error) {
    return <ErrorPage statusCode={404} />;
  }

  dispatch(addedOneList(response.data));

  const data = useSelector((state) => selectListByUuid(state, uuid));

  return <SetListPage data={data} />;
}

export async function getStaticProps({ params }) {
  const response = await getList(params.uuid);

  return {
    props: {
      uuid: params.uuid,
      response,
    },
  };
}
export { getDefaultStaticPaths as getStaticPaths };
