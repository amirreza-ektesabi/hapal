import * as React from "react";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardIcons from "src/components/cardRelated/icons";
import CardTop from "src/components/cardRelated/top";
import { selectCommentByUuid } from "src/_store";


export default function CommentPreview({ uuid, className }) {
  const data = useSelector((state) => selectCommentByUuid(state, uuid));
  return (
    <Box className={className}>
      <CardTop data={data} className="mb-2" />
      <Box>
        <Typography
          variant="body2"
          className="whitespace-pre-wrap break-words"
          children={data.body}
        />
      </Box>
      <CardIcons data={data} className="mt-1" />
    </Box>
  );
}
