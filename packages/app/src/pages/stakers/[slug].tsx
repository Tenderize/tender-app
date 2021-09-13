import { FC, MouseEventHandler, useCallback, useState } from "react";
import { Box, Tabs, Tab, Text, Paragraph, Avatar, DropButton, Button, Tip } from "grommet";
import { Currency, Grow, PhoneHorizontal, FormDown } from "grommet-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { constants } from "ethers";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts";
import styled from "styled-components";

import { Deposit } from "../../components/actions";
import Farm from "../../components/farm";
import LiquidityPool from "../../components/swap";
import stakers, { Staker } from "../../data/stakers";
import TenderBox from "../../components/tenderbox";
import Navbar from "../../components/nav";
import { NotificationsList } from "../../components/transactions";

const Token: FC = () => {
  const router = useRouter();
  const name = (router.query.slug as string) ?? "livepeer";
  const info = stakers[name];
  const [tabIndex, setTabIndex] = useState(1);

  let { account } = useEthers();
  account = account ?? constants.AddressZero;
  const tokenBalance = useTokenBalance(addresses[name].token, account) || constants.Zero;
  const tenderBalance = useTokenBalance(addresses[name].tenderToken, account) || constants.Zero;
  const lpTokenBal = useTokenBalance(addresses[name].liquidity, account) || constants.Zero;

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
            <Tab plain title={<TokenDropdown title={info.title} logo={info.bwLogo} />} />
            <Tab
              title={
                <Tip
                  dropProps={{ align: { bottom: "top" } }}
                  content={`Stake your ${info.symbol} and earn staking rewards`}
                >
                  <Box pad={{ vertical: "medium" }} justify="center" align="center" gap="small">
                    <Currency />
                    <Paragraph style={{ fontWeight: 600 }}>Stake</Paragraph>
                  </Box>
                </Tip>
              }
            >
              <Box
                round={{ corner: "bottom" }}
                border="top"
                pad={{
                  top: "medium",
                }}
              >
                <Deposit
                  name={name}
                  symbol={info.symbol}
                  logo={info.bwLogo}
                  tokenBalance={tokenBalance}
                  tenderTokenBalance={tenderBalance}
                />
              </Box>
            </Tab>
            <Tab
              title={
                <Tip
                  dropProps={{ align: { bottom: "top" } }}
                  content={`Trade between ${info.symbol} and t${info.symbol} or provide liquidity`}
                >
                  <Box pad={{ vertical: "medium" }} justify="center" align="center" gap="small">
                    <PhoneHorizontal />
                    <Paragraph style={{ fontWeight: 600 }}>Swap</Paragraph>
                  </Box>
                </Tip>
              }
            >
              <Box round={{ corner: "bottom" }} border="top" pad="medium">
                <LiquidityPool
                  name={name}
                  symbol={info.symbol}
                  tokenBalance={tokenBalance}
                  tenderTokenBalance={tenderBalance}
                />
              </Box>
            </Tab>
            <Tab
              title={
                <Tip
                  dropProps={{ align: { bottom: "top" } }}
                  content={`Farm your liquidity pool tokens for more rewards`}
                >
                  <Box pad={{ vertical: "medium" }} justify="center" align="center" gap="small">
                    <Grow />
                    <Paragraph style={{ fontWeight: 600 }}>Farm</Paragraph>
                  </Box>
                </Tip>
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

const TokenDropdown: FC<{ logo: string; title: string }> = ({ logo, title }) => {
  const options = Object.values(stakers).filter((option) => option.title !== title);
  const [open, setOpen] = useState(false);

  return (
    <DropButton
      plain
      hoverIndicator={{ color: "rgba(0, 0, 0, 0.1)" }}
      open={open}
      onClose={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      onOpen={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
      style={{ paddingTop: 30, paddingBottom: 30 }}
      label={
        <Box focusIndicator={false} direction="row" justify="center" align="center">
          <Box direction="column" align="center" gap="small">
            <Avatar size="medium" src={`/${logo}`} />
            <Text color="white">{title}</Text>
          </Box>
          <FormDown color="white" />
        </Box>
      }
      dropProps={{ round: { corner: "bottom", size: "large" }, elevation: "none", background: "none" }}
      dropAlign={{ top: "bottom" }}
      dropContent={
        <Box round={{ size: "large" }}>
          <DropdownBackground style={{ zIndex: 1 }} />
          <Box style={{ zIndex: 2 }}>
            {options.map((option) => (
              <DropdownOption
                key={option.title}
                staker={option}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              />
            ))}
          </Box>
        </Box>
      }
    />
  );
};

const DropdownOption: FC<{ staker: Staker; onClick: MouseEventHandler<HTMLButtonElement> }> = ({ staker, onClick }) => {
  return (
    <DropdownOptionContainer border={{ side: "bottom" }} onClick={onClick}>
      <MaybeLink staker={staker}>
        <Button fill hoverIndicator={{ color: "rgba(0, 0, 0, 0.1)" }} disabled={!staker.available}>
          <Box direction="row" justify="center" pad={{ vertical: "medium" }} gap="small">
            <Box direction="column" gap="small" align="center" pad={{ bottom: "small" }}>
              <Avatar size="medium" src={`/${staker.bwLogo}`} />
              <Text color="light-1">{staker.title}</Text>
            </Box>
          </Box>
        </Button>
      </MaybeLink>
    </DropdownOptionContainer>
  );
};

const MaybeLink: FC<{ staker: Staker }> = ({ staker, children }) => {
  if (staker.available) {
    return <Link href={staker.path}>{children}</Link>;
  } else {
    return <>{children}</>;
  }
};

const DropdownOptionContainer = styled(Box)`
  &:last-child {
    border: unset;
  }
`;

const DropdownBackground = styled.div`
  background-image: url("/background.svg");
  background-position: -50px -300px;
  filter: blur(2px);
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

export default Token;
