import { FC, MouseEventHandler } from "react";
import { Alert, Tooltip, OverlayTrigger } from "react-bootstrap";
import { constants } from "ethers";
import { addresses } from "@tender/contracts";
import { BigNumber } from "@ethersproject/bignumber";

type Props = {
  protocolName: string;
  tokenSymbol: string;
  isTokenAuthorized: boolean;
  approveToken: (contract: string, amount: BigNumber) => Promise<void>;
};

const AuthorizeToken: FC<Props> = ({ tokenSymbol, protocolName, approveToken, isTokenAuthorized }) => {
  const handlePressTrade: MouseEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();

    if (!isTokenAuthorized) {
      await approveToken(addresses[protocolName].swap, constants.MaxUint256);
      //  setIsTokenAuthorized(true);
    }
  };

  return (
    <Alert
      style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}
      onClick={handlePressTrade}
      show={!isTokenAuthorized}
      variant={"primary"}
    >
      Allow the Tenderize Protocol to use your {tokenSymbol}
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id="button-tooltip-2">
            You must give the Tenderize smart contracts permission to use your {tokenSymbol}. You only have to do this
            once per token.
          </Tooltip>
        }
      >
        {({ ref, ...triggerHandler }) => (
          <Alert.Link ref={ref} {...triggerHandler} className="d-inline-flex align-items-center">
            <span className="ms-1"> &#8505;</span>
          </Alert.Link>
        )}
      </OverlayTrigger>
    </Alert>
  );
};

export default AuthorizeToken;
