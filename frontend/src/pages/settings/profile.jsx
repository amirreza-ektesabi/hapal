import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import { HeaderEdit as Header } from "src/components/objectRelated/header";
import SaveButton from "src/components/objectRelated/saveButton";

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
    <Grid className={className}>
      <TextField label="Name" defaultValue={data.name} variant="standard" className="w-full" />
      <TextField label="Username" defaultValue={data.username} variant="standard" className="w-full" />
      <TextField multiline label="Bio" defaultValue={data.bio} variant="standard" className="w-full" />
    </Grid>
  );
}

export default function EditProfilePage({ className }) {
  const data = useSelector((state) => state.profile);

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full space-y-16">
        <Top data={data} className="flex justify-center place-items-center" />
        <Grid className="space-y-10">
          <InputFields data={data} className="px-4 space-y-10" />
          <SaveButton isEnable={true} />
        </Grid>
      </Box>
    </Box>
  );
}
