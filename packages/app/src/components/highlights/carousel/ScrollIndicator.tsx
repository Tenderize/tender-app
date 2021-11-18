import { FC, useCallback } from "react";
import Link from "next/link";
import styled from "styled-components";

export const ScrollIndicator: FC<{
  count: number;
  active: number;
}> = ({ count, active }) => {
  const renderDots = useCallback(() => {
    return Array(count)
      .fill(0)
      .map((_v, index) => {
        const isActive = index === active;
        return (
          <Link key={index} href={`slide-${index}`} scroll={false}>
            <Bubble style={{ background: isActive ? "black" : "grey" }} />
          </Link>
        );
      });
  }, [count, active]);
  return <div style={{ position: "absolute", bottom: 90, left: "calc(50vw - 1.8rem)" }}>{renderDots()}</div>;
};

const Bubble = styled.a`
  display: inline-flex;
  width: 0.5rem;
  height: 0.5rem;
  opacity: 50%;
  border-radius: 50%;
  margin: 0.2rem;
  position: relative;
`;
