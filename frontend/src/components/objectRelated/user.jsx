import * as React from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import stringToColor from "src/general/functions/stringToColor";
import stringFormat from "src/general/functions/stringFormat";
import urls from "src/general/urls";

export default function User({
  data,
  className,
  includeUsername = false,
  wrap = false,
}) {
  const userHref = stringFormat(urls.user, data.username);

  let components = (
    <React.Fragment>
      <Link href={userHref} className="cursor-pointer">
        <Avatar
          src={data.avatar}
          sx={{ bgcolor: stringToColor(data.name) }}
          className="w-9 h-9"
          children={data.name[0]}
        />
      </Link>
      <Link href={userHref} className="max-w-[60%] cursor-pointer">
        <Typography
          variant="body1"
          className="mt-1.5 font-medium whitespace-pre truncate"
          children={data.name}
        />
      </Link>
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
    <Box className={className + " flex space-x-2"}>{components}</Box>
  ) : (
    components
  );
}
