import { FC, MouseEventHandler } from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { constants } from "ethers";
import { addresses } from "@tender/contracts";
import { BigNumber } from "@ethersproject/bignumber";

type Props = {
  protocolName: string;
  tokenSymbol: string;
  isTokenApproved: boolean;
  approveToken: (contract: string, amount: BigNumber) => Promise<void>;
};

const ApproveToken: FC<Props> = ({ tokenSymbol, protocolName, approveToken, isTokenApproved }) => {
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
          variant={"primary"}
        >
          Allow the Tenderize Protocol to use your {tokenSymbol}
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="button-tooltip-2">
                You must give the Tenderize smart contracts permission to use your {tokenSymbol}. You only have to do
                this once per token.
              </Tooltip>
            }
          >
            {({ ref, ...triggerHandler }) => (
              <span ref={ref} {...triggerHandler} className="ms-1">
                &#8505;
              </span>
            )}
          </OverlayTrigger>
        </Button>
      )}
    </>
  );
};

export default ApproveToken;
