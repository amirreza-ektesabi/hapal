import * as React from "react";
import Typography from "@mui/material/Typography";
import Linkify from "react-linkify";

export default function TypographyLinkify(props) {
  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => {
        return (
          <a
            key={key}
            href={decoratedHref}
            children={decoratedText}
            target="_blank"
            className="underline underline-offset-2 decoration-1 text-blueZ hover:text-blue-800 visited:text-purple-600"
          />
        );
      }}
    >
      <Typography {...props} />
    </Linkify>
  );
}
