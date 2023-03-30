import * as React from "react";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AuthContext from "src/components/auth/authContext";
import { stringFormat } from "src/_helpers";
import urls from "src/general/urls";

export function addPostItemConditions(data) {
  const { currentUser } = React.useContext(AuthContext);

  return data.type === "list" && currentUser?.username == data.user.username;
}

export default function AddPostItem({ data, placement, handleMenuClose }) {
  const router = useRouter();

  const handleOnClick = (event) => {
    const newPostUrl = stringFormat(urls.postNew, data.uuid);
    router.push(newPostUrl);
    handleMenuClose();
  };

  return (
    <MenuItem onClick={handleOnClick} className="text-sm">
      <ListItemIcon>
        <PostAddRoundedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <Typography children="Add Post" />
      </ListItemText>
    </MenuItem>
  );
}
