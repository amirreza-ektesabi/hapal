import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { HeaderEdit as Header } from "src/components/objectRelated/header";
import SaveButton from "src/components/objectRelated/saveButton";
import { authSelectors } from "src/_store";
import withAuth from "src/components/auth/withAuth";

function Top({ data, className }) {
  return (
    <Box className={className}>
      <Box className="max-w-lg w-full">
        <Header
          data={data}
          colorDecider={data.name + data.username}
          includeProfileAvatar={true}
        />
      </Box>
    </Box>
  );
}

function InputFields({ data, className }) {
  return (
    <Box className={className}>
      <TextField
        label="Name"
        defaultValue={data.name}
        variant="standard"
        className="w-full"
      />
      <TextField
        label="Username"
        defaultValue={data.username}
        variant="standard"
        className="w-full"
      />
      <TextField
        multiline
        label="Bio"
        defaultValue={data.bio}
        variant="standard"
        className="w-full"
      />
    </Box>
  );
}

export default withAuth(function EditProfilePage({ className }) {
  const currentUser = useSelector(authSelectors.selectMe);
  const data = currentUser;

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full space-y-16">
        <Top data={data} className="flex justify-center place-items-center" />
        <Box className="space-y-10">
          <InputFields data={data} className="px-4 space-y-10" />
          <SaveButton isEnable={true} />
        </Box>
      </Box>
    </Box>
  );
});
