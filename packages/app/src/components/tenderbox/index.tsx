import { FC } from "react";
import styled from "styled-components";

import { Box, BoxExtendedProps } from "grommet";

const BlurryBox = styled(Box)`
  position: relative;
  background: rgba(38, 37, 40, 0.2);
  border-radius: 5rem;
  box-shadow: inset 0rem 6.4rem 10rem rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(1rem);
  /* Note: backdrop-filter has minimal browser support */
`;

const TenderBox: FC<BoxExtendedProps> = (props) => {
  return (
    <BlurryBox {...props}>
      <img
        alt="hammer logo"
        src={"/hammer-neon.svg"}
        style={{
          position: "absolute",
          top: "-100px",
          left: "-60px",
          height: "300px",
          transform: "rotate(35deg)",
        }}
      />
      <img
        alt="steak logo"
        src={"/meat-neon.svg"}
        style={{
          position: "absolute",
          right: "-80px",
          bottom: "-30px",
          width: "200px",
        }}
      />
      <Box
        height={props.height}
        width={props.width}
        fill
        style={{ overflow: "hidden !important", borderRadius: "50px" }}
      >
        {props.children}
      </Box>
    </BlurryBox>
  );
};

export default TenderBox;
