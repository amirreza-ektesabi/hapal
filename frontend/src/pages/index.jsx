import * as React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Navbar from "src/components/navbar";
import AuthContext from "src/components/auth/authContext";
import urls from "src/general/urls";

function BoxItemIcon({ ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" {...props}>
      <path d="M93.43,43.5C76.31,36.87,62.77,26.1,57.25,7.88,55.32,1.53,46.2.14,43.72,6.5,37.09,23.62,26.32,37.15,8.09,42.67c-6.35,1.94-7.73,11-1.38,13.54C23,62.56,37.64,72.78,41.92,90.45c1.92,4.63,5,6.87,8.15,6.87,4.14-.24,7.18-3.83,8.29-7.7,4.69-16.84,17.67-27.06,34-32.31C98.4,55.1,99.78,46,93.43,43.5Z" />
    </svg>
  );
}

function BoxItem({ children }) {
  return (
    <Box className="flex flex-col bg-blackZ border-[1px] border-blueZ rounded-3xl max-w-[21rem] laptop:max-w-full w-full aspect-square p-4 hover:bg-blueZ/[.1] hover:cursor-pointer">
      <Box className="mx-auto mt-8">
        <BoxItemIcon width="48" className="fill-blueZ" />
      </Box>
      <Typography
        fontFamily="Nunito"
        className="my-auto text-[1.65rem] text-whiteZ"
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
      <Box className="flex bg-blueZ py-10 mb-4 laptop:mb-0 laptop:py-0 laptop:h-[max(calc(100vh-80px),700px)] mx-[10px] rounded-[32px] justify-center">
        <Box className="flex w-full mx-4 max-w-[22rem] tablet:max-w-[44rem] laptop:max-w-[58rem] desktop:max-w-[70rem] items-center flex-col laptop:flex-row space-y-5 laptop:space-y-0">
          <Box className="space-y-4">
            <Typography
              fontFamily="Changa_One"
              className="text-blackZ text-4xl laptop:text-[2.7rem] desktop:text-6xl"
              children="Make list of anything."
            />
            <Typography
              fontFamily="Nunito"
              className="font-medium leading-5 text-blackZ tablet:leading-7 laptop:leading-7 text-[1.35rem] laptop:text-2xl desktop:text-3xl"
            >
              Discover what lists your friends make,
              <br className="hidden tablet:block" /> and share yours.
            </Typography>
            <Button
              variant="contained"
              className="rounded-full bg-blackZ text-blueZ font-medium text-lg laptop:text-2xl px-4 tablet:px-6"
              children="Sign up - it’s free!"
              onClick={openSignupBox}
            />
          </Box>
          <Box className="grow min-w-[1rem]" />
          <Box
            component="img"
            src="/landingImg.webp"
            className="rounded-md w-full tablet:max-w-[28rem]"
          />
        </Box>
      </Box>
      <Box className="flex w-full mx-auto mt-20 mb-20">
        <Box className="flex flex-col mx-auto space-x-0 space-y-8 laptop:flex-row laptop:space-y-0 laptop:space-x-8 laptop:max-w-[58rem] desktop:max-w-[70rem]">
          <BoxItem>
            You can create lists of any topic and add as many items as you want,
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
