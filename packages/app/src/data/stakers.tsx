export type Staker = {
  description: string;
  stakerAddress: string;
  title: string;
  available: boolean;
  apy: number;
  logo: string;
  bwLogo: string;
  bwTenderLogo: string;
  path: string;
  symbol: string;
};

const stakers: Record<string, Staker> = {
  "/stakers/livepeer": {
    path: "/stakers/livepeer",
    title: "Livepeer",
    description:
      "The Livepeer project aims to deliver a live video streaming network protocol that is fully decentralized, highly scalable, crypto token incentivized, and results in a solution which can serve as the live media layer in the decentralized development (web3) stack. In addition, Livepeer is meant to provide an economically efficient alternative to centralized broadcasting solutions for any existing broadcaster. In this document we describe the Livepeer Protocol - a delegated stake based protocol for incentivizing participants in a live video broadcast network in a game-theoretically secure way.",
    stakerAddress: "0xe10101d8E0cDAbD40Ac6C6637C1eC8A11470FFfc",
    available: true,
    apy: 23.3,
    logo: "livepeer.svg",
    bwLogo: "LPT.svg",
    bwTenderLogo: "tenderLPT.svg",
    symbol: "LPT",
  },
  "/stakers/graph": {
    path: "/stakers/graph",
    title: "The Graph",
    description:
      "The Graph is an indexing protocol for querying networks like Ethereum and IPFS. Anyone can build and publish open APIs, called subgraphs, making data easily accessible.",
    stakerAddress: "",
    available: false,
    apy: 6.5,
    logo: "graph.svg",
    bwLogo: "GRT.svg",
    bwTenderLogo: "tenderGRT.svg",
    symbol: "GRT",
  },
};

export default stakers;
