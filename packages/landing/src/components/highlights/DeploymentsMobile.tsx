import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import TokenCardMobile from "../token-card/TokenCardMobile";
import { useAPYData } from "./hooks";

export const DeploymentsMobile: FC = () => {
  const { graph, livepeer, audius, matic } = useAPYData();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
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
        Liquid staking derivatives pegged 1:1 to your staked assets
      </Paragraph>
      <Paragraph textAlign="center" margin={{ vertical: "small", horizontal: "medium" }} size="medium">
        Your TenderToken balance will increase as Tenderize earns staking rewards so you earn yield simply by holding
        them.
      </Paragraph>
      <Box direction="column" pad={{ top: "large" }} gap="medium">
        <TokenCardMobile key={graph.path} {...graph} />
        <TokenCardMobile key={livepeer.path} {...livepeer} />
        <TokenCardMobile key={audius.path} {...audius} />
        <TokenCardMobile key={matic.path} {...matic} />
      </Box>
    </div>
  );
};
