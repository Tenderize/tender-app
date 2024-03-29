import { FC } from "react";
import { constants } from "ethers";
import { Box, Button, Tip, Text } from "grommet";
import { useContractFunction } from "@usedapp/core";
import { useEnsureChain } from "utils/useEnsureRinkebyConnect";
import { LoadingButtonContent } from "components/LoadingButtonContent";
import { isPendingTransaction } from "utils/transactions";
import { ERC20 } from "@tender/contracts/gen/types";

type Props = {
  symbol: string;
  show: boolean;
  spender: string;
  token: ERC20;
  chainId: number;
};

const ApproveToken: FC<Props> = ({ symbol, spender, show, token, chainId }) => {
  const { state: approveTx, send: approveToken } = useContractFunction(token, "approve", {
    transactionName: `Approve ${symbol}`,
  });

  const { chainForcedFunction: handleApproval, renderError } = useEnsureChain(async (e) => {
    e.preventDefault();

    if (show) {
      await approveToken(spender, constants.MaxUint256);
    }
  }, chainId);

  if (!show) {
    return <></>;
  }

  return (
    <>
      <Button
        secondary
        gap="medium"
        fill="horizontal"
        onClick={handleApproval}
        disabled={approveTx.status !== "None" && approveTx.status !== "Success" && approveTx.status !== "Exception"}
        label={
          <>
            <Box justify="center" align="center" direction="row" gap="small" pad={{ horizontal: "xsmall" }}>
              {isPendingTransaction(approveTx) && <LoadingButtonContent />}
              <Text weight="normal">Allow Tenderize to spend {symbol}</Text>
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
                >
                  &#8505;
                </span>
              </Tip>
            </Box>
          </>
        }
      />
      {renderError()}
    </>
  );
};

export default ApproveToken;
