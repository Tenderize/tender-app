import { ApolloClient, InMemoryCache, ApolloClientOptions } from "@apollo/client";
import { ArbitrumRinkeby, Rinkeby } from "@usedapp/core";

process.env.ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
  ? process.env.ETHERSCAN_API_KEY
  : "AYVQKI2AW5TZCHII5KIVB5N6QQIY1MM1Y9";

const SubgraphRinkeby = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize-staging",
  cache: new InMemoryCache(),
});

const SubgraphArbitrumRinkekby = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize-arbitrum-staging",
  cache: new InMemoryCache(),
});

// https://api.thegraph.com/subgraphs/name/tenderize/tenderize-arbitrum-staging

export const Subgraph: Subgraph = {
  [Rinkeby.chainId]: SubgraphRinkeby,
  [ArbitrumRinkeby.chainId]: SubgraphArbitrumRinkekby,
};

export interface Subgraph {
  [chainId: number]: any;
}
