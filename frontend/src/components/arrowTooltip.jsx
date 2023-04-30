import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const ArrowTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.whiteZ,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.whiteZ,
    color: theme.palette.blackZ,
  },
}));

export default ArrowTooltip;
