import { useState } from "react";
import { Card, Button, Heading, Text, Avatar } from "rimble-ui";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ethers from "ethers";
import classNames from "classnames";
import { useLocation } from "react-router-dom";

import Faucet from "../../components/faucet";
import { Deposit, Withdraw } from "../../components/actions";

import stakers from "../../data/stakers";
import "./token.scss";

import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts";
import { constants } from "ethers";

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
  let info = stakers[location.pathname];
  let name = location.pathname.split("/")[2];

  let { account } = useEthers();
  account = account ? account : constants.AddressZero;
  const tokenBalance = useTokenBalance(addresses[name].token, account) || constants.Zero;
  const tenderBalance = useTokenBalance(addresses[name].tenderToken, account) || constants.Zero;
  const tokenAllowance =
    useTokenAllowance(addresses[name].token, account, addresses[name].controller) || constants.Zero;
  const tenderAllowance =
    useTokenAllowance(addresses[name].tenderToken, account, addresses[name].swap) || constants.Zero;

  const logo = require("../../images/" + info.logo).default;

  const [activeTab, setActiveTab] = useState("deposit");

  let tabButton = (name: string) => {
    let active = name === activeTab;
    if (active) {
      return (
        <Button
          onClick={(e: any) => setActiveTab(name)}
          className={classNames("tab", { active: active })}
          style={{
            width: "50%",
            textTransform: "capitalize",
            borderRadius: "0",
          }}
        >
          {name}
        </Button>
      );
    } else {
      return (
        <Button.Outline
          onClick={(e: any) => setActiveTab(name)}
          className={classNames("tab", { active: active })}
          style={{
            width: "50%",
            textTransform: "capitalize",
            borderRadius: "0",
          }}
        >
          {name}
        </Button.Outline>
      );
    }
  };

  return (
    <>
      <Container>
        <Link to="/">
          <Button.Text icon="KeyboardArrowLeft">Back</Button.Text>
        </Link>
        <Heading as={"h2"}>About {info.title}</Heading>
        <Row>
          <Col lg={{ span: 6 }}>
            <Card>
              <Text required="">{info.description}</Text>
            </Card>
          </Col>
          <Col lg={{ span: 6 }}>
            <Card>
              {tabButton("deposit")}
              {tabButton("withdraw")}
              <Avatar size="large" src={logo} style={{ margin: "1em auto 0" }} />
              <Heading style={{ textAlign: "center" }}>{info.title}</Heading>
              <div style={{ textAlign: "center", justifyContent: "center" }}>
                {/* <SharePrice
                    symbol={info.symbol}
                    available={info.available}
                    stakerAddress={info.stakerAddress}
                    provider={this.props.provider}
                  /> */}
              </div>
              {activeTab === "deposit" && (
                <Deposit name={name} symbol={info.symbol} tokenBalance={tokenBalance} tokenAllowance={tokenAllowance} />
              )}
              {activeTab === "withdraw" && (
                <Withdraw
                  name={name}
                  symbol={info.symbol}
                  tenderBalance={tenderBalance}
                  tenderAllowance={tenderAllowance}
                />
              )}
            </Card>
          </Col>
          <Col className="mt-2" lg={{ span: 6, offset: 6 }}>
            <Faucet name={name} symbol={info.symbol} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export type TokenPageProps = {
  info: CardInfo;
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
};

export default Token;
