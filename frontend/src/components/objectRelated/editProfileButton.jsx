import * as React from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import urls from "src/general/urls";
import { stringFormat } from "src/_helpers";

export default function EditProfileButton({ data, className }) {
  const router = useRouter();

  const handleOnClick = () => {
    const profileEditUrl = stringFormat(urls.profileEdit, data.username);
    router.push(profileEditUrl);
  };

  return (
    <Button
      variant="outlined"
      className={className + " rounded-full w-28 h-10 border-1 font-bold"}
      sx={{
        color: "text.primary",
        borderColor: "greyZ",
        "&:hover": {
          borderColor: "greyZ",
        },
      }}
      style={{ background: theme.palette.blackZ }}
      children={"Edit Profile"}
      onClick={handleOnClick}
    />
  );
}
