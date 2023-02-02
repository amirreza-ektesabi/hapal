import * as React from "react";
import { useSelector } from "react-redux";
import SetPostPage from "src/components/post/setPage";
import { selectPostByUuid } from "src/general/reducers/posts";
import { selectPropertyPuuids } from "src/general/reducers/properties";
import post_items from "public/sample_data/post_items";
import {
  getDefaultStaticProps,
  getDefaultStaticPaths,
} from "src/components/routing";

export default function EditPostPage({ uuid, className }) {
  uuid = post_items[0].uuid;
  const data = useSelector((state) => selectPostByUuid(state, uuid));
  const property_puuids = useSelector(selectPropertyPuuids);

  return <SetPostPage data={data} property_puuids={property_puuids} />;
}

export const getStaticProps = getDefaultStaticProps("uuid");
export { getDefaultStaticPaths as getStaticPaths };
