import { ApolloClient, InMemoryCache } from "@apollo/client";

process.env.ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
  ? process.env.ETHERSCAN_API_KEY
  : "AYVQKI2AW5TZCHII5KIVB5N6QQIY1MM1Y9";

export const apolloClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize",
  cache: new InMemoryCache(),
});
