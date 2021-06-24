import { FC, useEffect } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { BaseStyles, theme } from "rimble-ui";
import { ThemeProvider } from "styled-components";

import Background from "./components/background";
import TestnetBanner from "./components/testnet-banner";
import Home from "./pages/home";
import Token from "./pages/token";
import Nav from "./components/nav";
import "./App.scss";

// a theme with custom spacing and font sizes
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors, // keeps existing colors
    // text: "", // sets color for text
    background: "#F0F1F5", // sets color for background
    primary: "#4E66DE", // sets primary color
    white: "#fff",
  },
};

const App: FC = () => {
  const b = 4;

  useEffect(() => {
    console.log(b);
  }, []);

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <BaseStyles>
          <Background />
          <TestnetBanner />
          <Router>
            <Nav />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/stakers/:id" component={Token} />
            </Switch>
          </Router>
        </BaseStyles>
      </ThemeProvider>
    </>
  );
};

export default App;
