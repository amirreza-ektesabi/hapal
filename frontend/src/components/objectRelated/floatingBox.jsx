import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Favorite from "src/components/objectRelated/favorite";
import Comment from "src/components/objectRelated/comment";

export default function FloatingButton({ data, className, toggleDrawer }) {
  return (
    <Box
      className="fixed bottom-4 h-8 rounded-full bg-blackZ shadow-black shadow-sm flex place-items-center px-4"
    >
      <Favorite data={data} />
      <Divider
        flexItem
        orientation="vertical"
        variant="middle"
        className="mx-3"
      />
      <Comment data={data} iconOnClick={toggleDrawer(true)} />
    </Box>
  );
}
