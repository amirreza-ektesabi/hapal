import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SaveButton from "src/components/objectRelated/saveButton";
import HeaderImage from "src/components/objectRelated/headerImage";
import { PropertyEditList } from "src/components/post/propertyList";

function Top({ data, className }) {
  return (
    <HeaderImage
      data={data}
      colorDecider={data.title}
      height="20"
      className={className}
    />
  );
}

function InputFields({ data, className, property_puuids }) {
  return (
    <Box className={className}>
      <TextField
        label="Title"
        defaultValue={data.title}
        variant="standard"
        className="w-full"
      />
      <PropertyEditList data={data} puuids={property_puuids} />
    </Box>
  );
}

function AddPropertyButton({ className }) {
  return (
    <Button
      variant="contained"
      className="px-7 mr-auto rounded-full h-10 font-bold bg-blueZ"
      children="Add Property"
    />
  );
}

function Buttons({ data, className }) {
  return (
    <Box className={className + " flex"}>
      <AddPropertyButton />
      <SaveButton isEnable={true} />
    </Box>
  );
}

export default function SetPostPage({ data, property_puuids, className }) {
  return (
    <Box className="flex flex-col place-items-center mb-6">
      <Box className="max-w-lg w-full space-y-16">
        <Top data={data} />
        <InputFields
          data={data}
          property_puuids={property_puuids}
          className="px-4 space-y-16"
        />
        <Buttons data={data} className="px-4" />
      </Box>
    </Box>
  );
}
