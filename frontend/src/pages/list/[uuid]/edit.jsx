import * as React from "react";
import { useSelector } from "react-redux";
import SetListPage from "src/components/list/setList";
import { selectListByUuid } from "src/general/reducers/lists";
import list_items from "public/sample_data/list_items";

export default function EditListPage({ uuid, className }) {
  uuid = list_items[0].uuid;
  const data = useSelector((state) => selectListByUuid(state, uuid));

  return <SetListPage data={data} />;
}
