import React, { FC } from "react";
import { Heading, Image, Paragraph } from "grommet";

export const IntroMobile: FC = () => {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url("/landing/shad-intro.jpg"), url('/landing/noise.png')`,
          backgroundBlendMode: "darken",
          backgroundRepeat: "no-repeat, repeat",
          backgroundSize: "contain, 50px 50px",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "50vh",
            position: "relative",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              height: "400%",
              transformOrigin: "top",
              transform: "scale(0.25)",
            }}
            src={`/landing/mobile-intro.svg`}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Heading margin="small" style={{ textShadow: "0px 0px 17px #AD01FF" }}>
            Tenderize
          </Heading>
          <Paragraph margin="small">Connecting Web3 with</Paragraph>
          <Paragraph margin="none"> DeFi through</Paragraph>
          <Paragraph margin="small" style={{ fontWeight: 500 }}>
            Liquid Staking
          </Paragraph>
        </div>
      </div>
    </>
  );
};
