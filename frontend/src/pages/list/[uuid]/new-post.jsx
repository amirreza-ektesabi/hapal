import * as React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ErrorPage from "src/pages/_error";
import SetPostPage from "src/components/post/setPage";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";
import { selectListByUuid } from "src/general/reducers/lists";

export default function NewPostPage({ uuid: posted_in_uuid, className }) {
  const router = useRouter();

  const posted_in_data = useSelector((state) => selectListByUuid(state, posted_in_uuid));
  if (!router.isFallback && (!posted_in_uuid || !posted_in_data)) {
    return <ErrorPage statusCode={404} />;
  }

  const data = {
    title: "",
  };
  const property_puuids = [];

  return <SetPostPage data={data} property_puuids={property_puuids} />;
}

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
