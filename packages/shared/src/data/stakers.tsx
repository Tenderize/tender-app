import { ChainId } from "@usedapp/core";

export type Staker = {
  name: "graph";
  subgraphId: string;
  title: string;
  available: boolean;
  logo: string;
  bwLogo: string;
  bwTenderLogo: string;
  neonLogo: string;
  path: string;
  symbol: "GRT";
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
    chainId: ChainId.Goerli,
    hasPermit: false,
    apy: "0",
    tvl: 0,
  },
};
