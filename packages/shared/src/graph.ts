import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink } from "@apollo/client";
import { ChainId } from "@usedapp/core";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";

const ENDPOINTS: Endpoints = {
  [ChainId.Rinkeby]: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize-staging",
  [ChainId.ArbitrumRinkeby]: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize-arbitrum-staging",
  [ChainId.Arbitrum]: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize-arbitrum",
  [ChainId.Mainnet]: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize-ethereum",
};

interface Endpoints {
  [chainId: string]: string;
}

export const Subgraph = new ApolloClient({
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
