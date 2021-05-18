import React from 'react';
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { BaseStyles, theme } from "rimble-ui";
import { ThemeProvider } from "styled-components";
import { Container } from "react-bootstrap";

import Background from "./components/background"
import Home from './pages/home'

import './App.scss';

 // a theme with custom spacing and font sizes
 const customTheme = {
  ...theme,
  colors: {
    ...theme.colors, // keeps existing colors
    //text: "", // sets color for text
    background: "#F0F1F5", // sets color for background
    primary: "#4E66DE", // sets primary color
    white: "#fff",
  },
};

function App() {
  return (
    <>
      <ThemeProvider theme={customTheme}>
      <BaseStyles>
        <Background />
          <Router>
              {/* <Nav
                address={this.state.address}
                cachedProvider={this.web3Modal.cachedProvider}
                onConnect={this.onConnect}
              /> */}
            <Switch>
              <Route exact path="/" component={Home}/>
              {/* <Route
                path="/stakers/:id"
                component={TokenPage}
              /> */}
            </Switch>
          </Router>
      </BaseStyles>
      </ThemeProvider>
    </>
  );
}

export default App;
