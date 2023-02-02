import * as React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

export default function ListItems({
  data,
  itemKey,
  className,
  component: ItemComponent,
  includeDivider = true,
  itemComponentClassName,
  ...props
}) {
  return (
    <List className={className + " flex flex-col place-items-center w-full"}>
      {data.map((item, index) => (
        <Box className="w-full" key={index}>
          <ItemComponent
            {...{ [itemKey]: item }}
            className={itemComponentClassName}
            {...props}
          />
          {includeDivider && index != data.length - 1 && (
            <Divider className="w-full my-3" />
          )}
        </Box>
      ))}
    </List>
  );
}
