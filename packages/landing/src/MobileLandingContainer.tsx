import { Foot } from "@tender/shared/src/index";
import { Main } from "grommet";
import { Carousel } from "./components/highlights/carousel/Carousel";
import { DeploymentsMobile } from "./components/highlights/DeploymentsMobile";
import { IntroMobile } from "./components/highlights/IntroMobile";
import { MobileBlogContainer } from "./components/medium/MobileBlogContainer";

import { MobileHeader } from "./components/MobileHeader";

const MobileLandingContainer = () => (
  <div
    style={{
      display: "flex",
      flex: 1,
      flexDirection: "column",
      overflowX: "hidden",
    }}
  >
    <MobileHeader />
    <Main overflow="hidden">
      <IntroMobile />
      <DeploymentsMobile />
      <Carousel />
      <MobileBlogContainer />
    </Main>
    <Foot />
  </div>
);

export default MobileLandingContainer;
