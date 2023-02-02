import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import FollowButton from "./followButton";
import HeaderIcons from "./headerIcons";
import HeaderImage from "./headerImage";
import ProfileAvatar from "./profileAvatar";

function BottomEdge({
  data,
  className,
  includeProfileAvatar = false,
  includeFollowButton = false,
  forEdit = false,
}) {
  return (
    <Grid
      container
      className={
        "absolute flex w-full items-center px-4" +
        (includeProfileAvatar ? " -bottom-10" : " -bottom-5")
      }
    >
      {includeProfileAvatar && <ProfileAvatar data={data} forEdit={forEdit} />}
      {includeFollowButton && <FollowButton data={data} className="ml-auto" />}
    </Grid>
  );
}

export function HeaderEdit({
  data,
  className,
  colorDecider,
  includeProfileAvatar = false,
}) {
  return (
    <Grid container className="relative">
      <HeaderImage data={data} colorDecider={colorDecider} forEdit={true} />
      <BottomEdge
        data={data}
        includeProfileAvatar={includeProfileAvatar}
        forEdit={true}
      />
    </Grid>
  );
}

export default function Header({
  data,
  className,
  colorDecider,
  includeMoreIcon = false,
  includeProfileAvatar = false,
}) {
  return (
    <Grid container className="relative">
      <HeaderImage data={data} colorDecider={colorDecider} />
      <HeaderIcons
        data={data}
        includeMoreIcon={includeMoreIcon}
        className="absolute top-4 space-x-3 px-4"
      />
      <BottomEdge
        data={data}
        includeProfileAvatar={includeProfileAvatar}
        includeFollowButton={true}
      />
    </Grid>
  );
}
