import { Box, ResponsiveContext } from "grommet";
import { FC, useState } from "react";
import { AutomaticRewards } from "../components/highlights/AutomaticRewards";
import { ScrollIndicator } from "../components/highlights/carousel/ScrollIndicator";
import { ConnectWithDeFi } from "../components/highlights/ConnectWithDeFi";
import { Deployments } from "../components/highlights/Deployments";
import { EasyStaking } from "../components/highlights/EasyStaking";
import { ScreenSize } from "../components/highlights/helper";
import { Intro } from "../components/highlights/Intro";
import { NoLockups } from "../components/highlights/NoLockups";
import Navbar from "../components/nav";

const DesktopLandingContainer: FC = () => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  return (
    <>
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
          {(size: string) => (
            <>
              <Intro screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={0} />
              <Deployments screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={1} />
              <EasyStaking screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={2} />
              <ConnectWithDeFi screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={3} />
              <AutomaticRewards screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={4} />
              <NoLockups screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={5} />
            </>
          )}
        </ResponsiveContext.Consumer>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <ScrollIndicator count={6} active={visibleIndex} direction="column" />
      </div>
    </>
  );
};

export default DesktopLandingContainer;
