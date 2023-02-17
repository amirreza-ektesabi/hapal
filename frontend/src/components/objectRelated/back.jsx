import * as React from "react";
import { useRouter } from "next/router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CircleIcon from "src/components/circleIcon";

export default function Back({ className }) {
  const router = useRouter();
  
  const handleOnClick = () => {
    router.back();
  };

  return (
    <CircleIcon className={className} onClick={handleOnClick}>
      <ArrowBackRoundedIcon color="white" />
    </CircleIcon>
  );
}
