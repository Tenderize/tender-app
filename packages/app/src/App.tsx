import { FC } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { Grid } from "grommet";

import TestnetBanner from "./components/testnet-banner";
import Home from "./pages/home";
import Token from "./pages/token";
import { NotificationsList } from "./components/transactions";
import Foot from "./components/footer";

const App: FC = () => {
  return (
    <>
      <Grid height="100vh" rows={["auto", "1fr", "auto"]}>
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
