import * as React from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardIcons from "../cardRelated/icons";
import CardTop from "../cardRelated/top";
import stringToColor from "../../general/stringToColor";
import { selectListByUuid } from "../../general/reducers/lists";

function Media({ data, className }) {
  return data.header === null ? (
    <Box
      sx={{ bgcolor: stringToColor(data.title) }}
      className={className}
    />
  ) : (
    <CardMedia component="img" image={data.header} className={className} />
  );
}

function Content({ data, className }) {
  return (
    <Box className="absolute bottom-0 left-0 w-full p-2.5 bg-blackZ/[.45]">
      <Box className="ml-2">
        <Typography
          variant="h6"
          className="truncate font-bold whitespace-pre"
          children={data.title}
        />
        <Typography
          variant="body1"
          className="truncate whitespace-pre"
          children={data.description}
        />
      </Box>
    </Box>
  );
}

export default function ListPreview({ uuid, className }) {
  const data = useSelector((state) => selectListByUuid(state, uuid));

  return (
    <Box className={className}>
      <CardTop data={data} className="mb-2" />
      <Card className="h-64 rounded-2xl">
        <CardActionArea>
          <Box>
            <Media data={data} className="h-64 w-full" />
            <Content data={data} />
          </Box>
        </CardActionArea>
      </Card>
      <CardIcons data={data} className="mt-1" />
    </Box>
  );
}
