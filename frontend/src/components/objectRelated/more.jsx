import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CircleIcon from "src/components/circleIcon";
import AddPostItem, {
  addPostItemConditions,
} from "src/components/objectRelated/moreMenuItems/addPost";
import EditItem, {
  editItemConditions,
} from "src/components/objectRelated/moreMenuItems/edit";
import DeleteItem, {
  deleteItemConditions,
} from "src/components/objectRelated/moreMenuItems/delete";
import UserFollowItem, {
  userFollowItemConditions,
} from "src/components/objectRelated/moreMenuItems/userFollow";
import LoginItem, {
  loginConditions,
} from "src/components/objectRelated/moreMenuItems/login";
import LogoutItem, {
  logoutConditions,
} from "src/components/objectRelated/moreMenuItems/logout";

const items = [
  {
    component: AddPostItem,
    conditions: addPostItemConditions,
  },
  {
    component: EditItem,
    conditions: editItemConditions,
  },
  {
    component: DeleteItem,
    conditions: deleteItemConditions,
  },
  {
    component: UserFollowItem,
    conditions: userFollowItemConditions,
  },
  {
    component: LoginItem,
    conditions: loginConditions,
  },
  {
    component: LogoutItem,
    conditions: logoutConditions,
  },
];

function MoreMenu({ data, placement, menuIsOpen, anchorEl, handleClose }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={menuIsOpen}
      onClose={handleClose}
      disableScrollLock={true}
      id="__next"
    >
      {items
        .filter((item) => item.conditions(data))
        .map((item, index) => (
          <item.component
            data={data}
            placement={placement}
            handleMenuClose={handleClose}
            key={index}
          />
        ))}
    </Menu>
  );
}

function MoreIcon({ data, className, button, handleClick }) {
  return (
    <React.StrictMode>
      {button ? (
        <CircleIcon onClick={handleClick} className={className}>
          <MoreVertRoundedIcon color="white" />
        </CircleIcon>
      ) : (
        <MoreVertRoundedIcon
          className={className + " text-xl cursor-pointer hover:fill-greyZ"}
          onClick={handleClick}
        />
      )}
    </React.StrictMode>
  );
}

export default function More({ data, button = false, className }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <MoreIcon
        className={className}
        button={button}
        handleClick={handleClick}
      />
      <MoreMenu
        data={data}
        placement={button ? "header" : "card"}
        menuIsOpen={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </Box>
  );
}
