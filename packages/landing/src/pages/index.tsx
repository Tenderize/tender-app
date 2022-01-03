import { FC } from "react";
import { GrommetWrapper, useIsTouchDevice } from "@tender/shared/src/index";
import dynamic from "next/dynamic";

const MobileComponent = dynamic(() => import("./MobileLandingContainer"));
const DesktopComponent = dynamic(() => import("./DesktopLandingContainer"));

const Home: FC = () => {
  const isTouchDevice = useIsTouchDevice();

  return (
    <GrommetWrapper
      style={{
        background: "#0B0C0F",
      }}
    >
      {isTouchDevice ? <MobileComponent /> : <DesktopComponent />}
    </GrommetWrapper>
  );
};

export default Home;
