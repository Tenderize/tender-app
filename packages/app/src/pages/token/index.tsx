import { FC, useCallback, useState } from "react";
import { Box, Card, Button, Tabs, Tab, Text, Paragraph, Avatar, Grid } from "grommet";
import { Currency, Grow, PhoneHorizontal, Previous } from "grommet-icons";
import { Link, useLocation } from "react-router-dom";
import { constants } from "ethers";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts";

import Faucet from "../../components/faucet";
import { Deposit } from "../../components/actions";
import Farm from "../../components/farm";
import LiquidityPool from "../../components/swap";
import stakers from "../../data/stakers";
import { RoundType } from "grommet/utils";

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
    <Box align="center" overflow="auto">
      <Grid>
        <Box margin={{ bottom: "small" }} width="large">
          <Link to="/">
            <Button hoverIndicator="light-1">
              <Box pad="small" direction="row" align="center" gap="small">
                <Previous />
                <Text>Back</Text>
              </Box>
            </Button>
          </Link>
          <Box round={true} className="blur-box" margin={{ bottom: "small" }}>
            <Tabs flex id="tokenpage-tabs" activeIndex={tabIndex} onActive={onActive}>
              <Tab
                plain
                title={
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Box direction="column" align="center" margin={{ bottom: "small" }}>
                      <Avatar size="medium" src={logo} />
                      <Text>{info.title}</Text>
                    </Box>
                  </Box>
                }
              />
              <Tab
                title={
                  <Box pad={{ top: "medium" }} align="center" gap="small">
                    <Currency />
                    <Paragraph>Stake</Paragraph>
                  </Box>
                }
              >
                <Box round={{ corner: "bottom" }} border="top" className="blur-box" pad="small">
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
                  <Box pad={{ top: "medium" }} align="center" gap="small">
                    <PhoneHorizontal />
                    <Paragraph>Liquidity Pool</Paragraph>
                  </Box>
                }
              >
                <Box round={{ corner: "bottom" }} border="top" className="blur-box" pad="small">
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
                  <Box pad={{ top: "medium" }} align="center" gap="small">
                    <Grow />
                    <Paragraph>Farm</Paragraph>
                  </Box>
                }
              >
                <Box round={{ corner: "bottom" }} border="top" className="blur-box" pad="small">
                  <Farm name={name} symbol={info.symbol} account={account} lpTokenBalance={lpTokenBal} />
                </Box>
              </Tab>
            </Tabs>
          </Box>
          <Faucet name={name} symbol={info.symbol} />
        </Box>
      </Grid>
    </Box>
  );
};

export default Token;
