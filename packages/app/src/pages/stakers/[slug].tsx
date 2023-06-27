import { FC, MouseEventHandler, useCallback, useRef, useState } from "react";
import { Box, Tabs, Tab, Text, Paragraph, Drop, Button, Tip } from "grommet";
import { FormDown } from "grommet-icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { constants } from "ethers";
import { ChainId, Config, DAppProvider, useEthers, useTokenBalance, Arbitrum, Mainnet } from "@usedapp/core";
import { addresses } from "@tender/contracts/src/index";
import styled from "styled-components";
import Deposit from "../../components/deposit";
import Farm from "../../components/farm";
import LiquidityPool from "../../components/swap";
import { Subgraph, Staker, stakers, Foot } from "@tender/shared/src/index";
import TenderBox from "../../components/tenderbox";
import Navbar from "../../components/nav";
import { NotificationsList } from "../../components/transactions";
import { useHover } from "utils/useHover";
import { TenderizeConfig, Endpoints } from "types";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { useLastProcessUnstakes } from "utils/useLastProcessUnstakes";

import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

const Token: FC = () => {
  const router = useRouter();
  const protocolName = router.query.slug as ProtocolName;
  const info = stakers[protocolName];
  const [tabIndex, setTabIndex] = useState(1);

  let { account } = useEthers();
  account = account ?? constants.AddressZero;
  const chainId = stakers[protocolName].chainId;
  const tokenBalance = useTokenBalance(addresses[protocolName].token, account, { chainId }) || constants.Zero;
  const tenderBalance = useTokenBalance(addresses[protocolName].tenderToken, account, { chainId }) || constants.Zero;
  const lpTokenBalance = useTokenBalance(addresses[protocolName].lpToken, account, { chainId }) || constants.Zero;
  const { lastProcessUnstakesEvent } = useLastProcessUnstakes(protocolName);

  const onActive = useCallback((nextIndex: number) => {
    if (nextIndex === 0) {
      setTabIndex(1);
    } else {
      setTabIndex(nextIndex);
    }
  }, []);

  return (
    <Box flex width="100vw" align="center" alignSelf="start">
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
                <Box height="100%" justify="center" align="center">
                  <Paragraph style={{ fontWeight: 600 }}>Stake</Paragraph>
                </Box>
              </Tip>
            }
          >
            <Box round={{ corner: "bottom" }} border={protocolName === "graph" ? undefined : "top"} pad="medium">
              <Deposit
                protocolName={protocolName}
                symbol={info.symbol}
                logo={info.bwLogo}
                tokenBalance={tokenBalance}
                tenderTokenBalance={tenderBalance}
                lastProcessUnstakesEvent={lastProcessUnstakesEvent}
              />
            </Box>
          </Tab>
          <Tab
            title={
              <Tip
                dropProps={{ align: { bottom: "top" } }}
                content={`Trade between ${info.symbol} and t${info.symbol} or provide liquidity`}
              >
                <Box height="100%" justify="center" align="center">
                  <Paragraph style={{ fontWeight: 600 }}>Swap</Paragraph>
                </Box>
              </Tip>
            }
          >
            <Box round={{ corner: "bottom" }} border="top" pad="medium">
              <LiquidityPool
                protocolName={protocolName}
                symbol={info.symbol}
                tokenBalance={tokenBalance}
                tenderTokenBalance={tenderBalance}
                lpTokenBalance={lpTokenBalance}
              />
            </Box>
          </Tab>
          <Tab
            title={
              <Tip
                dropProps={{ align: { bottom: "top" } }}
                content={`Farm your liquidity pool tokens for more rewards`}
              >
                <Box height="100%" justify="center" align="center">
                  <Paragraph style={{ fontWeight: 600 }}>Farm</Paragraph>
                </Box>
              </Tip>
            }
          >
            <Box round={{ corner: "bottom" }} border="top" pad="medium">
              <Farm
                protocolName={protocolName}
                symbol={info.symbol}
                account={account}
                lpTokenBalance={lpTokenBalance}
              />
            </Box>
          </Tab>
        </Tabs>
      </TenderBox>
    </Box>
  );
};

const TokenDropdown: FC<{ logo: string; title: string }> = ({ logo, title }) => {
  const options = Object.values(stakers).filter((option) => option.title !== title);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const { style, ...rest } = useHover({ backgroundColor: "rgba(0, 0, 0, 0.1)" });

  return (
    <>
      <Box
        ref={targetRef}
        style={{ paddingTop: 33, paddingBottom: 33, boxShadow: "none", ...style }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        {...rest}
      >
        <Box focusIndicator={false} direction="row" justify="center" align="center">
          <Box direction="column" align="center" gap="small">
            <Image width={48} height={48} src={`/${logo}`} />
            <Text color="white">{title}</Text>
          </Box>
          <FormDown color="white" />
        </Box>
      </Box>
      {targetRef.current && open && (
        <Drop
          background="transparent"
          target={targetRef.current}
          align={{ top: "bottom", left: "left" }}
          style={{ borderBottomRightRadius: 50, borderBottomLeftRadius: 50 }}
        >
          <Box round={{ size: "large" }}>
            <DropdownBackground style={{ zIndex: 1 }} />
            <Box style={{ zIndex: 2 }}>
              {options
                .map((option) => {
                  if (option.available === false) {
                    return null;
                  }
                  return (
                    <DropdownOption
                      key={option.title}
                      staker={option}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setOpen(false);
                      }}
                    />
                  );
                })
                .filter((v) => v != null)}
            </Box>
          </Box>
        </Drop>
      )}
    </>
  );
};

const DropdownOption: FC<{ staker: Staker; onClick: MouseEventHandler<HTMLButtonElement> }> = ({ staker, onClick }) => {
  return (
    <DropdownOptionContainer border={{ side: "bottom" }} onClick={onClick}>
      <Link href={staker.path} passHref>
        <Button fill hoverIndicator={{ color: "rgba(0, 0, 0, 0.1)" }} disabled={!staker.available}>
          <Box direction="row" justify="center" pad={{ vertical: "medium" }} gap="small">
            <Box direction="column" gap="small" align="center" pad={{ bottom: "small" }}>
              <Image width={48} height={48} src={`/${staker.bwLogo}`} />
              <Text color="light-1">{staker.title}</Text>
            </Box>
          </Box>
        </Button>
      </Link>
    </DropdownOptionContainer>
  );
};

const DropdownOptionContainer = styled(Box)`
  &:last-child {
    border: unset;
  }
`;

const DropdownBackground = styled.div`
  background-image: url("/shad-defi.jpg");
  background-position: -550px -800px;
  filter: blur(2px);
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const TokenWrapper: FC<{ config?: TenderizeConfig }> = (props) => {
  const dappConfig: Config = {
    pollingInterval: 5000,
    readOnlyUrls: props.config?.chainUrlMapping,
  };

  if (props.config == null) return null;

  return (
    <ApolloProvider client={Subgraph(props.config.subgraphEndpoints)}>
      <DAppProvider config={dappConfig}>
        <NotificationsList />
        <Box style={{ minHeight: "100%" }}>
          <Navbar config={props.config} />
          <Token />
          <Foot />
        </Box>
      </DAppProvider>
    </ApolloProvider>
  );
};

export const getStaticProps = async () => {
  const CHAIN_URL_MAPPING = {
    [ChainId.Mainnet]: process.env.RPC_ETHEREUM ?? "",
    [ChainId.Arbitrum]: process.env.RPC_ARBITRUM ?? "",
  };

  const ENDPOINTS: Endpoints = {
    [ChainId.Arbitrum]: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/Gr4Kn4E1CwNbjBxFXdnKEunAGrC4d714TFMPw4NbmbPk`,
    [ChainId.Mainnet]: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/2x67A1XaRrMBMcYaPE6JbJEUnrtadx3HznbbGEFJtN2u`,
    [ChainId.Hardhat]: "http://127.0.0.1:8000/subgraphs/name/tenderize/tenderize-localhost",
  };

  const config: TenderizeConfig = {
    portisApiKey: process.env.PORTIS_API_KEY ?? "",
    chainUrlMapping: CHAIN_URL_MAPPING,
    supportedChains: [Mainnet.chainId, Arbitrum.chainId],
    subgraphEndpoints: ENDPOINTS,
  };

  return {
    props: {
      config,
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: Object.values(stakers).map((staker) => ({ params: { slug: staker.name } })),
    fallback: false,
  };
};

export default TokenWrapper;
