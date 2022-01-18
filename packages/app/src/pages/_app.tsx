import { AppProps } from "next/app";
import { FC } from "react";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";

import { GrommetWrapper, apolloClient } from "@tender/shared/src/index";

import "./index.css";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  
  return (
    <>
      <Head>
        <title>Tenderize App</title>
        <meta name="description" content="Liquid staking and yield aggregation protocol, bridging Web3 And DeFi" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <GrommetWrapper
          style={{
            background: "url('/shad-defi.jpg')",
          }}
        >
          <Component {...pageProps} />
        </GrommetWrapper>
      </ApolloProvider>
    </>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
