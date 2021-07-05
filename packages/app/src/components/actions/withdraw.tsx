import { contracts, addresses } from "@tender/contracts";
import { useContractFunction } from "@usedapp/core";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { FC, useState } from "react";
import { Button, Input } from "rimble-ui";
import { Form, Spinner } from "react-bootstrap";

type Props = {
  name: string;
  symbol: string;
  tenderBalance: BigNumberish;
  tenderAllowance: BigNumberish;
};

const Withdraw: FC<Props> = ({ name, symbol, tenderBalance, tenderAllowance }) => {
  const [withdrawInput, setWithdrawInput] = useState("");

  const maxWithdraw = () => {
    setWithdrawInput(utils.formatEther(tenderBalance.toString()));
  };

  const handleInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setWithdrawInput(val);
  };

  const { state: withdrawTx, send: swap } = useContractFunction(contracts[name].swap, "swapExactAmountIn", {
    transactionName: `Swap t${symbol} for ${symbol}`,
  });

  const withdrawTokens = (e: any) => {
    e.preventDefault();
    swap(
      addresses[name].tenderToken,
      utils.parseEther(withdrawInput || "0"),
      addresses[name].token,
      constants.One,
      utils.parseEther("2")
    );
    console.log(withdrawTx);
  };

  const { state: approveTx, send: approve } = useContractFunction(contracts[name].tenderToken, "approve", {
    transactionName: `Approve t${symbol}`,
  });

  const approveTokens = (e: any) => {
    e.preventDefault();
    approve(addresses[name].swap, utils.parseEther(withdrawInput || "0"));
    console.log(approveTx);
  };

  return (
    <>
      <Form>
        <Form.Group controlId="formWithdraw">
          <Form.Label>Withdraw Amount</Form.Label>
          <Input
            width={1}
            value={withdrawInput}
            onChange={handleInputChange}
            type="text"
            placeholder={`0 tender${symbol}`}
            className="amount"
          />
          <Form.Text className="balance" onClick={maxWithdraw}>
            Current Balance: {`${utils.formatEther(tenderBalance?.toString() || "0")} tender${symbol}`}
          </Form.Text>
        </Form.Group>

        {!withdrawInput || BigNumber.from(tenderAllowance).gte(utils.parseEther(withdrawInput || "0")) ? (
          <Button
            disabled={!withdrawInput || withdrawInput.toString() === "0" || withdrawTx.status === "Mining"}
            style={{ width: "100%" }}
            onClick={withdrawTokens}
          >
            {withdrawTx.status === "Mining" ? (
              <>
                <Spinner animation="border" variant="white" />
                Withdrawing...
              </>
            ) : (
              "Withdraw"
            )}
          </Button>
        ) : (
          <Button
            disabled={!withdrawInput || withdrawInput.toString() === "0" || approveTx.status === "Mining"}
            style={{ width: "100%" }}
            onClick={approveTokens}
          >
            {approveTx.status === "Mining" ? (
              <>
                <Spinner aria-hidden="true" as="span" animation="border" variant="white"></Spinner>
                <span>Approving...</span>
              </>
            ) : (
              "Approve"
            )}
          </Button>
        )}
      </Form>
    </>
  );
};

export default Withdraw;
