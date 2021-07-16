import { AccountButton } from "../account";
import { Link } from "react-router-dom";
import { Col, Navbar } from "react-bootstrap";
import { useEthers } from "@usedapp/core";
import { FC, useEffect, useRef, useState } from "react";

const Nav: FC = () => {
  const logo = require("../../images/tenderizeLogo.svg").default;

  const { activateBrowserWallet, account } = useEthers();

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
    <Navbar
      sticky="top"
      variant="light"
      style={{ transition: "0.3s ease", backgroundColor: navBackground ? "#F0F1F5" : "transparent" }}
    >
      <Col md={{ span: 3, offset: 1 }} lg={{ span: 3, offset: 1 }}>
      </Col>
      <Col md={{ span: 3, offset: 4 }}>
        <AccountButton />
      </Col>
    </Navbar>
  );
};

export default Nav;
