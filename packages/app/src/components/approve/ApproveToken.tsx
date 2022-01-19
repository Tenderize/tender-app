import { FC } from "react";
import { constants, Contract } from "ethers";
import { Box, Button, Tip, Text } from "grommet";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { useContractFunction } from "../../utils/useDappPatch";
import { useForceRinkebyFunction } from "../../utils/forceChainIdOnCall";

type Props = {
  symbol: string;
  show: boolean;
  spender: string;
  token: Contract;
};

const ApproveToken: FC<Props> = ({ symbol, spender, show, token }) => {
  const { state: approveTx, send: approveToken } = useContractFunction(token, "approve", {
    transactionName: `Approve ${symbol}`,
  });

  // const { rinkebyForcedFunction: handleApproval, renderError } = useForceRinkebyFunction(async (e) => {
  //   e.preventDefault();

  //   if (show) {
  //     await approveToken(spender, constants.MaxUint256);
  //   }
  // });

  const handleApproval = async (e: any) => {
    e.preventDefault();
    await approveToken(spender, constants.MaxUint256);
  };

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
              {approveTx.status === "Mining" && <LoadingButtonContent />}
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
      {/* {renderError()} */}
    </>
  );
};

export default ApproveToken;
