import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Grommet } from "grommet";
import { ChainId, DAppProvider, Config } from "@usedapp/core";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { theme } from "./theme";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/tenderize/tenderize",
  cache: new InMemoryCache(),
});

process.env.ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
  ? process.env.ETHERSCAN_API_KEY
  : "AYVQKI2AW5TZCHII5KIVB5N6QQIY1MM1Y9";

const dappConfig: Config = {
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Rinkeby]: process.env.JSON_RPC || "https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53",
  },
};

ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <DAppProvider config={dappConfig}>
        <Grommet
          themeMode="dark"
          full={true}
          style={{
            background: "url('/background.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
          theme={theme}
        >
          <App />
        </Grommet>
      </DAppProvider>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
