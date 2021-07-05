import { FC } from "react";
import { Card, Button, Heading, Avatar } from "rimble-ui";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ethers, { constants } from "ethers";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts";

import Faucet from "../../components/faucet";
import { Deposit, Withdraw } from "../../components/actions";
import Farm from "../../components/farm";
import LiquidityPool from "../../components/swap";
import stakers from "../../data/stakers";
import "./token.scss";

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

const Token: FC = () => {
  const location = useLocation();
  const info = stakers[location.pathname];
  const name = location.pathname.split("/")[2];

  let { account } = useEthers();
  account = account ?? constants.AddressZero;
  const tokenBalance = useTokenBalance(addresses[name].token, account) || constants.Zero;
  const tenderBalance = useTokenBalance(addresses[name].tenderToken, account) || constants.Zero;
  const tokenAllowance =
    useTokenAllowance(addresses[name].token, account, addresses[name].controller) || constants.Zero;
  const tenderAllowance =
    useTokenAllowance(addresses[name].tenderToken, account, addresses[name].swap) || constants.Zero;

  const logo = require("../../images/" + info.logo).default;

  return (
    <>
      <Container className="mb-5">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Link to="/">
              <Button.Text icon="KeyboardArrowLeft">Back</Button.Text>
            </Link>
            <Row>
              <Col lg={{ span: 12 }}>
                <Card>
                  <Heading style={{ textAlign: "center" }}>{info.title}</Heading>
                  <Avatar size="large" src={logo} style={{ margin: "1em auto 0" }} />
                  <Tabs fill justify defaultActiveKey="stake" id="tokenpage-tabs">
                    <Tab eventKey="stake" title="Stake">
                      <Deposit
                        name={name}
                        symbol={info.symbol}
                        tokenBalance={tokenBalance}
                        tokenAllowance={tokenAllowance}
                      />
                    </Tab>
                    <Tab eventKey="liquidity pool" title="Liquidity Pool">
                      <Withdraw
                        name={name}
                        symbol={info.symbol}
                        tenderBalance={tenderBalance}
                        tenderAllowance={tenderAllowance}
                      />
                      <LiquidityPool
                        name={name}
                        symbol={info.symbol}
                        tokenBalance={tokenBalance}
                        tenderTokenBalance={tenderBalance}
                      />
                    </Tab>
                    <Tab eventKey="farm" title="Farm">
                      <Farm name={name} symbol={info.symbol} account={account} />
                    </Tab>
                  </Tabs>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col className="mt-2" lg={true}>
                <Faucet name={name} symbol={info.symbol} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export type TokenPageProps = {
  info: CardInfo;
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
};

export default Token;
