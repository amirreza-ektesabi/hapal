import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import { logout, selectAuthUser } from "src/_store";

export default function LogoutButton({ className }) {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);

  const handleOnClick = () => {
    dispatch(logout());
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
