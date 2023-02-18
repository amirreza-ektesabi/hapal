import * as React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

function Item({
  data,
  index,
  isLast,
  itemKey,
  component: ItemComponent,
  includeDivider = true,
  itemComponentClassName,
  randomKey = false,
  ...props
}) {
  return (
    <Box className="w-full" key={randomKey ? Math.random() + index : index}>
      <ItemComponent
        {...{ [itemKey]: data }}
        className={itemComponentClassName}
        {...props}
      />
      {includeDivider && !isLast && <Divider className="w-full my-3" />}
    </Box>
  );
}

export default function ListItems({ data, className, ...props }) {
  return (
    <List className={className + " flex flex-col place-items-center w-full"}>
      {data.map((item, index) => (
        <Item
          data={item}
          index={index}
          isLast={index === data.length - 1}
          {...props}
        />
      ))}
    </List>
  );
}
