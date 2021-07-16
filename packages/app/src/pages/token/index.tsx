import { FC, useCallback, useState } from "react";
import { Box, Card, Button, Tabs, Tab, Text, Paragraph, Avatar } from "grommet";
import { Currency, Grow, PhoneHorizontal, Previous } from "grommet-icons";
import { Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ethers, { constants } from "ethers";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts";

import Faucet from "../../components/faucet";
import { Deposit } from "../../components/actions";
import Farm from "../../components/farm";
import LiquidityPool from "../../components/swap";
import stakers from "../../data/stakers";

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
  const [tabIndex, setTabIndex] = useState(1);

  let { account } = useEthers();
  account = account ?? constants.AddressZero;
  const tokenBalance = useTokenBalance(addresses[name].token, account) || constants.Zero;
  const tenderBalance = useTokenBalance(addresses[name].tenderToken, account) || constants.Zero;
  const lpTokenBal = useTokenBalance(addresses[name].liquidity, account) || constants.Zero;

  const tokenAllowance =
    useTokenAllowance(addresses[name].token, account, addresses[name].controller) || constants.Zero;
  const tenderAllowance =
    useTokenAllowance(addresses[name].tenderToken, account, addresses[name].swap) || constants.Zero;

  const logo = require("../../images/" + info.logo).default;

  const onActive = useCallback((nextIndex: number) => {
    if (nextIndex === 0) {
      setTabIndex(1);
    } else {
      setTabIndex(nextIndex);
    }
  }, []);

  return (
    <Box align="center">
      <Box margin={{ bottom: "small" }} width="large">
        <Link to="/">
          <Button hoverIndicator="light-1">
            <Box pad="small" direction="row" align="center" gap="small">
              <Previous />
              <Text>Back</Text>
            </Box>
          </Button>
        </Link>
        <Row>
          <Card>
            <Tabs id="tokenpage-tabs" activeIndex={tabIndex} onActive={onActive}>
              <Tab
                plain
                icon={
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Box pad="small" direction="column" align="center" gap="small">
                      <Avatar size="medium" src={logo} style={{ margin: "1em auto 0" }} />
                      <Text>{info.title}</Text>
                    </Box>
                  </Button>
                }
              />
              <Tab
                title={
                  <Box align="center" gap="small">
                    <Currency />
                    <Paragraph>Stake</Paragraph>
                  </Box>
                }
              >
                <Box pad="small">
                  <Deposit
                    name={name}
                    symbol={info.symbol}
                    tokenBalance={tokenBalance}
                    tokenAllowance={tokenAllowance}
                  />
                </Box>
              </Tab>
              <Tab
                title={
                  <Box align="center" gap="small">
                    <PhoneHorizontal />
                    <Paragraph>Liquidity Pool</Paragraph>
                  </Box>
                }
              >
                <Box pad="small">
                  <LiquidityPool
                    name={name}
                    symbol={info.symbol}
                    tokenBalance={tokenBalance}
                    tenderTokenBalance={tenderBalance}
                    lpTokenBalance={lpTokenBal}
                  />
                </Box>
              </Tab>
              <Tab
                title={
                  <Box align="center" gap="small">
                    <Grow />
                    <Paragraph>Farm</Paragraph>
                  </Box>
                }
              >
                <Box pad="small">
                  <Farm name={name} symbol={info.symbol} account={account} lpTokenBalance={lpTokenBal} />
                </Box>
              </Tab>
            </Tabs>
          </Card>
        </Row>
        <Row>
          <Col className="mt-2" lg={true}>
            <Faucet name={name} symbol={info.symbol} />
          </Col>
        </Row>
      </Box>
    </Box>
  );
};

export type TokenPageProps = {
  info: CardInfo;
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
};

export default Token;
