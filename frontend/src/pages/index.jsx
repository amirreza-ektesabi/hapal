import * as React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Navbar from "src/components/navbar";
import AuthContext from "src/components/auth/authContext";
import urls from "src/general/urls";

function BoxItemIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 125"
      width="40"
      className={className + " fill-blueZ"}
    >
      <path d="M93.43,43.5C76.31,36.87,62.77,26.1,57.25,7.88,55.32,1.53,46.2.14,43.72,6.5,37.09,23.62,26.32,37.15,8.09,42.67c-6.35,1.94-7.73,11-1.38,13.54C23,62.56,37.64,72.78,41.92,90.45c1.92,4.63,5,6.87,8.15,6.87,4.14-.24,7.18-3.83,8.29-7.7,4.69-16.84,17.67-27.06,34-32.31C98.4,55.1,99.78,46,93.43,43.5Z" />
    </svg>
  );
}

function BoxItem({ children }) {
  return (
    <Box className="flex flex-col bg-blackZ border-[1px] border-blueZ rounded-3xl max-w-[16rem] w-full aspect-square p-4">
      <Box className="mx-auto mt-2">
        <BoxItemIcon />
      </Box>
      <Typography
        fontFamily="Nunito"
        className="text-whiteZ text-2xl my-auto"
        align="center"
      >
        {children}
      </Typography>
    </Box>
  );
}

export default function MainPage() {
  const router = useRouter();
  const { isAuthenticated, openSignupBox } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (isAuthenticated) router.replace(urls.profile);
  }, []);

  if (isAuthenticated) return "";

  return (
    <React.StrictMode>
      <Navbar />
      <Box className="flex bg-blueZ py-10 mb-4 lg:mb-0 lg:py-0 lg:h-[max(calc(100vh-80px),500px)] mx-[10px] rounded-[32px] justify-center">
        <Box className="flex w-full mx-4 min-[400px]:max-w-[20rem] md:max-w-[28rem] lg:max-w-[44rem] 2xl:max-w-[58rem] items-center flex-col lg:flex-row space-y-5 lg:space-y-0">
          <Box className="space-y-4">
            <Typography
              fontFamily="Changa_One"
              className="text-blackZ text-3xl md:text-4xl lg:text-5xl"
              children="Make list of anything."
            />
            <Typography
              fontFamily="Nunito"
              className="text-blackZ font-medium leading-5 md:leading-7 lg:leading-7 text-lg md:text-xl lg:text-2xl"
            >
              Discover what lists your friends make,
              <br className="max-[400px]:hidden" /> and share yours.
            </Typography>
            <Button
              variant="contained"
              className="rounded-full bg-blackZ text-blueZ font-medium text-sm max-[470px]:text-base md:text-lg lg:text-xl px-4 md:px-6"
              children="Sign up - it’s free!"
              onClick={openSignupBox}
            />
          </Box>
          <Box className="grow min-w-[1rem]" />
          <Box
            component="img"
            src="/landingImg.webp"
            className="rounded-md w-full md:max-w-[24rem]"
          />
        </Box>
      </Box>
      <Box className="flex w-full my-20 mx-auto">
        <Box className="flex flex-col 2xl:flex-row mx-auto space-y-8 2xl:space-y-0 space-x-0 2xl:space-x-8">
          <BoxItem>
            You can create a list with any topic and add the items you want,
            which are called posts.
          </BoxItem>
          <BoxItem>
            You can specify the details of your post using properties and pairs.
          </BoxItem>
          <BoxItem>
            You can follow the lists you like to be notified of their new posts.
          </BoxItem>
        </Box>
      </Box>
    </React.StrictMode>
  );
}
