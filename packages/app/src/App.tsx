import { FC } from "react";
import { Route, Switch } from "react-router";
import { Box, Grid } from "grommet";
import { BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/home";
import Token from "./pages/token";
import { NotificationsList } from "./components/transactions";
import Foot from "./components/footer";
import Navbar from "./components/nav";

const App: FC = () => {
  return (
    <Router>
      <Grid height={{ min: "100vh" }} rows={["xsmall", "1fr"]}>
        <Navbar />
        <Grid rows={["1fr", "auto"]}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/stakers/:id" component={Token} />
          </Switch>
          <Foot />
        </Grid>
      </Grid>
      <NotificationsList />
    </Router>
  );
};

export default App;
