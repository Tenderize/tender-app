import { Header, Nav, Image, Box } from "grommet";
import { FC, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import { AccountButton } from "../account";
import TestnetBanner from "../testnet-banner";

const Navbar: FC = () => {
  const logo = require("../../images/tenderizeLogo.svg").default;

  const location = useLocation();
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
      <TestnetBanner />
      {location.pathname !== "/" && (
        <Header pad="xxsmall" justify="around" height="xxsmall">
          <Link to="/">
            <Image width="150px" src={logo} />
          </Link>
          <Nav direction="row">
            <AccountButton />
          </Nav>
        </Header>
      )}
    </Box>
  );
};

export default Navbar;
