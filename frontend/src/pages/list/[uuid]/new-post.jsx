import * as React from "react";
import SetPostPage from "src/components/post/setPage";

export default function NewPostPage({ className }) {
  const data = {
    title: "",
  };
  const property_puuids = [];

  return <SetPostPage data={data} property_puuids={property_puuids} />;
}
