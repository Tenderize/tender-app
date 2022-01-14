import { ChainId } from "@usedapp/core";
import { ApolloClient, InMemoryCache } from "@apollo/client";

process.env.ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
  ? process.env.ETHERSCAN_API_KEY
  : "AYVQKI2AW5TZCHII5KIVB5N6QQIY1MM1Y9";

const RPC_URL = process.env.JSON_RPC || "https://rinkeby.infura.io/v3/9d822ed085d346b1aa4c67cd078d12cf";
const FORTMATIC_API_KEY = process.env.FORTMATIC_API_KEY || "pk_test_977BD3C1FDE24BCD";
const PORTIS_API_KEY = process.env.PORTIS_API_KEY || "5c66f40b-9133-45cd-8190-3e6169db7918";

const CHAIN_URL_MAPPING = {
  [ChainId.Rinkeby]: RPC_URL,
};

export const apolloClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize-staging",
  cache: new InMemoryCache(),
});

export const Config = {
  RPC_URL,
  FORTMATIC_API_KEY,
  PORTIS_API_KEY,
  CHAIN_URL_MAPPING,
};
