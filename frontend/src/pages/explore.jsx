import * as React from "react";
import Box from "@mui/material/Box";
import { pageTitle } from "src/_helpers";

export default function ExplorePage() {
  React.useEffect(() => {
    document.title = pageTitle("Explore");
  }, []);

  return <Box />;
}
