import * as React from "react";
import Box from "@mui/material/Box";
import User from "src/components/objectRelated/user";
import Date from "src/components/cardRelated/date";
import More from "src/components/objectRelated/more";

export default function CardTop({ data, className }) {
  return (
    <Box className={className + " flex w-full"}>
      <Box className="flex space-x-2">
        <User data={data.user} />
        <Date data={data.created} className="mt-2.5" />
      </Box>
      <Box className="ml-auto mr-2 mt-2">
        <More data={data} />
      </Box>
    </Box>
  );
}
