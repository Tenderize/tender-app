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
    subgraphId: "Livepeer",
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
    subgraphId: "Graph",
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
  // matic: {
  //   name: "matic",
  //   path: "/stakers/matic",
  //   title: "Polygon",
  //   subgraphId: "Matic",
  //   description:
  //     "Matic Network brings massive scale to Ethereum using an adapted version of Plasma with PoS based side chains. The Matic team a decentralized platform using an adapted version of Plasma framework that provides a solution for faster and extremely low-cost transactions with finality on the main chain. The system ensures liveliness using PoS checkpoints which are pushed to the Ethereum mainchain. This enables a single Matic sidechain to theoretically achieve 2 16 transactions per block, and possibly millions of transactions on multiple chains in the future.",
  //   available: true,
  //   apy: 14.8,
  //   logo: "maticLogo.svg",
  //   bwLogo: "MATIC.svg",
  //   bwTenderLogo: "tenderMATIC.svg",
  //   neonLogo: "landing/neon-matic.png",
  //   symbol: "MATIC",
  //   chainId: ChainId.Rinkeby,
  // },
  audius: {
    name: "audius",
    path: "/stakers/audius",
    title: "Audius",
    subgraphId: "Audius",
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
