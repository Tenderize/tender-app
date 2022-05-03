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
    chainId: ChainId.Arbitrum,
    hasPermit: true,
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
    hasPermit: false,
  },
};
