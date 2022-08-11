import Link from "next/link";
import { FC, useCallback } from "react";
import styled from "styled-components";

export const ScrollIndicator: FC<{
  count: number;
  active: number;
  direction: "row" | "column";
}> = ({ count, active, direction }) => {
  const renderDots = useCallback(() => {
    return Array(count)
      .fill(0)
      .map((_v, index) => {
        const isActive = index === active;
        return (
          <div key={index}>
            <Link href={getHref(index)} passHref>
              <Bubble
                style={{
                  background: isActive ? "transparent" : "grey",
                  borderColor: isActive ? "grey" : "transparent",
                }}
              />
            </Link>
          </div>
        );
      });
  }, [count, active]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        position: "absolute",
        bottom: 40,
        left: direction === "row" ? "calc(50vw - 1.8rem)" : undefined,
        right: direction === "column" ? "2rem" : undefined,
        top: direction === "column" ? "40%" : undefined,
      }}
    >
      {renderDots()}
    </div>
  );
};

const getHref = (index: number) => {
  switch (index) {
    case 0: {
      return "#intro";
    }
    case 1: {
      return "#deployments";
    }
    case 2: {
      return "#defi";
    }
    case 3: {
      return "#staking";
    }
    case 4: {
      return "#rewards";
    }
    case 5: {
      return "#lockups";
    }
    case 6: {
      return "#blog";
    }
    default: {
      return "#intro";
    }
  }
};

const Bubble = styled.a`
  display: inline-flex;
  width: 0.5rem;
  height: 0.5rem;
  opacity: 50%;
  border-radius: 50%;
  margin: 0.2rem;
  position: relative;
  border-width: 1px;
  border-style: solid;
`;
