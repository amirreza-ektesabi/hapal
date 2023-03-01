import * as React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

function Item({
  data,
  isLast,
  itemKey,
  component: ItemComponent,
  includeDivider = true,
  itemComponentClassName,
  ...props
}) {
  return (
    <Box className="w-full">
      <ItemComponent
        {...{ [itemKey]: data }}
        className={itemComponentClassName}
        {...props}
      />
      {includeDivider && !isLast && <Divider className="w-full my-3" />}
    </Box>
  );
}

export default function ListItems({
  data,
  className,
  randomKey = false,
  ...props
}) {
  return (
    <List className={className + " flex flex-col place-items-center w-full"}>
      {data.map((item, index) => (
        <Item
          data={item}
          isLast={index === data.length - 1}
          key={randomKey ? Math.random() + index : index}
          {...props}
        />
      ))}
    </List>
  );
}
