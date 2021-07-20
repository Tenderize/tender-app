import { FC, useCallback, useState } from "react";
import { Box, Tabs, Tab, Text, Paragraph, Avatar } from "grommet";
import { Currency, Grow, PhoneHorizontal, FormDown } from "grommet-icons";
import { useLocation } from "react-router-dom";
import { constants } from "ethers";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts";

import { Deposit } from "../../components/actions";
import Farm from "../../components/farm";
import LiquidityPool from "../../components/swap";
import stakers from "../../data/stakers";
import TenderBox from "../../components/tenderbox";
import Navbar from "../../components/nav";

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
    <>
    <Navbar symbol={info.symbol} name={name} />
    <Box align="center" alignSelf="start">
      <TenderBox
        margin={{
          top: "xlarge",
        }}
        pad={{ bottom: "xlarge" }}
        width="xlarge"
      >
        <Tabs alignControls="center" id="tokenpage-tabs" activeIndex={tabIndex} onActive={onActive}>
          <Tab
            plain
            title={
              <Box
                direction="row"
                justify="center"
                align="center"
                gap="small"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Box direction="column" justify="center" align="center" margin={{ bottom: "small" }}>
                  <Avatar size="medium" src={logo} />
                  <Text>{info.title}</Text>
                </Box>
                <FormDown color="white" />
              </Box>
            }
          />
          <Tab
            title={
              <Box pad={{ top: "medium" }} justify="center" align="center" gap="small">
                <Currency />
                <Paragraph>Stake</Paragraph>
              </Box>
            }
          >
            <Box
              round={{ corner: "bottom" }}
              border="top"
              pad={{
                horizontal: "large",
              }}
            >
              <Deposit name={name} symbol={info.symbol} tokenBalance={tokenBalance} tokenAllowance={tokenAllowance} />
            </Box>
          </Tab>
          <Tab
            title={
              <Box pad={{ top: "medium" }} justify="center" align="center" gap="small">
                <PhoneHorizontal />
                <Paragraph>Swap</Paragraph>
              </Box>
            }
          >
            <Box round={{ corner: "bottom" }} border="top" pad="small">
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
              <Box pad={{ top: "medium" }} justify="center" align="center" gap="small">
                <Grow />
                <Paragraph>Farm</Paragraph>
              </Box>
            }
          >
            <Box round={{ corner: "bottom" }} border="top" pad="small">
              <Farm name={name} symbol={info.symbol} account={account} lpTokenBalance={lpTokenBal} />
            </Box>
          </Tab>
        </Tabs>
      </TenderBox>
    </Box>
    </>
  );
};

export default Token;
