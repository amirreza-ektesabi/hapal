import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { HeaderEdit as Header } from "src/components/objectRelated/header";
import SaveButton from "src/components/objectRelated/saveButton";

function Top({ data, className }) {
  return (
    <Box className={className}>
      <Box className="max-w-lg w-full">
        <Header data={data} colorDecider={data.title} />
      </Box>
    </Box>
  );
}

function InputFields({ data, className }) {
  return (
    <Box className={className}>
      <TextField
        label="Title"
        defaultValue={data.title}
        variant="standard"
        className="w-full"
      />
      <TextField
        multiline
        label="Description"
        defaultValue={data.description}
        variant="standard"
        className="w-full"
      />
    </Box>
  );
}

export default function SetListPage({ data, className }) {
  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full space-y-16">
        <Top data={data} className="flex justify-center place-items-center" />
        <InputFields data={data} className="px-4 space-y-10" />
        <SaveButton isEnable={true} className="px-4" />
      </Box>
    </Box>
  );
}
