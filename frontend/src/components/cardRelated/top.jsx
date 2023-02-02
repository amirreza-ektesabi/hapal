import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import User from "src/components/objectRelated/user";
import Date from "./date";
import More from "src/components/objectRelated/more";

export default function CardTop({ data, className }) {
  return (
    <Box className={className}>
      <Grid container>
        <Grid container className="flex w-full">
          <Grid container className="flex space-x-2">
            <User data={data.user} />
            <Date data={data.created} className="mt-2.5" />
          </Grid>
          <Grid className="ml-auto mr-2 mt-2">
            <More data={data} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
