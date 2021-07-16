import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { grommet, Grommet } from "grommet";
import { ChainId, DAppProvider, Config } from "@usedapp/core";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { deepMerge } from "grommet/utils";

import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";

process.env.ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
  ? process.env.ETHERSCAN_API_KEY
  : "AYVQKI2AW5TZCHII5KIVB5N6QQIY1MM1Y9";

// https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a&apikey=YourApiKeyToken

const dappConfig: Config = {
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Rinkeby]: process.env.JSON_RPC || "https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53",
  },
};

const customTheme = deepMerge(grommet, {
  global: {
    font: {
      color: "white",
      family: "IBM Plex Mono"
    }
  }
});


ReactDOM.render(
  <StrictMode>
    <DAppProvider config={dappConfig}>
      <Grommet full={true} style={{background: "url('background.svg')", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundAttachment: "fixed"}} theme={customTheme}>
        <App />
      </Grommet>
    </DAppProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
