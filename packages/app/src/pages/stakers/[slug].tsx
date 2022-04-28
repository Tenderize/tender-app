import { FC } from "react";
import { Box } from "grommet";
import { useRouter } from "next/router";
import { constants } from "ethers";
import { ChainId, Config, DAppProvider, useEthers, ArbitrumRinkeby, Rinkeby } from "@usedapp/core";
import { stakers, Foot } from "@tender/shared/src/index";
import Navbar from "../../components/nav";
import { NotificationsList } from "../../components/transactions";
import { TenderizeConfig } from "types";
import SwapPanel from "components/swap/SwapPanel";

const Token: FC = () => {
  const router = useRouter();
  const protocolName = router.query.slug as string;

  let { account } = useEthers();
  account = account ?? constants.AddressZero;
  //   const tokenBalance = useTokenBalance(addresses[protocolName].token, account) || constants.Zero;
  //   const tenderBalance = useTokenBalance(addresses[protocolName].tenderToken, account) || constants.Zero;
  //   const lpTokenBalance = useTokenBalance(addresses[protocolName].lpToken, account) || constants.Zero;

  return (
    <Box flex width="100vw" align="center" alignSelf="start">
      <SwapPanel protocolName={protocolName} account={account} />
    </Box>
  );
};

const TokenWrapper: FC<{ config?: TenderizeConfig }> = (props) => {
  const dappConfig: Config = {
    pollingInterval: 2500,
    readOnlyUrls: props.config?.chainUrlMapping,
  };

  if (props.config == null) return null;

  return (
    <DAppProvider config={dappConfig}>
      <NotificationsList />
      <Box style={{ minHeight: "100%" }}>
        <Navbar config={props.config} />
        <Token />
        <Foot />
      </Box>
    </DAppProvider>
  );
};

export const getStaticProps = async () => {
  const CHAIN_URL_MAPPING = {
    [ChainId.Rinkeby]: process.env.RPC_ETHEREUM_RINKEBY ?? "",
    [ChainId.ArbitrumRinkeby]: process.env.RPC_ARBITRUM_RINKEBY ?? "",
  };

  const config: TenderizeConfig = {
    portisApiKey: process.env.PORTIS_API_KEY ?? "",
    chainUrlMapping: CHAIN_URL_MAPPING ?? "",
    supportedChains: [ArbitrumRinkeby.chainId, Rinkeby.chainId],
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
