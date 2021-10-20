import { FC } from "react";
import { Box } from "grommet";
import { Intro } from "../components/highlights/Intro";
import { AutomaticRewards } from "../components/highlights/AutomaticRewards";
import { ConnectWithDeFi } from "../components/highlights/ConnectWithDeFi";
import { NoLockups } from "../components/highlights/NoLockups";
import { EasyStaking } from "../components/highlights/EasyStaking";
import Navbar from "../components/nav";

const Home: FC = () => {
  return (
    <Box>
      <Navbar />
      <Intro />
      <AutomaticRewards />
      <ConnectWithDeFi />
      <NoLockups />
      <EasyStaking />
    </Box>
  );
};

export default Home;
