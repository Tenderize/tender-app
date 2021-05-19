import React, { useState} from "react";
import { Card, Button, Heading, Text, Avatar, Input } from "rimble-ui";
import { Container, Row, Col, Tabs, Tab, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ethers from "ethers";
import classNames from "classnames";
import {
  useLocation
} from "react-router-dom";

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

interface State {
  tokenAddress: string;
  tenderTokenAddress: string;
  tokenBalance: string;
  tenderBalance: string;
  tokenAllowance: string;
  tenderAllowance: string;
  depositAmount: string;
  withdrawAmount: string;
  transactionModalOpen: boolean;
  activeTab: string;
}

function Token() {

  let location = useLocation();
  let info = stakers[location.pathname]

  const logo = require("../../images/" + info.logo).default;

  const [activeTab, setActiveTab] = useState('deposit')

  const [depositInput, setDepositInput] = useState("0")

  const [withdrawInput, setWithdrawInput] = useState("0")

  const depositText = () => {
    // if (
    //   parseInt(this.state.tokenAllowance, 10) >=
    //   parseInt(this.state.depositAmount, 10)
    // ) {
    //   return `Deposit ${this.props.info.symbol}`;
    // } else {
    //   return `Approve ${this.props.info.symbol}`;
    // }
    return `Deposit ${info.symbol}`
  };

  const withdrawText = () => {
    // if (
    //   parseInt(this.state.tenderAllowance, 10) >=
    //   parseInt(this.state.withdrawAmount, 10)
    // ) {
    //   return `Withdraw t${this.props.info.symbol}`;
    // } else {
    //   return `Approve t${this.props.info.symbol}`;
    // }
    return `Withdraw t${info.symbol}`
  };

  const maxDeposit = () => {
    setDepositInput("0")
  }

  const maxWithdraw = () => {
    setWithdrawInput("0")
  } 

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
  }

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
            <Col>
              <Card>
                {tabButton("deposit")}
                {tabButton("withdraw")}
                <Avatar
                  size="large"
                  src={logo}
                  style={{ margin: "1em auto 0" }}
                />
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
                  <Form /*onSubmit={}*/>
                    <Form.Group controlId="formDeposit">
                      <Form.Label>Deposit Amount</Form.Label>
                      <Input
                        width={1}
                        value={depositInput}
                        onChange={setDepositInput}
                        type="text"
                        placeholder={"0 " + info.symbol}
                        className="amount"
                      />
                      <Form.Text className="balance" onClick={maxDeposit}>
                        Current Balance: {`${0} ${info.symbol}`}
                      </Form.Text>
                    </Form.Group>
                    <Button
                      disabled={depositInput == "0"}
                      style={{ width: "100%" }}
                      type="submit"
                    >
                      {depositText()}
                    </Button>
                  </Form>
                )}
                {activeTab === "withdraw" && (
                  <Form /*onSubmit={this.handleWithdraw}*/>
                    <Form.Group controlId="formWithdraw">
                      <Form.Label>Withdraw Amount</Form.Label>
                      <Input
                        width={1}
                        value={withdrawInput}
                        onChange={setWithdrawInput}
                        type="text"
                        placeholder={`0 t${info.symbol}`}
                        className="amount"
                      />
                      <Form.Text className="balance" onClick={maxWithdraw}>
                        Current Balance: {`0 ${info.symbol}`}
                      </Form.Text>
                    </Form.Group>
                    <Button
                      disabled={withdrawInput == "0"}
                      style={{ width: "100%" }}
                      type="submit"
                    >
                      {withdrawText()}
                    </Button>
                  </Form>
                )}
              </Card>
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