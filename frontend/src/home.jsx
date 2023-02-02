import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import LinkButton from "src/components/linkButton";

function BoxOfLinks({ data, className = "space-x-3" }) {
  return (
    <List className={className}>
      {data.map((item, index) => (
        <LinkButton href={item.href} name={item.name} key={index} />
      ))}
    </List>
  );
}

export default function TemporaryHomePage() {
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
              <BoxOfLinks data={item} key={index} />
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
}

const rows = [
  [{ href: "/", name: "Home" }],
  [
    { href: "/amrez", name: "Profile" },
    { href: "/settings/profile", name: "Edit Profile" },
  ],
  [
    { href: "/list/1afe551d-c0db-4f74-bd2f-2d26367fa66b", name: "List" },
    { href: "/new-list", name: "New List" },
    {
      href: "/list/1afe551d-c0db-4f74-bd2f-2d26367fa66b/edit",
      name: "Edit List",
    },
  ],
  [
    { href: "/post/05fea12f-de64-4e32-ae36-68ad8e9dbf7e", name: "Post" },
    {
      href: "/list/1afe551d-c0db-4f74-bd2f-2d26367fa66b/new-post",
      name: "New Post",
    },
    {
      href: "/post/05fea12f-de64-4e32-ae36-68ad8e9dbf7e/edit",
      name: "Edit Post",
    },
  ],
];
