import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import Favorite from "../objectRelated/favorite";
import Comment from "../objectRelated/comment";

function Share({ data, className }) {
  return (
    <ShareRoundedIcon fontSize="small" className={className + " fill-greyZ"} />
  );
}

export default function CardIcons({ data, uuid, className }) {
  return (
    <Box className={className}>
      <Grid container className="px-2">
        <Grid container className="flex items-center w-full">
          <Grid container>
            <Favorite data={data} />
            <Comment data={data} className="ml-9" />
          </Grid>
          <Share data={data} className="ml-auto mr-0" />
        </Grid>
      </Grid>
    </Box>
  );
}
