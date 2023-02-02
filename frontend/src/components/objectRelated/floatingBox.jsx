import * as React from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Favorite from "./favorite";
import Comment from "./comment";

export default function FloatingButton({ data, className, toggleDrawer }) {
  return (
    <Grid
      container
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
    </Grid>
  );
}
