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

function InputFields({ data, className, setTitle, setDescription }) {
  return (
    <Box className={className}>
      <TextField
        label="Title"
        value={data.title}
        onChange={setTitle}
        variant="standard"
        className="w-full"
      />
      <TextField
        multiline
        label="Description"
        value={data.description}
        onChange={setDescription}
        variant="standard"
        className="w-full"
      />
    </Box>
  );
}

export default function SetListPage({ data, className }) {
  const [formData, setFormData] = React.useState(data);

  const setTitle = (event) => {
    setFormData({
      ...formData,
      title: event.target.value,
    });
  };
  const setDescription = (event) => {
    setFormData({
      ...formData,
      description: event.target.value,
    });
  };

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full space-y-16">
        <Top
          data={formData}
          className="flex justify-center place-items-center"
        />
        <InputFields
          data={formData}
          className="px-4 space-y-10"
          setTitle={setTitle}
          setDescription={setDescription}
        />
        <SaveButton isEnable={true} className="px-4" />
      </Box>
    </Box>
  );
}
