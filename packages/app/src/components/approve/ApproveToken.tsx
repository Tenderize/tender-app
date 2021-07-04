import { FC, MouseEventHandler } from "react";
import { Button, Container, Tooltip, OverlayTrigger, Spinner } from "react-bootstrap";
import { constants, Contract } from "ethers";
import { addresses } from "@tender/contracts";
import { useContractFunction } from "@usedapp/core";

type Props = {
  protocolName: string;
  tokenSymbol: string;
  isTokenApproved: boolean;
  tokenAddress: Contract;
};

const ApproveToken: FC<Props> = ({ tokenSymbol, protocolName, isTokenApproved, tokenAddress }) => {
  const { state: approveTx, send: approveToken } = useContractFunction(tokenAddress, "approve");

  const handleApproval: MouseEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();

    if (!isTokenApproved) {
      await approveToken(addresses[protocolName].swap, constants.MaxUint256);
    }
  };

  return (
    <>
      {!isTokenApproved && (
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
              Allow the Tenderize Protocol to use your {tokenSymbol}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="button-tooltip-2">
                    You must give the Tenderize smart contracts permission to use your {tokenSymbol}. You only have to
                    do this once per token.
                  </Tooltip>
                }
              >
                {({ ref, ...triggerHandler }) => (
                  <span ref={ref} {...triggerHandler} className="ms-1">
                    &#8505;
                  </span>
                )}
              </OverlayTrigger>
            </>
          )}
        </Button>
      )}
    </>
  );
};

export default ApproveToken;
