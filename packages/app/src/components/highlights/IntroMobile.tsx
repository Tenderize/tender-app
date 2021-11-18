import React, { FC } from "react";
import { Anchor, Heading, Paragraph } from "grommet";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const IntroMobile: FC = () => {
  return (
    <>
      <div style={{ alignSelf: "flex-end", paddingTop: "1rem" }}>
        <Anchor
          size="large"
          color="white"
          a11yTitle="Chat with us on Discord"
          href="https://discord.gg/WXR5VBttP5"
          icon={<FontAwesomeIcon icon={faDiscord} />}
          target="_blank"
          style={{ paddingLeft: 0 }}
        />
        <Anchor
          size="large"
          color="white"
          a11yTitle="Follow us on Twitter"
          href="https://twitter.com/tenderize_me"
          icon={<FontAwesomeIcon icon={faTwitter} />}
          target="_blank"
        />
      </div>
      <div
        style={{
          scrollSnapAlign: "start",
          flexShrink: 0,
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
          <img
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
          <Paragraph margin="small">The tastiest</Paragraph>
          <Paragraph margin="none"> liquid staking farming</Paragraph>
          <Paragraph margin="small"> money can buy.</Paragraph>
        </div>
      </div>
    </>
  );
};
