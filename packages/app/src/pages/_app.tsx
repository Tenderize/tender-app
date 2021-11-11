import { AppProps } from "next/app";
import Script from "next/script";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { ChainId, DAppProvider, Config } from "@usedapp/core";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";

import { apolloClient, CHAIN_URL_MAPPING } from "../config";
import * as gtag from "../lib/gtag";
import "./index.css";
import "../components/carousel/carousel.css";

import { GrommetWrapper } from "../components/GrommetWrapper";

const dappConfig: Config = {
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: CHAIN_URL_MAPPING,
};

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="description" content="Liquid staking and yield aggregation protocol, bridging Web3 And DeFi" />
      </Head>
      <ApolloProvider client={apolloClient}>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <DAppProvider config={dappConfig}>
          <GrommetWrapper
            style={{
              background: "url('/background.svg')",
            }}
          >
            <Component {...pageProps} />
          </GrommetWrapper>
        </DAppProvider>
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
