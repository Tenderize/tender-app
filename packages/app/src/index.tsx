import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainId, DAppProvider, Config } from '@usedapp/core'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const dappConfig: Config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: 'http://127.0.0.1:8545',
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
