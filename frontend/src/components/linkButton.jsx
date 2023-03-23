import React from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import { stringFormat } from "src/_helpers";

export default function LinkButton({ href, name, className, textInput }) {
  href = href.includes("{0}")
    ? textInput
      ? stringFormat(href, textInput)
      : "404"
    : href;
  return (
    <Link href={href} className={className} prefetch={false}>
      <Button
        className=" px-4 font-black shadow-orange-500 rounded-full"
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
