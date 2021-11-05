import { FC } from "react";
import { Box } from "grommet";
import { Intro } from "../components/highlights/Intro";
import { AutomaticRewards } from "../components/highlights/AutomaticRewards";
import { ConnectWithDeFi } from "../components/highlights/ConnectWithDeFi";
import { NoLockups } from "../components/highlights/NoLockups";
import { EasyStaking } from "../components/highlights/EasyStaking";
import Navbar from "../components/nav";
import { Deployments } from "../components/highlights/Deployments";
import { GrommetWrapper } from "../components/GrommetWrapper";

const Home: FC = () => {
  return (
    <GrommetWrapper
      style={{
        background: "#0B0C0F",
      }}
    >
      <Box>
        <div
          style={{
            height: "100vh",
            flexDirection: "column",
            scrollSnapType: "y mandatory",
            alignItems: "center",
            overflowY: "auto",
          }}
        >
          <Box style={{ position: "absolute" }}>
            <Navbar />
          </Box>
          <Intro />
          <Deployments />
          <EasyStaking />
          <ConnectWithDeFi />
          <AutomaticRewards />
          <NoLockups />
        </div>
      </Box>
    </GrommetWrapper>
  );
};

export default Home;
