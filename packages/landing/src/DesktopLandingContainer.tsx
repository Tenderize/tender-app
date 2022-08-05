import { Subscribe } from "components/Subscribe";
import { ResponsiveContext } from "grommet";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { AutomaticRewards } from "./components/highlights/AutomaticRewards";
import { ScrollIndicator } from "./components/highlights/carousel/ScrollIndicator";
import { ConnectWithDeFi } from "./components/highlights/ConnectWithDeFi";
import { Deployments } from "./components/highlights/Deployments";
import { EasyStaking } from "./components/highlights/EasyStaking";
import { ScreenSize } from "./components/highlights/helper";
import { Intro } from "./components/highlights/Intro";
import { NoLockups } from "./components/highlights/NoLockups";
import { BlogContainer } from "./components/medium/BlogContainer";
import Navbar from "./components/nav";

const DesktopLandingContainer: FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const offset = scrollRef?.current?.scrollTop ?? 0;
    if (offset > 200) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef != null) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => currentRef?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div
        ref={scrollRef}
        style={{
          height: "100vh",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
      >
        <AnimatedNavbar scrolled={scrolled}>
          <Navbar />
        </AnimatedNavbar>
        <ResponsiveContext.Consumer>
          {(size: string) => (
            <>
              <Intro screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={0} />
              <Subscribe isMobile={false} />
              <Deployments screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={1} />
              <ConnectWithDeFi screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={2} />
              <EasyStaking screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={3} />
              <AutomaticRewards screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={4} />
              <NoLockups screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={5} />
              <BlogContainer screenSize={size as ScreenSize} setVisibleIndex={setVisibleIndex} index={6} />
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
        <ScrollIndicator count={7} active={visibleIndex} direction="column" />
      </div>
    </>
  );
};

const AnimatedNavbar = styled.div<{ scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${(props: any) => (props.scrolled ? "rgb(0,0,0, 0.3)" : undefined)};
  transition: background-color 0.25s ease 0s;
  transition: all 0.7s ease-in;
`;

export default DesktopLandingContainer;
