import * as React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import { authSelectors, authActions } from "src/_store";

export default function LogoutButton({ className }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.selectUser);

  const handleOnClick = () => {
    dispatch(authActions.logout());
    router.reload();
  };

  return (
    <React.StrictMode>
      {authUser && (
        <Button
          variant="contained"
          style={{
            background: "white",
            color: theme.palette.blackZ,
          }}
          className={className + " px-4 font-black"}
          onClick={handleOnClick}
          children="Log out"
        />
      )}
    </React.StrictMode>
  );
}
