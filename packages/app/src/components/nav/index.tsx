import Connect from "./Connect";
import Account from "./Account";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useEthers } from "@usedapp/core";

function Nav() {
  const logo = require("../../images/tenderizeLogo.svg").default;

  const { activateBrowserWallet, account } = useEthers();

  return (
    <>
      <Row>
        <Col md={{ span: 3, offset: 1 }} lg={{ span: 3, offset: 1 }}>
          <Link to="/">
            <img src={logo} alt="logo" style={{ marginTop: "1em" }} />
          </Link>
        </Col>
        <Col md={{ span: 3, offset: 4 }}>
          {account ? <Account account={account} /> : <Connect activateBrowserWallet={activateBrowserWallet} />}
        </Col>
      </Row>
    </>
  );
}

export default Nav;
