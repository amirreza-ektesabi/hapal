import React from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import theme from "src/general/theme";

export default function LinkButton({ href, name, className }) {
  return (
    <Link href={href} className={className}>
      <Button
        className="px-4 font-black shadow-orange-500"
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
