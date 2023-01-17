import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItems from "../listItems";
import { selectPropertyByPuuid } from "../../general/reducers/properties";

function Pair({ data, className }) {
  return (
    <Box className={className}>
      <Typography
        variant="body2"
        className="font-normal whitespace-pre-wrap"
        color="text.secondary"
        children={data.key}
      />
      <Typography
        variant="body1"
        className="font-normal whitespace-pre-wrap"
        children={data.value}
      />
    </Box>
  );
}

export default function Property({ uuid: ppuid, className }) {
  const data = useSelector((state) => selectPropertyByPuuid(state, ppuid));
  return (
    <Box className={className}>
      <Typography
        variant="body1"
        fontSize={23}
        className="font-bold whitespace-pre"
        children={data.key}
      />
      <ListItems
        data={data.pairs}
        itemKey="data"
        component={Pair}
        includeDivider={false}
        className="space-y-1.5"
      />
    </Box>
  );
}
