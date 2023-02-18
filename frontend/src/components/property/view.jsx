import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItems from "src/components/listItems";
import { selectPropertyByPuuid } from "src/_store";
import Pair from "src/components/pair/view";

function Key({ data }) {
  return (
    <Box className="flex items-center space-x-1">
      <Typography
        variant="body1"
        className="text-xl font-bold whitespace-pre"
        children={data.key}
      />
    </Box>
  );
}

function Value({ data, className }) {
  return (
    <ListItems
      data={data.pairs}
      itemKey="data"
      component={Pair}
      includeDivider={false}
      className="space-y-1.5"
    />
  );
}

export default function Property({ puuid, className }) {
  const data = useSelector((state) => selectPropertyByPuuid(state, puuid));

  return (
    <Box className={className}>
      <Key data={data} />
      <Value data={data} />
    </Box>
  );
}
