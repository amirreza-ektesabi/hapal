import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import FollowButton from "./followButton";
import stringToColor from "../../general/stringToColor";
import More from "./more";

function Icons({ data, className }) {
  const isProfile = data.type == "account";
  const buttonClassNames = "absolute top-4 bg-blackZ/[.7] hover:bg-blackZ/[.7]";
  return (
    <Grid>
      <IconButton className={buttonClassNames + " left-4"}>
        <ArrowBackRoundedIcon color="white" />
      </IconButton>
      <IconButton
        className={buttonClassNames + (isProfile ? " right-4" : " right-16")}
      >
        <ShareRoundedIcon color="white" className="pr-0.5" />
      </IconButton>
      {!isProfile && (
        <More
          data={data}
          button={true}
          className={buttonClassNames + " right-4"}
        />
      )}
    </Grid>
  );
}

export default function Header({ data, className, colorDecider, avatar }) {
  return (
    <Grid container className="relative">
      <Box
        component={data.header && "img"}
        sx={{ bgcolor: stringToColor(colorDecider) }}
        className="w-full h-64 object-cover"
        src={data.header}
      />
      <Icons data={data} />
      <Grid container className="w-full flex items-center">
        {avatar}
        <FollowButton data={data} className="absolute right-4" />
      </Grid>
    </Grid>
  );
}
