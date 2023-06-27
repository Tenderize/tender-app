import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink, NormalizedCacheObject } from "@apollo/client";
import { ChainId } from "@usedapp/core";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";

const ENDPOINTS: Endpoints = {
  [ChainId.Arbitrum]: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/Gr4Kn4E1CwNbjBxFXdnKEunAGrC4d714TFMPw4NbmbPk`,
  [ChainId.Mainnet]: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/2x67A1XaRrMBMcYaPE6JbJEUnrtadx3HznbbGEFJtN2u`,
  [ChainId.Hardhat]: "http://127.0.0.1:8000/subgraphs/name/tenderize/tenderize-localhost",
};

interface Endpoints {
  [chainId: string]: string;
}

export const Subgraph = (endPoints: Endpoints): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    link: ApolloLink.from([
      new MultiAPILink({
        endpoints: endPoints,
        httpSuffix: "",
        createHttpLink: () => createHttpLink(),
      }),
    ]),
    cache: new InMemoryCache(),
  });
}

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
