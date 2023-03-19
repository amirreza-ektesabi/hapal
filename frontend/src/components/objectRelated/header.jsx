import * as React from "react";
import Box from "@mui/material/Box";
import FollowButton from "src/components/objectRelated/followButton";
import EditProfileButton from "src/components/objectRelated/editProfileButton";
import HeaderIcons from "src/components/objectRelated/headerIcons";
import HeaderImage from "src/components/objectRelated/headerImage";
import ProfileAvatar from "src/components/objectRelated/profileAvatar";
import { useSelector } from "react-redux";
import { authSelectors } from "src/_store";

function BottomEdge({
  data,
  className,
  openLoginBox,
  includeProfileAvatar = false,
  includeFollowButton = false,
  includeEditProfileButton = false,
  forEdit = false,
}) {
  return (
    <Box
      className={
        "absolute flex w-full items-center px-4" +
        (includeProfileAvatar ? " -bottom-10" : " -bottom-5")
      }
    >
      {includeProfileAvatar && <ProfileAvatar data={data} forEdit={forEdit} />}
      {includeFollowButton && (
        <FollowButton
          data={data}
          openLoginBox={openLoginBox}
          className="ml-auto"
        />
      )}
      {includeEditProfileButton && (
        <EditProfileButton
          data={data}
          openLoginBox={openLoginBox}
          className="ml-auto"
        />
      )}
    </Box>
  );
}

export function HeaderEdit({
  data,
  className,
  colorDecider,
  includeProfileAvatar = false,
}) {
  return (
    <Box className="relative">
      <HeaderImage data={data} colorDecider={colorDecider} forEdit={true} />
      <BottomEdge
        data={data}
        includeProfileAvatar={includeProfileAvatar}
        forEdit={true}
      />
    </Box>
  );
}

export default function Header({
  data,
  className,
  colorDecider,
  openLoginBox,
  includeMoreIcon = false,
  includeProfileAvatar = false,
}) {
  const currentUser = useSelector(authSelectors.selectMe);
  const includeEditProfileButton =
    data.type == "account" && currentUser?.username == data.username;
  const includeFollowButton = !includeEditProfileButton;

  return (
    <Box className="relative">
      <HeaderImage data={data} colorDecider={colorDecider} />
      <HeaderIcons
        data={data}
        includeMoreIcon={includeMoreIcon}
        className="absolute top-4 space-x-3 px-4"
      />
      <BottomEdge
        data={data}
        openLoginBox={openLoginBox}
        includeProfileAvatar={includeProfileAvatar}
        includeFollowButton={includeFollowButton}
        includeEditProfileButton={includeEditProfileButton}
      />
    </Box>
  );
}
