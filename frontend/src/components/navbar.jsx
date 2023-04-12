import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AuthContext from "src/components/auth/authContext";
import urls from "src/general/urls";

function Logo({ ...props }) {
  return (
    <Box className="flex">
      <svg viewBox="0 0 444 444" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M 277.5,51.5 C 315.168,51.3333 352.835,51.5 390.5,52C 395,53.8333 398.167,57 400,61.5C 400.667,168.833 400.667,276.167 400,383.5C 398.098,388.4 394.598,391.567 389.5,393C 351.833,393.667 314.167,393.667 276.5,393C 272,391.167 268.833,388 267,383.5C 266.5,319.501 266.333,255.501 266.5,191.5C 247.83,191.667 229.164,191.5 210.5,191C 201.17,185.718 199.004,178.218 204,168.5C 205.731,166.383 207.898,164.883 210.5,164C 235.167,163.333 259.833,163.333 284.5,164C 288.667,165.5 291.5,168.333 293,172.5C 293.5,236.832 293.667,301.166 293.5,365.5C 319.833,365.5 346.167,365.5 372.5,365.5C 372.5,270.167 372.5,174.833 372.5,79.5C 346.5,79.5 320.5,79.5 294.5,79.5C 294.667,96.8365 294.5,114.17 294,131.5C 290.219,139.305 284.053,142.138 275.5,140C 271.333,138.5 268.5,135.667 267,131.5C 266.333,108.5 266.333,85.5 267,62.5C 269.357,57.6455 272.857,53.9788 277.5,51.5 Z M 53.5,53.5 C 91.8348,53.3333 130.168,53.5 168.5,54C 172.667,55.5 175.5,58.3333 177,62.5C 177.5,124.832 177.667,187.166 177.5,249.5C 196.17,249.333 214.836,249.5 233.5,250C 242.83,255.282 244.996,262.782 240,272.5C 238.269,274.617 236.102,276.117 233.5,277C 209.167,277.667 184.833,277.667 160.5,277C 156,275.167 152.833,272 151,267.5C 150.5,205.501 150.333,143.501 150.5,81.5C 124.167,81.5 97.8333,81.5 71.5,81.5C 71.5,175.5 71.5,269.5 71.5,363.5C 97.5,363.5 123.5,363.5 149.5,363.5C 149.333,345.83 149.5,328.164 150,310.5C 155.282,301.17 162.782,299.004 172.5,304C 174.617,305.731 176.117,307.898 177,310.5C 177.667,334.5 177.667,358.5 177,382.5C 175.5,386.667 172.667,389.5 168.5,391C 130.167,391.667 91.8333,391.667 53.5,391C 49.3333,389.5 46.5,386.667 45,382.5C 44.3333,275.833 44.3333,169.167 45,62.5C 46.6878,58.3148 49.5212,55.3148 53.5,53.5 Z" />
      </svg>
    </Box>
  );
}

export default function Navbar() {
  const { openSignupBox } = React.useContext(AuthContext);

  return (
    <Toolbar className="justify-center h-[70px] bg-blackZ">
      <Box className="flex w-full max-w-[15rem] min-[470px]:max-w-[20rem] md:max-w-[28rem] lg:max-w-[40rem] 2xl:max-w-[52rem] place-items-center px-1">
        <Box className="flex align-bottom md:mt-[8px] space-x-[6px]">
          <Link href={urls.home}>
            <Logo width="46" className="fill-blueZ" />
          </Link>
          <Typography
            fontFamily="George"
            className="text-[0px] md:text-[33px] text-whiteZ mt-[2px]"
            children="Hapal"
          />
        </Box>
        <Box className="grow" />
        <Box className="flex space-x-2">
          <Button
            variant="contained"
            className="rounded-full bg-blueZ font-medium text-sm"
            children="Sign up"
            onClick={openSignupBox}
          />
          <Link href={urls.explore}>
            <Button
              variant="contained"
              className="mr-0 bg-whiteZ rounded-full text-blackZ font-medium text-sm"
              children="Explore"
            />
          </Link>
        </Box>
      </Box>
    </Toolbar>
  );
}
