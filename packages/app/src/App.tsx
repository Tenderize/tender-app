import { FC } from "react";
import { Route, Switch } from "react-router";
import { Grid } from "grommet";
import { BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/home";
import Token from "./pages/token";
import Foot from "./components/footer";

const App: FC = () => {
  return (
    <Router>
      <Grid height={{ min: "100vh" }} rows={["1fr", "auto"]}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/stakers/:id" component={Token} />
        </Switch>
        <Foot />
      </Grid>
    </Router>
  );
};

export default App;
