import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import CircleIcon from "src/components/circleIcon";
import More from "src/components/objectRelated/more";
import Back from "src/components/objectRelated/back";

function Share({ className }) {
  return (
    <CircleIcon className={className}>
      <ShareRoundedIcon color="white" className="pr-0.5" />
    </CircleIcon>
  );
}

export default function HeaderIcons({ data, className, includeMoreIcon }) {
  return (
    <Grid className={className + " flex w-full"}>
      <Back className="mr-auto" />
      <Share className="ml-auto" />
      {includeMoreIcon && <More button data={data} className="ml-auto" />}
    </Grid>
  );
}
