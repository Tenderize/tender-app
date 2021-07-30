import { Header, Nav, Image, Box } from "grommet";
import { FC, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { AccountButton } from "../account";
import TestnetBanner from "../testnet-banner";
import Faucet from "../faucet";

type props = {
  symbol: string;
  name: string;
};
const Navbar: FC<props> = (props) => {
  const logo = require("../../images/tenderizeLogo.svg").default;

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
      <Header justify="around" pad="xsmall">
        <Link to="/">
          <Image width="150px" src={logo} alt="header logo" />
        </Link>
        <Box direction="row" align="center" gap="medium">
          <Faucet {...props} />
          <Nav direction="row">
            <AccountButton />
          </Nav>
        </Box>
      </Header>
    </Box>
  );
};

export default Navbar;
