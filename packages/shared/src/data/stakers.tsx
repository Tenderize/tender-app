import { ChainId } from "@usedapp/core";

export type Staker = {
  name: "livepeer" | "graph" | "matic" | "audius";
  subgraphId: string;
  title: string;
  available: boolean;
  logo: string;
  bwLogo: string;
  bwTenderLogo: string;
  neonLogo: string;
  path: string;
  symbol: string;
  chainId: ChainId;
  hasPermit: boolean;
};

export const isProduction = () => {
  return process.env.NEXT_PUBLIC_BUILD_ENV === "prod" ? true : false;
};

const getChainId = (main: ChainId, test: ChainId) => {
  return isProduction() ? main : test;
};

export const stakers: Record<string, Staker> = {
  livepeer: {
    name: "livepeer",
    path: "/stakers/livepeer",
    title: "Livepeer",
    subgraphId: "Livepeer",
    available: true,
    logo: "livepeer.svg",
    bwLogo: "LPT.svg",
    bwTenderLogo: "tenderLPT.svg",
    neonLogo: "landing/neon-lpt.png",
    symbol: "LPT",
    chainId: getChainId(ChainId.Arbitrum, ChainId.ArbitrumRinkeby),
    hasPermit: true,
  },
  graph: {
    name: "graph",
    path: "/stakers/graph",
    title: "The Graph",
    subgraphId: "Graph",
    available: false,
    logo: "graph.svg",
    bwLogo: "GRT.svg",
    bwTenderLogo: "tenderGRT.svg",
    neonLogo: "landing/neon-grt.png",
    symbol: "GRT",
    chainId: getChainId(ChainId.Mainnet, ChainId.Rinkeby),
    hasPermit: false,
  },
  matic: {
    name: "matic",
    path: "/stakers/matic",
    title: "Polygon",
    subgraphId: "Matic",
    available: true,
    logo: "maticLogo.svg",
    bwLogo: "MATIC.svg",
    bwTenderLogo: "tenderMATIC.svg",
    neonLogo: "landing/neon-matic.png",
    symbol: "MATIC",
    chainId: getChainId(ChainId.Mainnet, ChainId.Rinkeby),
    hasPermit: false,
  },
  audius: {
    name: "audius",
    path: "/stakers/audius",
    title: "Audius",
    subgraphId: "Audius",
    available: false,
    logo: "AUDIO.svg",
    bwLogo: "AUDIO.svg",
    bwTenderLogo: "tenderAUDIO.svg",
    neonLogo: "landing/neon-audio.png",
    symbol: "AUDIO",
    chainId: getChainId(ChainId.Mainnet, ChainId.Rinkeby),
    hasPermit: false,
  },
};
