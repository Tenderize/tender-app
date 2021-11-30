import { Heading } from "grommet";
import { FC, useRef, useState } from "react";
import styled from "styled-components";
import { ScrollIndicator } from "./ScrollIndicator";
import { Slide } from "./Slide";

export const Carousel: FC = () => {
  const target = useRef<HTMLDivElement>();
  const [visibleIndex, setVisibleIndex] = useState(0);
  return (
    <div
      style={{
        width: "100vw",
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Slides ref={target}>
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="rewards"
          index={0}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Automatic Rewards</Heading>}
          body="Tenderize automatically compounds rewards on a regular basis and manages stake delegations to nodes according
          to profitability and long-term growth of the supported networks."
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="defi"
          index={1}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Connect with DeFi</Heading>}
          body="TenderTokens unleashes the combination of staked assets for use in DeFi protocols and lets you earn yield on
          top of yield. They provide a new financial primitive that unlocks a wide array of new use cases for your
          staked web3 tokens."
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="lockups"
          index={2}
          heading={<Heading style={{ textShadow: "0px 0px 8px rgba(237, 19, 32, 0.94)" }}>No Lockups</Heading>}
          body="Easily unlock your staked assets without going through long waiting periods. Simply Swap your TenderTokens for
          underlying assets using TenderSwap liquidity pools."
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="staking"
          index={3}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Easy Staking</Heading>}
          body="Tenderize creates a care-free staking experience. Simply deposit your tokens to earn rewards and watch your
          balance increase, allocations are managed by the Tenderize protocol."
        />
      </Slides>
      <ScrollIndicator count={4} active={visibleIndex} direction="row" />
    </div>
  );
};

const Slides = styled.div`
  display: flex;

  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;

  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;
