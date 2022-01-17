import { FC } from "react";
import Token from "./stakers/[slug]";
import { ChainId, Config, DAppProvider } from "@usedapp/core";
import { TenderizeConfig } from "types";

const Home: FC<{ config: TenderizeConfig }> = (props) => {
  const dappConfig: Config = {
    readOnlyChainId: ChainId.Rinkeby,
    readOnlyUrls: props.config.chainUrlMapping,
  };

  return (
    <DAppProvider config={dappConfig}>
      <Token config={props.config} />
    </DAppProvider>
  );
};

export const getStaticProps = async () => {
  const rpcUrl = process.env.JSON_RPC ?? "";
  const CHAIN_URL_MAPPING = {
    [ChainId.Rinkeby]: rpcUrl,
  };

  const config: TenderizeConfig = {
    rpcUrl,
    fortmaticApiKey: process.env.FORTMATIC_API_KEY ?? "",
    portisApiKey: process.env.PORTIS_API_KEY ?? "",
    chainUrlMapping: CHAIN_URL_MAPPING ?? "",
  };

  return {
    props: {
      config,
    },
  };
};

export default Home;
