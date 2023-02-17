import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import LinkButton from "src/components/linkButton";
import urls from "src/general/urls";

function BoxOfLinks({ data, className = "space-x-3", textInput }) {
  return (
    <List className={className}>
      {data.map((item, index) => (
        <LinkButton
          href={item.href}
          textInput={textInput}
          name={item.name}
          key={index}
        />
      ))}
    </List>
  );
}

export default function TemporaryHomePage() {
  const [textInput, setTextInput] = React.useState("");
  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  return (
    <Box className="relative">
      <Box
        component="img"
        src="/sample_data/images/Space.jpg"
        className="w-screen h-screen object-cover"
      />
      <Box className="absolute top-44 flex w-full">
        <Box
          component="img"
          src="/sample_data/images/Ghosts.jpg"
          className="mx-auto w-96 h-96"
        />
        <Box className="absolute left-4 grid space-y-3">
          <List>
            {rows.map((item, index) => (
              <BoxOfLinks data={item} key={index} textInput={textInput} />
            ))}
          </List>
          <TextField
            variant="outlined"
            className="bg-blackZ w-80"
            value={textInput}
            onChange={handleTextInputChange}
          />
        </Box>
      </Box>
    </Box>
  );
}

const rows = [
  [{ href: urls.home, name: "Home" }],
  [
    { href: urls.user, name: "Profile" },
    { href: urls.profileEdit, name: "Edit Profile" },
  ],
  [
    { href: urls.list, name: "List" },
    { href: urls.listNew, name: "New List" },
    { href: urls.listEdit, name: "Edit List" },
  ],
  [
    { href: urls.post, name: "Post" },
    { href: urls.postNew, name: "New Post" },
    { href: urls.postEdit, name: "Edit Post" },
  ],
];
