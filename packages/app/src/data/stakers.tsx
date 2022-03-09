import { ChainId } from "@usedapp/core";

export type Staker = {
  name: string;
  subgraphId: string;
  title: string;
  available: boolean;
  apy: number;
  logo: string;
  bwLogo: string;
  bwTenderLogo: string;
  neonLogo: string;
  path: string;
  symbol: string;
  chainId: ChainId;
  hasPermit: boolean;
};

const stakers: Record<string, Staker> = {
  livepeer: {
    name: "livepeer",
    path: "/stakers/livepeer",
    title: "Livepeer",
    subgraphId: "Livepeer2",
    available: true,
    apy: 23.3,
    logo: "livepeer.svg",
    bwLogo: "LPT.svg",
    bwTenderLogo: "tenderLPT.svg",
    neonLogo: "landing/neon-lpt.png",
    symbol: "LPT",
    chainId: ChainId.ArbitrumRinkeby,
    hasPermit: true,
  },
  graph: {
    name: "graph",
    path: "/stakers/graph",
    title: "The Graph",
    subgraphId: "Graph2",
    available: true,
    apy: 6.5,
    logo: "graph.svg",
    bwLogo: "GRT.svg",
    bwTenderLogo: "tenderGRT.svg",
    neonLogo: "landing/neon-grt.png",
    symbol: "GRT",
    chainId: ChainId.Rinkeby,
    hasPermit: false,
  },
  matic: {
    name: "matic",
    path: "/stakers/matic",
    title: "Polygon",
    subgraphId: "Matic",
    available: true,
    apy: 14.8,
    logo: "maticLogo.svg",
    bwLogo: "MATIC.svg",
    bwTenderLogo: "tenderMATIC.svg",
    neonLogo: "landing/neon-matic.png",
    symbol: "MATIC",
    chainId: ChainId.Rinkeby,
    hasPermit: false,
  },
  audius: {
    name: "audius",
    path: "/stakers/audius",
    title: "Audius",
    subgraphId: "Audius2",
    available: true,
    apy: 14.8,
    logo: "AUDIO.svg",
    bwLogo: "AUDIO.svg",
    bwTenderLogo: "tenderAUDIO.svg",
    neonLogo: "landing/neon-audio.png",
    symbol: "AUDIO",
    chainId: ChainId.Rinkeby,
    hasPermit: false,
  },
};

export default stakers;
