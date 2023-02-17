import React from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import stringFormat from "src/general/functions/stringFormat";

export default function LinkButton({ href, name, className, textInput }) {
  href = href.includes("{0}") ? stringFormat(href, textInput) : href;
  return (
    <Link href={href} className={className}>
      <Button
        className=" px-4 font-black shadow-orange-500"
        style={{
          background: "white",
          color: theme.palette.blackZ,
        }}
      >
        {name}
      </Button>
    </Link>
  );
}
