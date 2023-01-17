import * as React from "react";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardIcons from "../cardRelated/icons";
import CardTop from "../cardRelated/top";
import { selectCommentByUuid } from "../../general/reducers/comments";


export default function CommentPreview({ uuid, className }) {
  const data = useSelector((state) => selectCommentByUuid(state, uuid));
  return (
    <Box className={className}>
      <CardTop data={data} className="mb-2" />
      <Box>
        <Typography
          variant="body2"
          className="truncate whitespace-pre-wrap"
          children={data.body}
        />
      </Box>
      <CardIcons data={data} className="mt-1" />
    </Box>
  );
}
