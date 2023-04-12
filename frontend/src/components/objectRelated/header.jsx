import * as React from "react";
import Box from "@mui/material/Box";
import FollowButton from "src/components/objectRelated/followButton";
import EditProfileButton from "src/components/objectRelated/editProfileButton";
import HeaderIcons from "src/components/objectRelated/headerIcons";
import HeaderImage from "src/components/objectRelated/headerImage";
import ProfileAvatar from "src/components/objectRelated/profileAvatar";
import AuthContext from "src/components/auth/authContext";

function BottomEdge({
  data,
  className,
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
      {includeFollowButton && <FollowButton data={data} className="ml-auto" />}
      {includeEditProfileButton && (
        <EditProfileButton data={data} className="ml-auto" />
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
    <Header
      data={data}
      colorDecider={colorDecider}
      includeShareIcon={false}
      includeFollowButton={false}
      includeProfileAvatar={includeProfileAvatar}
      className={className}
      forEdit={true}
    />
  );
}

export default function Header({
  data,
  className,
  colorDecider,
  includeMoreIcon = false,
  includeShareIcon = true,
  includeProfileAvatar = false,
  includeFollowButton = true,
  forEdit = false,
}) {
  const { isAuthenticated, currentUser } = React.useContext(AuthContext);
  const includeUserProfile =
    data.type === "account" &&
    isAuthenticated &&
    currentUser?.username == data?.username &&
    !forEdit;
  includeMoreIcon ||= includeUserProfile;
  includeFollowButton &&= !includeUserProfile;

  return (
    <Box className="relative">
      <HeaderImage data={data} colorDecider={colorDecider} forEdit={forEdit} />
      <HeaderIcons
        data={data}
        includeMoreIcon={includeMoreIcon}
        includeShareIcon={includeShareIcon}
        className="absolute top-4 space-x-3 px-4"
      />
      <BottomEdge
        data={data}
        includeProfileAvatar={includeProfileAvatar}
        includeFollowButton={includeFollowButton}
        includeEditProfileButton={includeUserProfile}
        forEdit={forEdit}
      />
    </Box>
  );
}
