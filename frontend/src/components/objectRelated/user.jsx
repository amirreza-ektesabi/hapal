import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import stringToColor from "../../general/stringToColor";

export default function User({
  data,
  className,
  includeUsername = false,
  wrap = false,
}) {
  let components = (
    <React.Fragment>
      <Avatar
        src={data.avatar}
        sx={{ bgcolor: stringToColor(data.name) }}
        className="w-9 h-9"
        children={data.name[0]}
      />
      <Typography
        variant="body1"
        className="mt-1.5 font-medium whitespace-pre max-w-[60%] truncate"
        children={data.name}
      />
      {includeUsername && (
        <Typography
          variant="body2"
          color="text.secondary"
          className="mt-2 font-normal max-w-[20%] truncate"
          children={"@" + data.username}
        />
      )}
    </React.Fragment>
  );

  return wrap ? (
    <Grid container className={className + " space-x-2"}>
      {components}
    </Grid>
  ) : (
    components
  );
}
