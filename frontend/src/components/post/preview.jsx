import * as React from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import CardIcons from "../cardRelated/icons";
import CardTop from "../cardRelated/top";
import stringToColor from "../../general/stringToColor";
import { selectPostByUuid } from "../../general/reducers/posts";

function MediaPart({ data, className }) {
  return (
    <Skeleton
      variant="rectangular"
      animation={false}
      sx={{ bgcolor: stringToColor(data.title) }}
      className={className}
    />
  );
}

function ContentPart({ data, className }) {
  return (
    <Typography
      variant="h6"
      className={className + " font-medium whitespace-pre"}
      children={data.title}
    />
  );
}

export default function PostPreview({ uuid, className }) {
  const data = useSelector((state) => selectPostByUuid(state, uuid));
  return (
    <Box className={className}>
      <CardTop data={data} className="mb-2" />
      <Card className="h-28 rounded-2xl">
        <CardActionArea className="flex">
          <Box className="flex grid-cols-2 w-full h-full">
            <MediaPart data={data} className="h-28 w-28" />
            <ContentPart data={data} className="ml-4 mt-2.5 truncate" />
          </Box>
        </CardActionArea>
      </Card>
      <CardIcons data={data} uuid={uuid} className="mt-1.5" />
    </Box>
  );
}
