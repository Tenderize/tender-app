import { FC } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";

import TestnetBanner from "./components/testnet-banner";
import Home from "./pages/home";
import Token from "./pages/token";
import { NotificationsList } from "./components/transactions";

// a theme with custom spacing and font sizes
const customTheme = {
  colors: {
    // text: "", // sets color for text
    primary: "#4E66DE", // sets primary color
    white: "#fff",
  },
};

const App: FC = () => {
  return (
    <>
        <TestnetBanner />
        <NotificationsList />
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/stakers/:id" component={Token} />
          </Switch>
        </Router>
    </>
  );
};

export default App;
