import { FC } from "react";
import styled from "styled-components";

import { Box, BoxExtendedProps, Image } from "grommet";

const BlurryBox = styled(Box)`
  display: flex;
  position: relative;
  background: rgba(38, 37, 40, 0.2);
  border-radius: 5rem;
  box-shadow: inset 0rem 6.4rem 10rem rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10rem);
  margin-top: 8rem;
  /* Note: backdrop-filter has minimal browser support */
`;

const TenderBox: FC<BoxExtendedProps> = (props) => {
  return (
    <BlurryBox {...props}>
      <Image
        alt="hammer logo"
        src={"/hammer-neon.svg"}
        style={{
          position: "absolute",
          top: "-120px",
          left: "-80px",
          height: "300px",
          transform: "rotate(35deg)",
        }}
      />
      <Image
        alt="steak logo"
        src={"/meat-neon.svg"}
        style={{
          position: "absolute",
          right: "-110px",
          bottom: "-50px",
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
