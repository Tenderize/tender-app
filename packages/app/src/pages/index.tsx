import { FC } from "react";
import { Box, ResponsiveContext } from "grommet";
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
            scrollBehavior: "smooth",
          }}
        >
          <Box style={{ position: "absolute" }}>
            <Navbar />
          </Box>
          <ResponsiveContext.Consumer>
            {(size) => (
              <>
                <Intro
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  screenSize={size}
                />
                <Deployments
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  screenSize={size}
                />
                <EasyStaking
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  screenSize={size}
                />
                <ConnectWithDeFi
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  screenSize={size}
                />
                <AutomaticRewards />
                <NoLockups
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  screenSize={size}
                />
              </>
            )}
          </ResponsiveContext.Consumer>
        </div>
      </Box>
    </GrommetWrapper>
  );
};

export default Home;
