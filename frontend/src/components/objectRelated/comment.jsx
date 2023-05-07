import * as React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";
import { numberFormat, stringFormat } from "src/_helpers";
import ArrowTooltip from "src/components/arrowTooltip";
import urls from "src/general/urls";

const urlMap = {
  list: urls.list,
  post: urls.post,
};

export default function Comment({ data, className, iconOnClick }) {
  const router = useRouter();

  if (iconOnClick === undefined)
    iconOnClick = () => {
      if (Object.keys(urlMap).includes(data.type)) {
        const pageUrl = stringFormat(urlMap[data.type], data.uuid) + '?reply=1';
        router.push(pageUrl);
      }
    };

  return (
    <Box className={className + " space-x-1"}>
      <ArrowTooltip title="Comment">
        <ModeCommentRoundedIcon
          onClick={iconOnClick}
          className="text-xl cursor-pointer hover:fill-greyZ"
        />
      </ArrowTooltip>
      <Typography
        variant="caption"
        color="text.secondary"
        children={numberFormat(data.comments_count)}
      />
    </Box>
  );
}
