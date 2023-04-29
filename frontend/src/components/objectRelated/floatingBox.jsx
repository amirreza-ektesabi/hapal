import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Favorite from "src/components/objectRelated/favorite";
import Comment from "src/components/objectRelated/comment";

export function useScroll() {
  const [lastScrollTop, setLastScrollTop] = React.useState(0);
  const [bodyOffset, setBodyOffset] = React.useState(
    document.body.getBoundingClientRect()
  );
  const [scrollDirection, setScrollDirection] = React.useState("down");

  const listener = (e) => {
    setBodyOffset(document.body.getBoundingClientRect());
    setScrollDirection(lastScrollTop > -bodyOffset.top ? "down" : "up");
    setLastScrollTop(-bodyOffset.top);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  return {
    scrollDirection,
  };
}

export default function FloatingButton({ data, className, toggleDrawer }) {
  const { scrollDirection } = useScroll();

  const styles = {
    active: {
      visibility: "visible",
      transition: "all 0.5s",
    },
    hidden: {
      visibility: "hidden",
      transition: "all 0.5s",
      transform: "translateY(500%)",
    },
  };

  return (
    <Box
      className="fixed bottom-[3.8rem] sm:bottom-[3.3rem] h-8 rounded-full bg-blackZ shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)] drop-shadow-2xl flex place-items-center px-4"
      style={scrollDirection === "down" ? styles.active : styles.hidden}
    >
      <Favorite data={data} />
      <Divider
        flexItem
        orientation="vertical"
        variant="middle"
        className="mx-3"
      />
      <Comment data={data} iconOnClick={toggleDrawer(true)} />
    </Box>
  );
}
