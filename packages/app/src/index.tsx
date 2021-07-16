import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Grommet, grommet } from "grommet";
import { ChainId, DAppProvider, Config } from "@usedapp/core";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { theme } from "./theme";
import {deepMerge} from 'grommet/utils'

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
    color: {
      brand: "#4E66DE"
    },
    font: {
      color: "white",
      family: "IBM Plex Mono"
    }
  },
  button: {
    primary: {
      background: "light-1",
      color: "brand",
      border: undefined,
      font: {
        weight: 700
      },
      padding: {
        horizontal: "12px",
        vertical: "6px"
      }
    },
    hover: {
      primary: {
        background: {
          color: "light-2"
        },
        color: "brand"
      },
      secondary: {
        border: {
          width: "3px"
        },
        padding: {
          horizontal: "9px",
          vertical: "3px"
        }
      }
    },
    active: {
      background: {
        color: "aliceblue"
      },
      color: "teal",
      secondary: {
        border: {
          color: "transparent"
        }
      }
    }
  }
});


ReactDOM.render(
  <StrictMode>
    <DAppProvider config={dappConfig}>
      <Grommet themeMode="dark" full={true} style={{background: "url('/background.svg')", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundAttachment: "fixed"}} theme={customTheme}>
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
