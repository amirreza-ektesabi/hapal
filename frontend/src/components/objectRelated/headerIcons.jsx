import * as React from "react";
import Box from "@mui/material/Box";
import More from "src/components/objectRelated/more";
import Back from "src/components/objectRelated/back";
import Share from "src/components/objectRelated/share";

export default function HeaderIcons({ data, className, includeMoreIcon }) {
  return (
    <Box className={className + " flex w-full"}>
      <Back className="mr-auto" />
      <Share button data={data} className="ml-auto" />
      {includeMoreIcon && <More button data={data} className="ml-auto" />}
    </Box>
  );
}
