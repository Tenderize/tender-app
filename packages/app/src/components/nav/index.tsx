import { AccountButton } from "../account";
import { Link } from "react-router-dom";
import { FC, useEffect, useRef, useState } from "react";
import { Header, Nav, Image } from "grommet";
const Navbar: FC = () => {
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
    <Header pad="xxsmall" justify="around" height="xxsmall">
      <Link to="/">
        <Image width="150px" src={logo} />
      </Link>
    <Nav direction="row">
      <AccountButton />
    </Nav>
  </Header>
  );
};

export default Navbar;
