import * as React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardIcons from "src/components/cardRelated/icons";
import CardTop from "src/components/cardRelated/top";
import { stringFormat, stringToColor } from "src/_helpers";
import { selectPostByUuid } from "src/general/reducers/posts";
import urls from "src/general/urls";

function Media({ data, className }) {
  return (
    <Box
      variant="rectangular"
      sx={{ bgcolor: stringToColor(data.title) }}
      className={className}
    />
  );
}

function Content({ data, className }) {
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
  const postHref = stringFormat(urls.post, data.uuid);

  return (
    <Box className={className}>
      <CardTop data={data} className="mb-2" />
      <Card className="h-28 rounded-2xl">
        <CardActionArea className="flex">
          <Link href={postHref} className="flex grid-cols-2 w-full h-full">
            <Media data={data} className="h-28 min-w-[7rem]" />
            <Content data={data} className="ml-4 mr-2 mt-2.5 truncate" />
          </Link>
        </CardActionArea>
      </Card>
      <CardIcons data={data} uuid={uuid} className="mt-1.5" />
    </Box>
  );
}
