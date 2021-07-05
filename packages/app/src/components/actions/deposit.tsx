import { contracts, addresses } from "@tender/contracts";
import { useContractFunction } from "@usedapp/core";
import { BigNumberish, utils } from "ethers";
import { FC, useState } from "react";
import { Input } from "rimble-ui";
import { Button, Form } from "react-bootstrap";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tokenAllowance: BigNumberish;
};

const Deposit: FC<Props> = ({ name, symbol, tokenBalance, tokenAllowance }) => {
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

  const isTokenApproved = useIsTokenApproved(addresses[name].token, addresses[name].controller, depositInput);

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
        <div className="d-grid gap-2">
          <ApproveToken
            symbol={symbol}
            spender={addresses[name].controller}
            tokenAddress={contracts[name].token}
            hasAllowance={isTokenApproved}
          />
          <Button
            disabled={
              !isTokenApproved || !depositInput || depositInput.toString() === "0" || depositTx.status === "Mining"
            }
            onClick={depositTokens}
          >
            Deposit
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Deposit;
