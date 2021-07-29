import { FC, useCallback, useState } from "react";
import { Box, Tabs, Tab, Text, Paragraph, Avatar, DropButton, Button } from "grommet";
import { Currency, Grow, PhoneHorizontal, FormDown } from "grommet-icons";
import { Link, useLocation } from "react-router-dom";
import { constants } from "ethers";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts";

import { Deposit } from "../../components/actions";
import Farm from "../../components/farm";
import LiquidityPool from "../../components/swap";
import stakers, { Staker } from "../../data/stakers";
import TenderBox from "../../components/tenderbox";
import Navbar from "../../components/nav";
import { NotificationsList } from "../../components/transactions";

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
    <Box>
      <NotificationsList />
      <Navbar symbol={info.symbol} name={name} />
      <Box width="100vw" align="center" alignSelf="start">
        <TenderBox
          margin={{
            top: "xlarge",
          }}
          pad={{ bottom: "xlarge" }}
          width="xlarge"
        >
          <Tabs alignControls="center" id="tokenpage-tabs" activeIndex={tabIndex} onActive={onActive}>
            <Tab plain title={<TokenDropdown title={info.title} logo={logo} />} />
            <Tab
              title={
                <Box pad={{ vertical: "medium" }} justify="center" align="center" gap="small">
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
                  top: "medium",
                }}
              >
                <Deposit name={name} symbol={info.symbol} tokenBalance={tokenBalance} tokenAllowance={tokenAllowance} />
              </Box>
            </Tab>
            <Tab
              title={
                <Box pad={{ vertical: "medium" }} justify="center" align="center" gap="small">
                  <PhoneHorizontal />
                  <Paragraph>Swap</Paragraph>
                </Box>
              }
            >
              <Box round={{ corner: "bottom" }} border="top" pad="medium">
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
                <Box pad={{ vertical: "medium" }} justify="center" align="center" gap="small">
                  <Grow />
                  <Paragraph>Farm</Paragraph>
                </Box>
              }
            >
              <Box round={{ corner: "bottom" }} border="top" pad="medium">
                <Farm name={name} symbol={info.symbol} account={account} lpTokenBalance={lpTokenBal} />
              </Box>
            </Tab>
          </Tabs>
        </TenderBox>
      </Box>
    </Box>
  );
};

const TokenDropdown: FC<{ logo: any; title: string }> = ({ logo, title }) => {
  const options = Object.values(stakers).filter((option) => option.title !== title);
  const [open, setOpen] = useState(false);

  return (
    <DropButton
      plain
      hoverIndicator={{ color: "rgba(0, 0, 0, 0.1)" }}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      style={{ paddingTop: 30, paddingBottom: 30 }}
      label={
        <Box focusIndicator={false} direction="row" justify="center" gap="small">
          <Box direction="column" align="center" pad={{ bottom: "small" }}>
            <Avatar size="medium" src={logo} />
            <Box direction="row" gap="small">
              <Text>{title}</Text>
              <FormDown color="white" />
            </Box>
          </Box>
        </Box>
      }
      dropAlign={{ top: "bottom" }}
      dropContent={
        <Box
          border={{ side: "vertical" }}
          background={{
            image: "url('/background.svg')",
            size: "100vw 100vh",
            opacity: 0.6,
          }}
        >
          {options.map((option) => (
            <DropdownOption staker={option} onClick={() => setOpen(false)} />
          ))}
        </Box>
      }
    />
  );
};

const DropdownOption: FC<{ staker: Staker; onClick: () => void }> = ({ staker, onClick }) => (
  <MaybeLink staker={staker}>
    <Button
      fill
      plain
      hoverIndicator={{ color: "rgba(0, 0, 0, 0.1)" }}
      disabled={!staker.available}
      onClick={onClick}
      label={
        <Box border={{ side: "bottom" }} direction="row" justify="center" pad={{ vertical: "medium" }} gap="small">
          <Box direction="column" align="center" pad={{ bottom: "small" }}>
            <Avatar size="medium" src={require("../../images/" + staker.logo).default} />
            <Text color="light-1">{staker.title}</Text>
          </Box>
        </Box>
      }
    />
  </MaybeLink>
);

const MaybeLink: FC<{ staker: Staker }> = ({ staker, children }) => {
  if (staker.available) {
    return (
      <Link to={staker.path} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  } else {
    return <>{children}</>;
  }
};

export default Token;
