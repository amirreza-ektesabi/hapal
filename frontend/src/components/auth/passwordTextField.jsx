import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

function VisibilityIcon({ showPassword, ...props }) {
  return showPassword ? (
    <VisibilityOffRoundedIcon {...props} titleAccess="Hide password" />
  ) : (
    <VisibilityRoundedIcon {...props} titleAccess="Show password" />
  );
}

export default function PasswordTextField({
  className,
  setFieldText,
  confirm = false,
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <TextField
      label={!confirm ? "Password" : "Confirm Password"}
      variant="outlined"
      onChange={setFieldText}
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
    />
  );
}
