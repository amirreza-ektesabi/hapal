import * as React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SaveButton from "src/components/objectRelated/saveButton";
import { HeaderEdit as Header } from "src/components/objectRelated/header";
import { stringFormat } from "src/_helpers";
import urls from "src/general/urls";

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
        inputProps={{ maxLength: 255 }}
        variant="standard"
        className="w-full"
      />
      <TextField
        multiline
        label="Description"
        value={data.description}
        onChange={setDescription}
        inputProps={{ maxLength: 500 }}
        variant="standard"
        className="w-full"
      />
    </Box>
  );
}

export default function SetListPage({ data, handleOnSave, className }) {
  const router = useRouter();
  const initialData = {
    title: data.title,
    description: data.description,
  };
  const [formData, setFormData] = React.useState(initialData);

  React.useEffect(() => {
    setFormData(data);
  }, [data]);

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
  const handleOnClickSaveButton = async () => {
    const dataToSave = {
      title: formData.title,
      description: formData.description,
    };
    const response = await handleOnSave(dataToSave);
    const uuid = response.payload.uuid;
    const redirectUrl = stringFormat(urls.list, uuid);
    router.push(redirectUrl);
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
        <SaveButton
          isEnable={true}
          className="px-4"
          handleOnClick={handleOnClickSaveButton}
        />
      </Box>
    </Box>
  );
}
