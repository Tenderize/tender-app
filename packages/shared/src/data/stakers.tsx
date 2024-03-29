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
  symbol: "LPT" | "GRT" | "MATIC" | "AUDIO";
  chainId: ChainId;
  hasPermit: boolean;
  apy: string;
  tvl: number;
};

export type ProtocolName = Staker["name"];

export const isProduction = () => {
  return process.env.NEXT_PUBLIC_BUILD_ENV === "prod";
};

export const stakers: Record<ProtocolName, Staker> = {
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
    chainId: ChainId.Arbitrum,
    hasPermit: true,
    apy: "0",
    tvl: 0,
  },
  graph: {
    name: "graph",
    path: "/stakers/graph",
    title: "The Graph",
    subgraphId: "Graph",
    available: true,
    logo: "graph.svg",
    bwLogo: "GRT.svg",
    bwTenderLogo: "tenderGRT.svg",
    neonLogo: "landing/neon-grt.png",
    symbol: "GRT",
    chainId: ChainId.Mainnet,
    hasPermit: false,
    apy: "0",
    tvl: 0,
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
    chainId: ChainId.Mainnet,
    hasPermit: false,
    apy: "0",
    tvl: 0,
  },
  audius: {
    name: "audius",
    path: "/stakers/audius",
    title: "Audius",
    subgraphId: "Audius",
    available: true,
    logo: "AUDIO.svg",
    bwLogo: "AUDIO.svg",
    bwTenderLogo: "tenderAUDIO.svg",
    neonLogo: "landing/neon-audio.png",
    symbol: "AUDIO",
    chainId: ChainId.Mainnet,
    hasPermit: true,
    apy: "0",
    tvl: 0,
  },
};
