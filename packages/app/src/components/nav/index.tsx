import { Link } from "react-router-dom";
import { Row, Col, Navbar } from "react-bootstrap";
import { useEthers } from "@usedapp/core";
import { FC, useEffect, useRef, useState } from "react";

import Connect from "./Connect";
import Account from "./Account";
import ApprovalStateBadge from "../authorize/ApprovalStateBadge";

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
        <Link to="/">
          <img src={logo} alt="logo" style={{ marginTop: "1em" }} />
        </Link>
      </Col>
      <Col md={{ span: 1, offset: 3 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
          <ApprovalStateBadge />
        </div>
      </Col>
      <Col md={{ span: 3 }}>
        {account ? <Account account={account} /> : <Connect activateBrowserWallet={activateBrowserWallet} />}
      </Col>
    </Navbar>
  );
};

export default Nav;
