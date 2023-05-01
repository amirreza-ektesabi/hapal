import * as React from "react";
import Button from "@mui/material/Button";

export default function DisposableButton({ onClick, disabled, ...props }) {
  const [isDisabled, setIsDisabled] = React.useState(false);

  const handleOnClick = async () => {
    if ((await onClick()) !== DisposableButtonFalied) setIsDisabled(true);
  };

  return (
    <Button
      onClick={handleOnClick}
      disabled={disabled || isDisabled}
      {...props}
    />
  );
}

export const DisposableButtonFalied = "DisposableButtonFalied";
