import { FC } from "react";
import styled from "styled-components";

type props = {
  fill: string;
}


export const SpinnerIcon: FC<props> = ({fill}) => {
  const Circle = styled.circle`
  fill: transparent;
  stroke: ${fill};
  stroke-linecap: round;
  stroke-dasharray: 280;
  stroke-dashoffset: 100;
  stroke-width: 8px;
`;
return (  <Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<Circle cx="50" cy="50" r="40" />
  </Svg>)
}


const Svg = styled.svg`
  animation: 1s linear infinite svg-animation;

  @keyframes svg-animation {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
`;


