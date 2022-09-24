import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import TokenCardMobile from "../token-card/TokenCardMobile";
import { useAPYData, useTVLData } from "./hooks";

export const DeploymentsMobile: FC = () => {
  const { graph, livepeer, audius, matic } = useAPYData();
  const tvl = useTVLData();

  return (
    <div
      style={{
        width: "100vw",
        backgroundImage: `url("/landing/shad-deployments.jpg"), url('/landing/noise.png')`,
        backgroundBlendMode: "darken",
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "contain, 50px 50px",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading style={{ textShadow: "0px 0px 17px #AD01FF", zIndex: 1 }}>Tender Tokens</Heading>
      <Paragraph
        textAlign="center"
        margin={{ vertical: "small", horizontal: "medium" }}
        size="medium"
        style={{ fontWeight: 500 }}
      >
        Liquid staking tokens pegged 1:1 to your staked assets
      </Paragraph>
      <Paragraph textAlign="center" margin={{ vertical: "small", horizontal: "medium" }} size="medium">
        TenderTokens automatically compound staking rewards which reflects directly in your wallet
      </Paragraph>
      <Box direction="column" pad={{ top: "large" }} gap="large">
        <TokenCardMobile key={graph.path} {...graph} tvl={tvl.graph.tvl} />
        <TokenCardMobile key={livepeer.path} {...livepeer} tvl={tvl.livepeer.tvl} />
        <TokenCardMobile key={audius.path} {...audius} tvl={tvl.audius.tvl} />
        <TokenCardMobile key={matic.path} {...matic} tvl={tvl.matic.tvl} />
      </Box>
    </div>
  );
};
