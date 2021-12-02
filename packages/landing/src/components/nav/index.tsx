import { Header, Image, Box } from "grommet";
import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";

const Navbar: FC = () => {
  const [navBackground, setNavBackground] = useState(false);
  const navRef = useRef<boolean>(false);
  navRef.current = navBackground;

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 50;
      if (navRef.current !== show) {
        setNavBackground(show);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box>
      <Header justify="between" pad={{ horizontal: "xlarge", vertical: "xsmall" }}>
        <Link href="/">
          <Image width="150px" src={"/tenderizeLogo.svg"} alt="header logo" />
        </Link>
      </Header>
    </Box>
  );
};

export default Navbar;
