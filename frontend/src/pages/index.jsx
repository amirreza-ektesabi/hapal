import * as React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navbar from "src/components/navbar";
import AuthContext from "src/components/auth/authContext";
import urls from "src/general/urls";

export default function MainPage() {
  const router = useRouter();
  const { isAuthenticated } = React.useContext(AuthContext);

  React.useEffect(() => {
    // if (isAuthenticated) router.replace(urls.profile);
  }, []);

  // if (isAuthenticated) return "";

  return (
    <React.StrictMode>
      <Navbar />
      <Box className="flex bg-blueZ h-[calc(100vh-80px)] mx-[10px] rounded-[32px] justify-center">
        <Box className="flex w-full max-w-[15rem] max-[470px]:max-w-[20rem] md:max-w-[28rem] lg:max-w-[40rem] 2xl:max-w-[52rem] mt-[27vh]">
          <Box className="space-y-4">
            <Typography
              fontFamily="Changa_One"
              className="text-blackZ text-[1.5rem] max-[470px]:text-3xl md:text-4xl lg:text-5xl"
              children="Make list of anything."
            />
            <Typography
              fontFamily="Nunito"
              className="text-blackZ font-medium leading-5 md:leading-7 lg:leading-7 text-sm max-[470px]:text-base md:text-xl lg:text-2xl"
            >
              Discover what lists your friends make,
              <br />
              and share yours.
            </Typography>
          </Box>
          <Box className="grow" />
        </Box>
      </Box>
    </React.StrictMode>
  );
}
