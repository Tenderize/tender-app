import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainId, DAppProvider, Config } from '@usedapp/core'


import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

process.env.ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : "AYVQKI2AW5TZCHII5KIVB5N6QQIY1MM1Y9"

const dappConfig: Config = {
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Rinkeby]: process.env.JSON_RPC || "https://rinkeby.infura.io/v3/42a353682886462f9f7b6b602f577a53",
  },
}

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={dappConfig}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
