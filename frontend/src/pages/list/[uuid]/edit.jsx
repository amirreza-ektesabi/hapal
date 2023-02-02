import * as React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ErrorPage from "src/pages/_error";
import SetListPage from "src/components/list/setList";
import { selectListByUuid } from "src/general/reducers/lists";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";

export default function EditListPage({ uuid, className }) {
  const router = useRouter();
  
  const data = useSelector((state) => selectListByUuid(state, uuid));
  if (!router.isFallback && (!uuid || !data)) {
    return <ErrorPage statusCode={404} />;
  }

  return <SetListPage data={data} />;
}

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
