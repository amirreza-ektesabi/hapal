import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CircleIcon from "src/components/circleIcon";
import UserFollowItem from "src/components/objectRelated/moreMenuItems/userFollow";
import EditItem, {
  editItemConditions,
} from "src/components/objectRelated/moreMenuItems/edit";
import DeleteItem from "src/components/objectRelated/moreMenuItems/delete";

function MoreMenu({ data, menuIsOpen, anchorEl, handleClose }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={menuIsOpen}
      onClose={handleClose}
      disableScrollLock={true}
      id="__next"
    >
      {editItemConditions(data) && (
        <EditItem data={data} handleMenuClose={handleClose} />
      )}
      <DeleteItem data={data} handleMenuClose={handleClose} />
      <UserFollowItem data={data} handleMenuClose={handleClose} />
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
        menuIsOpen={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </Box>
  );
}
