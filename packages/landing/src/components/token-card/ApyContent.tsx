import { Text } from "grommet";
import { FC } from "react";

export const ApyContent: FC<{ available: boolean; apy: string }> = ({ available, apy }) => {
  const [apyWhole, apyFraction] = apy.split(".");
  return (
    <>
      {available ? (
        <Text size="large" weight="bold">
          <Text size="xxlarge">{apyWhole}</Text>
          <Text size="medium">.{apyFraction}</Text>
          <Text size="medium">%</Text>
          <Text style={{ opacity: 0.5 }} size="small">
            &nbsp;APY
          </Text>
        </Text>
      ) : (
        <>
          <Text size="medium">Coming Soon</Text>
          <Text size="large" weight="bold">
            &nbsp;
          </Text>
        </>
      )}
    </>
  );
};
