import { Card, Button, Heading, Avatar } from "rimble-ui";
import { Container, Row, Col, Tabs, Tab} from "react-bootstrap";
import { Link } from "react-router-dom";
import ethers from "ethers";
import {
  useLocation
} from "react-router-dom";

import Faucet from "../../components/faucet"
import {Deposit, Withdraw} from "../../components/actions"

import stakers from "../../data/stakers";
import "./token.scss";

import { useEthers, useTokenAllowance, useTokenBalance} from "@usedapp/core"
import {addresses} from "@tender/contracts"
import { constants } from "ethers"

declare module "@rimble/icons";

type CardInfo = {
  description: string;
  stakerAddress: string;
  title: string;
  available: boolean;
  apy: number;
  logo: string;
  symbol: string;
};

function Token() {
  let location = useLocation();
  let info = stakers[location.pathname]
  let name = location.pathname.split("/")[2]

  let {account} = useEthers()
  account = account ? account : constants.AddressZero
  const tokenBalance =  useTokenBalance(addresses[name].token, account) || constants.Zero
  const tenderBalance = useTokenBalance(addresses[name].tenderToken, account) || constants.Zero
  const tokenAllowance = useTokenAllowance(addresses[name].token, account, addresses[name].controller) || constants.Zero
  const tenderAllowance = useTokenAllowance(addresses[name].tenderToken, account, addresses[name].swap) || constants.Zero

  const logo = require("../../images/" + info.logo).default;

    return (
        <>
        <Container>
          <Link to="/">
            <Button.Text icon="KeyboardArrowLeft">Back</Button.Text>
          </Link>
          <Row>
            <Col lg={{span:12}}>
              <Card>
              <Heading style={{ textAlign: "center" }}>{info.title}</Heading>
              <Avatar
                  size="large"
                  src={logo}
                  style={{ margin: "1em auto 0" }}
                />
              <Tabs fill justify defaultActiveKey="stake" id="tokenpage-tabs">
                <Tab eventKey="stake" title="Stake">
                  <Deposit name={name} symbol={info.symbol} tokenBalance={tokenBalance} tokenAllowance={tokenAllowance}/>
                </Tab>
                <Tab eventKey="liquidity pool" title="Liquidity Pool">
                  <Withdraw name={name} symbol={info.symbol} tenderBalance={tenderBalance} tenderAllowance={tenderAllowance}/>
                </Tab>
                <Tab eventKey="farm" title="Farm">
                  <div>hello yieldfarm</div>
                </Tab>
              </Tabs>
              </Card>
            </Col>
            <Col className="mt-2" lg={{span:6, offset: 6}}>
              <Faucet name={name} symbol={info.symbol}/>
            </Col>
          </Row>
        </Container>
      </>
    )
  
}

export type TokenPageProps = {
  info: CardInfo;
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
};


export default Token