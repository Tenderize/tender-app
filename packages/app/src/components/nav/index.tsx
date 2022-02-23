import { Header, Nav, Image, Box } from "grommet";
import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AccountButton } from "../account";
import { TenderizeConfig } from "types";

type props = {
  config: TenderizeConfig;
};
const Navbar: FC<props> = (props) => {
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
        <Link href="/" passHref>
          <Image width="150px" src={"/tenderizeLogo.svg"} alt="header logo" />
        </Link>

        <Box direction="row" align="center" gap="medium">
          <Nav direction="row">
            <AccountButton config={props.config} />
          </Nav>
        </Box>
      </Header>
    </Box>
  );
};

export default Navbar;
