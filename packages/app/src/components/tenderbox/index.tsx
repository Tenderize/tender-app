import { FC } from "react";
import styled from "styled-components";

import { Box, BoxExtendedProps } from "grommet";

const BlurryBox = styled(Box)`
  background: rgba(38, 37, 40, 0.2);
  border-radius: 50px;
  box-shadow: inset 0px 64px 100px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  /* Note: backdrop-filter has minimal browser support */
`;

const meat = require("../../images/meat.svg");
const hammer = require("../../images/hammer2.svg");

const TenderBox: FC<BoxExtendedProps> = (props) => {
  return (
    <BlurryBox {...props}>
      <img
        alt="hammer logo"
        src={hammer.default}
        style={{
          position: "absolute",
          top: "-100px",
          left: "-80px",
          height: "300px",
          transform: "rotate(20deg)",
        }}
      />
      <img
        alt="steak logo"
        src={meat.default}
        style={{
          position: "absolute",
          right: "-100px",
          bottom: "-50px",
          width: "220px",
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
