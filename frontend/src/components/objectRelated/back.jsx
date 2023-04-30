import * as React from "react";
import { useRouter } from "next/router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CircleIcon from "src/components/circleIcon";
import ArrowTooltip from "src/components/arrowTooltip";

export default function Back({ className }) {
  const router = useRouter();

  const handleOnClick = () => {
    router.back();
  };

  return (
    <ArrowTooltip title="Back">
      <span style={{ display: "inline-block" }} className={className}>
        <CircleIcon onClick={handleOnClick}>
          <ArrowBackRoundedIcon color="white" />
        </CircleIcon>
      </span>
    </ArrowTooltip>
  );
}
