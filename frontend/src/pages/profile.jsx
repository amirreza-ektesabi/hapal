import * as React from "react";
import Box from "@mui/material/Box";
import ProfilePage from "src/pages/[username]";
import AuthContext from "src/components/auth/authContext";
import Header from "src/components/objectRelated/header";

function NotAuthenticatedProfile() {
  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full">
        <Box className="flex justify-center place-items-center">
          <Box className="max-w-lg w-full">
            <Header
              data={{ type: "account", name: "" }}
              includeMoreIcon={true}
              includeShareIcon={false}
              includeFollowButton={false}
              includeProfileAvatar={true}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function ExplorePage() {
  const { isAuthenticated, currentUser, openLoginBox } =
    React.useContext(AuthContext);

  React.useEffect(() => {
    if (!isAuthenticated) openLoginBox();
  }, []);

  return isAuthenticated ? (
    <ProfilePage username={currentUser.username} />
  ) : (
    <NotAuthenticatedProfile />
  );
}
