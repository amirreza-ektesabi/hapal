import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import Box from "@mui/material/Box";
import Loading from "src/components/loading";
import ListItems from "src/components/listItems";
import Property from "src/components/property/view";
import EditProperty from "src/components/property/editView";
import {
  addedManyProperties,
  selectpropertyPuuidsByPostUuid,
} from "src/_store";
import { getPostProperties } from "api";

export function PropertyEditList({
  data,
  className,
  handleRemove,
  handleEdit,
}) {
  return (
    <Box className={className}>
      <ListItems
        data={data}
        itemKey="data"
        component={EditProperty}
        includeDivider={false}
        randomKey={true}
        className="space-y-4"
        handleEdit={handleEdit}
        handleRemove={handleRemove}
      />
    </Box>
  );
}

export function PropertyList({ postData, className }) {
  const dispatch = useDispatch();

  let puuids = useSelector((state) =>
    selectpropertyPuuidsByPostUuid(state, postData.uuid)
  );

  React.useEffect(() => {
    if (!isLoading && !isError) dispatch(addedManyProperties(response.data));
  });

  const swrKey = `properties/post/${postData.uuid}`;
  const swrFetcher = () => getPostProperties(postData.uuid);
  const { data: response, isLoading } = useSWR(swrKey, swrFetcher);
  const isError = response && response.error;

  return (
    <Box className={className}>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        ""
      ) : (
        <ListItems
          data={puuids}
          itemKey="puuid"
          component={Property}
          includeDivider={false}
          className="space-y-4"
        />
      )}
    </Box>
  );
}
