export type Staker = {
  name: string;
  subgraphId: string;
  description: string;
  stakerAddress: string;
  title: string;
  available: boolean;
  apy: number;
  logo: string;
  bwLogo: string;
  bwTenderLogo: string;
  neonLogo: string;
  path: string;
  symbol: string;
};

const stakers: Record<string, Staker> = {
  livepeer: {
    name: "livepeer",
    path: "/stakers/livepeer",
    title: "Livepeer",
    subgraphId: "Livepeer",
    description:
      "The Livepeer project aims to deliver a live video streaming network protocol that is fully decentralized, highly scalable, crypto token incentivized, and results in a solution which can serve as the live media layer in the decentralized development (web3) stack. In addition, Livepeer is meant to provide an economically efficient alternative to centralized broadcasting solutions for any existing broadcaster. In this document we describe the Livepeer Protocol - a delegated stake based protocol for incentivizing participants in a live video broadcast network in a game-theoretically secure way.",
    stakerAddress: "0xe10101d8E0cDAbD40Ac6C6637C1eC8A11470FFfc",
    available: true,
    apy: 23.3,
    logo: "livepeer.svg",
    bwLogo: "LPT.svg",
    bwTenderLogo: "tenderLPT.svg",
    neonLogo: "landing/neon-lpt.png",
    symbol: "LPT",
  },
  graph: {
    name: "graph",
    path: "/stakers/graph",
    title: "The Graph",
    subgraphId: "Graph",
    description:
      "The Graph is an indexing protocol for querying networks like Ethereum and IPFS. Anyone can build and publish open APIs, called subgraphs, making data easily accessible.",
    stakerAddress: "",
    available: true,
    apy: 6.5,
    logo: "graph.svg",
    bwLogo: "GRT.svg",
    bwTenderLogo: "tenderGRT.svg",
    neonLogo: "landing/neon-grt.png",
    symbol: "GRT",
  },
  matic: {
    name: "matic",
    path: "/stakers/matic",
    title: "Polygon",
    subgraphId: "Matic",
    description:
      "Matic Network brings massive scale to Ethereum using an adapted version of Plasma with PoS based side chains. The Matic team a decentralized platform using an adapted version of Plasma framework that provides a solution for faster and extremely low-cost transactions with finality on the main chain. The system ensures liveliness using PoS checkpoints which are pushed to the Ethereum mainchain. This enables a single Matic sidechain to theoretically achieve 2 16 transactions per block, and possibly millions of transactions on multiple chains in the future.",
    stakerAddress: "",
    available: true,
    apy: 14.8,
    logo: "maticLogo.svg",
    bwLogo: "MATIC.svg",
    bwTenderLogo: "tenderMATIC.svg",
    neonLogo: "landing/neon-matic.png",
    symbol: "MATIC",
  },
  "/stakers/audius": {
    name: "audius",
    path: "/stakers/audius",
    title: "Audius",
    subgraphId: "Audius",
    description: "Audius is a brand-new streaming platform built for all musicians, not just those signed to labels.",
    stakerAddress: "",
    available: true,
    apy: 14.8,
    logo: "AUDIO.svg",
    bwLogo: "AUDIO.svg",
    bwTenderLogo: "tenderAUDIO.svg",
    neonLogo: "landing/neon-audio.png",
    symbol: "AUDIO",
  },
};

export default stakers;
