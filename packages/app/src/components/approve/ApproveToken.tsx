import { FC, MouseEventHandler } from "react";
import { Button, Container, Tooltip, OverlayTrigger, Spinner } from "react-bootstrap";
import { BigNumberish, constants, Contract } from "ethers";
import { useContractFunction } from "@usedapp/core";

type Props = {
  symbol: string;
  hasAllowance: boolean;
  spender: string;
  token: Contract;
  amount?: BigNumberish;
};

const ApproveToken: FC<Props> = ({ symbol, spender, hasAllowance, token, amount }) => {
  const { state: approveTx, send: approveToken } = useContractFunction(token, "approve", {transactionName: `Approve ${symbol}`});

  const handleApproval: MouseEventHandler<HTMLDivElement> = async (e) => {
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
      style={{ display: "flex", justifyContent: "space-between" }}
      onClick={handleApproval}
      disabled={approveTx.status !== "None" && approveTx.status !== "Success"}
      variant={"primary"}
    >
      {approveTx.status !== "None" && approveTx.status !== "Success" ? (
        <Container className="align-items-center">
          <Spinner size="sm" animation="border" variant="light" />
        </Container>
      ) : (
        <>
          Allow the Tenderize Protocol to use your {symbol}
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="button-tooltip-2">
                You must give the Tenderize smart contracts permission to use your {symbol}. You only have to do this
                once per token.
              </Tooltip>
            }
          >
            {({ ref, ...triggerHandler }) => (
              <span style={{border: '1px solid white', borderRadius: '50%', paddingLeft: '5px', paddingRight: '5px'}} ref={ref} {...triggerHandler} className="ms-1">
                &#8505;
              </span>
            )}
          </OverlayTrigger>
        </>
      )}
    </Button>
  );
};

export default ApproveToken;
