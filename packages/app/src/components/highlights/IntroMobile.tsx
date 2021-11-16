import { FC } from "react";
import { Heading, Paragraph } from "grommet";

export const IntroMobile: FC = () => {
  return (
    <div
      style={{
        scrollSnapAlign: "start",
        flexShrink: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url("/landing/shad-intro.jpg")`,
        // backgroundBlendMode: "darken",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
        <img
          style={{
            height: "400%",
            transformOrigin: "top",
            transform: "scale(0.25)",
          }}
          src={`/landing/mobile-intro.svg`}
        />
      </div>
      <Heading style={{ textShadow: "0px 0px 17px #AD01FF" }}>Tenderize</Heading>
      <Paragraph margin="small">The tastiest</Paragraph>
      <Paragraph margin="small"> liquid staking farming</Paragraph>
      <Paragraph margin="small"> money can buy.</Paragraph>
    </div>
  );
};
