import { contracts, addresses } from "@tender/contracts";
import { useContractFunction } from "@usedapp/core";
import { BigNumber, BigNumberish, utils } from "ethers";
import { useState } from "react";
import { Button, Input } from "rimble-ui";
import { Form, Spinner } from "react-bootstrap";

type DepositInputs = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tokenAllowance: BigNumberish;
};
export default function Deposit({ name, symbol, tokenBalance, tokenAllowance }: DepositInputs) {
  const [depositInput, setDepositInput] = useState("");

  const maxDeposit = () => {
    setDepositInput(utils.formatEther(tokenBalance.toString()));
  };

  const handleInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setDepositInput(val);
  };

  const { state: depositTx, send: deposit } = useContractFunction(contracts[name].controller, "deposit");

  const depositTokens = (e: any) => {
    e.preventDefault();
    deposit(utils.parseEther(depositInput || "0"));
    console.log(depositTx);
  };

  const { state: approveTx, send: approve } = useContractFunction(contracts[name].token, "approve");

  console.log(approveTx);

  const approveTokens = (e: any) => {
    e.preventDefault();
    approve(addresses[name].controller, utils.parseEther(depositInput || "0"));
    console.log(approveTx);
  };
  return (
    <>
      <Form>
        <Form.Group controlId="formDeposit">
          <Form.Label>Deposit Amount</Form.Label>
          <Input
            width={1}
            value={depositInput}
            onChange={handleInputChange}
            type="text"
            placeholder={"0 " + symbol}
            className="amount"
          />
          <Form.Text className="balance" onClick={maxDeposit}>
            Current Balance: {`${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
          </Form.Text>
        </Form.Group>

        {!depositInput || BigNumber.from(tokenAllowance).gte(utils.parseEther(depositInput || "0")) ? (
          <Button
            disabled={!depositInput || depositInput.toString() === "0" || depositTx.status === "Mining"}
            style={{ width: "100%" }}
            onClick={depositTokens}
          >
            {depositTx.status === "Mining" ? (
              <>
                <Spinner animation="border" variant="white" />
                Depositing...
              </>
            ) : (
              "Deposit"
            )}
          </Button>
        ) : (
          <Button
            disabled={!depositInput || depositInput.toString() === "0" || approveTx.status === "Mining"}
            style={{ width: "100%" }}
            onClick={approveTokens}
          >
            {approveTx.status === "Mining" ? (
              <>
                {" "}
                <Spinner animation="border" variant="white" />
                Approving...
              </>
            ) : (
              "Approve"
            )}
          </Button>
        )}
      </Form>
    </>
  );
}
