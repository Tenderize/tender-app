import { FC, lazy, Suspense } from "react";
import { GrommetWrapper } from "../../../shared/src/index";
import { useIsTouchDevice } from "../utils/useIsTouchDevice";

const MobileComponent = lazy(() => import("./MobileLandingContainer"));
const DesktopComponent = lazy(() => import("./DesktopLandingContainer"));

const Home: FC = () => {
  const isTouchDevice = useIsTouchDevice();

  return (
    <GrommetWrapper
      style={{
        background: "#0B0C0F",
      }}
    >
      <Suspense fallback={null}>{isTouchDevice ? <MobileComponent /> : <DesktopComponent />}</Suspense>
    </GrommetWrapper>
  );
};

export default Home;
