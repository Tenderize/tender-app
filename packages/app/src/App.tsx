import { FC } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";

import TestnetBanner from "./components/testnet-banner";
import Home from "./pages/home";
import Token from "./pages/token";
import { NotificationsList } from "./components/transactions";
import Foot from './components/footer'
import {Grid, Box} from 'grommet'
const App: FC = () => {
  return (
    <>
      <Grid fill rows={["xxsmall", "flex", "xxsmall"]}>
        <TestnetBanner />
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/stakers/:id" component={Token} />
          </Switch>
        </Router>
        <Foot />
      </Grid>
      <NotificationsList />
    </>
  );
};

export default App;
