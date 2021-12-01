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
            <Bubble
              style={{ background: isActive ? "transparent" : "grey", borderColor: isActive ? "grey" : "transparent" }}
            />
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
