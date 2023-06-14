import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink } from "@apollo/client";
import { ChainId } from "@usedapp/core";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";

const ENDPOINTS: Endpoints = {
  [ChainId.Arbitrum]: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/tenderize-arbitrum`,
  [ChainId.Mainnet]: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/tenderize-ethereum`,
  [ChainId.Hardhat]: "http://127.0.0.1:8000/subgraphs/name/tenderize/tenderize-localhost",
};

interface Endpoints {
  [chainId: string]: string;
}

export const Subgraph = new ApolloClient({
  connectToDevTools: true,
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: ENDPOINTS,
      httpSuffix: "",
      createHttpLink: () => createHttpLink(),
    }),
  ]),
  cache: new InMemoryCache(),
});

export const SubgraphForLanding = new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: ENDPOINTS,
      httpSuffix: "",
      createHttpLink: () => createHttpLink(),
    }),
  ]),
  cache: new InMemoryCache(),
});
