import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ArrowTooltip from "src/components/arrowTooltip";

function VisibilityIcon({ showPassword, ...props }) {
  return showPassword ? (
    <ArrowTooltip title="Hide password">
      <VisibilityOffRoundedIcon {...props} />
    </ArrowTooltip>
  ) : (
    <ArrowTooltip title="Reveal password">
      <VisibilityRoundedIcon {...props} />
    </ArrowTooltip>
  );
}

export default function PasswordTextField({
  className,
  confirm = false,
  ...props
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <TextField
      label={!confirm ? "Password" : "Confirm Password"}
      variant="outlined"
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <VisibilityIcon
              showPassword={showPassword}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              className="text-xl cursor-pointer hover:text-greyZ"
            />
          </InputAdornment>
        ),
      }}
      className={className + " w-full rounded-md"}
      {...props}
    />
  );
}
