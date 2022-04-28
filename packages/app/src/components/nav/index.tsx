import { Header, Nav, Image, Box, Button } from "grommet";
import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AccountButton } from "../account";
import { TenderizeConfig } from "types";
import { normalizeColor } from "grommet/utils";
import { theme } from "@tender/shared/src";

type props = {
  config: TenderizeConfig;
};
const Navbar: FC<props> = (props) => {
  const [navBackground, setNavBackground] = useState(false);
  const navRef = useRef<boolean>(false);
  navRef.current = navBackground;
  const [index, setIndex] = useState(0);
  const onSelect = (nextIndex: number) => setIndex(nextIndex);
  const selectedStyle = { borderColor: normalizeColor("brand", theme) };

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
      <Header pad={{ horizontal: "small", vertical: "xsmall" }}>
        <Nav flex direction="row">
          <Box alignSelf="start" basis="1/3">
            <Link href="/" passHref>
              <Image width="150px" src={"/tenderizeLogo.svg"} alt="header logo" />
            </Link>
          </Box>

          <Box direction="row" gap="small" basis="1/3" align="center" justify="center">
            {/* <Tabs activeIndex={index} onActive={onActive} justify="start">
              <Tab title="General" />
              <Tab title="Account" />
              <Tab title="Billing" />
            </Tabs> */}
            <Button label="Stake" style={index === 0 ? selectedStyle : undefined} onClick={() => onSelect(0)} />
            <Button label="Swap" style={index === 1 ? selectedStyle : undefined} onClick={() => onSelect(1)} />
            <Button label="Farm" style={index === 2 ? selectedStyle : undefined} onClick={() => onSelect(2)} />
          </Box>
          <Box direction="row" alignSelf="end" basis="1/3">
            <AccountButton config={props.config} />
          </Box>
        </Nav>
      </Header>
    </Box>
  );
};

export default Navbar;
