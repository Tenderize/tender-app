import { FC, MouseEventHandler } from "react";
import { BigNumberish, constants, Contract } from "ethers";
import { useContractFunction } from "@usedapp/core";
import { Box, Button, Tip, Spinner, Text } from "grommet";

type Props = {
  symbol: string;
  hasAllowance: boolean;
  spender: string;
  token: Contract;
  amount?: BigNumberish;
};

const ApproveToken: FC<Props> = ({ symbol, spender, hasAllowance, token, amount }) => {
  const { state: approveTx, send: approveToken } = useContractFunction(token, "approve", {
    transactionName: `Approve ${symbol}`,
  });

  const handleApproval: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (!hasAllowance) {
      await approveToken(spender, amount ?? constants.MaxUint256);
    }
  };

  if (hasAllowance) {
    return <></>;
  }

  return (
    <Button
      secondary
      gap="medium"
      fill="horizontal"
      onClick={handleApproval}
      disabled={approveTx.status !== "None" && approveTx.status !== "Success"}
      label={
        <>
          {approveTx.status !== "None" && approveTx.status !== "Success" ? (
            <Spinner color="white" />
          ) : (
            <Box justify="center" align="center" direction="row" gap="medium">
              <Text>Allow Tenderize to use your {symbol}</Text>
              <Tip
                plain
                dropProps={{
                  round: {
                    size: "20px",
                  },
                  background: "rgba(0,0,0,0.4)",
                  elevation: "none",
                }}
                content={
                  <Box width="medium" elevation="none" pad="medium">
                    <Text color="white">
                      You must give the Tenderize smart contracts permission to use your {symbol}. You only have to do
                      this once per token.
                    </Text>
                  </Box>
                }
              >
                <span
                  style={{ border: "1px solid white", borderRadius: "50%", paddingLeft: "5px", paddingRight: "5px" }}
                  className="ms-1"
                >
                  &#8505;
                </span>
              </Tip>
            </Box>
          )}
        </>
      }
    />
  );
};

export default ApproveToken;
