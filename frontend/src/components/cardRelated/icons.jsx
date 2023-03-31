import * as React from "react";
import Box from "@mui/material/Box";
import Favorite from "src/components/objectRelated/favorite";
import Comment from "src/components/objectRelated/comment";
import Share from "src/components/objectRelated/share";

export default function CardIcons({ data, className }) {
  return (
    <Box className={className + " flex items-center w-full px-2"}>
      <Box className="flex">
        <Favorite data={data} />
        <Comment data={data} className="ml-9" />
      </Box>
      {data.type !== "comment" && (
        <Share data={data} className="ml-auto mr-0" />
      )}
    </Box>
  );
}
