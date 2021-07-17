import { FC, useState } from "react";
import { Form, Button, Modal, Tabs, Tab, InputGroup, Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { useContractFunction, useContractCall } from "@usedapp/core";

import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";

type Props = {
  name: string;
  symbol: string;
  tokenWeight: BigNumberish;
  tenderTokenWeight: BigNumberish;
  totalWeight: BigNumberish;
  swapFee: BigNumberish;
  tokenLpBalance: BigNumberish;
  tenderLpBalance: BigNumberish;
  lpShares: BigNumberish;
  lpTokenBalance: BigNumberish;
};

const ExitPool: FC<Props> = ({
  name,
  symbol,
  tokenWeight,
  tenderTokenWeight,
  totalWeight,
  swapFee,
  tokenLpBalance,
  tenderLpBalance,
  lpShares,
  lpTokenBalance,
}) => {
  // Component state & helpers
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isMulti, setIsMulti] = useState(true);
  const handleMulti = (v: string | null) => {
    if (v === "single") setIsMulti(false);
    if (v === "multi") setIsMulti(true);
  };

  const [lpSharesInput, setLpSharesInput] = useState("");
  const handleLpSharesInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setLpSharesInput(val);
  };

  const [selectToken, setSelectToken] = useState(symbol);
  const handleSelectToken = (e: any) => {
    setSelectToken(e.target.value);
  };

  const maxDeposit = () => {
    setLpSharesInput(utils.formatEther(lpTokenBalance || "0"));
  };

  const isLpSharesApproved = useIsTokenApproved(addresses[name].liquidity, addresses[name].liquidity, lpSharesInput);

  const hasValue = (val: any) => {
    return val && val !== "0";
  };

  const useButtonDisabled = () => {
    return !hasValue(lpSharesInput) || !isLpSharesApproved;
  };

  const useCalcSingleOutGivenPoolIn = () => {
    let tokenBalOut: BigNumberish = 0;
    let tokenWeightOut: BigNumberish = 0;

    if (selectToken === symbol) {
      tokenBalOut = tokenLpBalance;
      tokenWeightOut = tokenWeight;
    } else {
      tokenBalOut = tenderLpBalance;
      tokenWeightOut = tenderTokenWeight;
    }

    const [calced] =
      useContractCall(
        hasValue(tokenBalOut) &&
          hasValue(tokenWeightOut) &&
          hasValue(lpShares) &&
          hasValue(totalWeight) &&
          hasValue(lpSharesInput) &&
          hasValue(swapFee) && {
            abi: contracts[name].swap.interface,
            address: addresses[name].swap,
            method: "calcSingleOutGivenPoolIn",
            args: [tokenBalOut, tokenWeightOut, lpShares, totalWeight, utils.parseEther(lpSharesInput), swapFee],
          }
      ) ?? [];
    return calced || "0";
  };

  const singleOutPoolIn = useCalcSingleOutGivenPoolIn();

  const { state: exitPoolTx, send: exitPool } = useContractFunction(contracts[name].liquidity, "exitPool", {
    transactionName: `exit t${symbol}/${symbol} Liquidity Pool`,
  });

  const { state: exitSwapPoolAmountInTx, send: exitSwapPoolAmountIn } = useContractFunction(
    contracts[name].liquidity,
    "exitswapPoolAmountIn",
    {
      transactionName: `exit t${symbol}/${symbol} Liquidity Pool`,
    }
  );

  const calcWeight = (weight: BigNumberish): BigNumberish => {
    if (totalWeight.toString() === "0") {
      return constants.Zero;
    }
    const weightBn = BigNumber.from(weight.toString());
    return weightBn.mul(utils.parseEther("1")).div(totalWeight.toString()).mul(100);
  };

  const calcPoolOutFromRatio = (balance: BigNumberish) => {
    const tokenInBN = utils.parseEther(lpSharesInput || "0");
    // return tokenInBN.mul(utils.parseEther("1")).div(tokenLpBalance).mul(lpShares).div(utils.parseEther("1"))
    const total = hasValue(lpShares) ? lpShares : "1";
    return tokenInBN.mul(balance).div(total);
  };

  const removeLiquidity = async (e: any) => {
    e.preventDefault();
    const poolIn = utils.parseEther(lpSharesInput || "0");
    if (isMulti) {
      const minTokenOut = calcPoolOutFromRatio(tokenLpBalance);
      const minTenderOut = calcPoolOutFromRatio(tenderLpBalance);
      // NOTE: Pool is currently tenderToken/Token
      await exitPool(poolIn, [minTenderOut, minTokenOut]);
    } else {
      let token;
      if (selectToken === symbol) {
        token = addresses[name].token;
      } else if (selectToken === `t${symbol}`) {
        token = addresses[name].tenderToken;
      }
      exitSwapPoolAmountIn(token, poolIn, singleOutPoolIn);
    }
  };

  const symbolFull = `t${symbol}-${symbol} Pool Token`;

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
        Exit Pool
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{`Exit tender${symbol}/${symbol} pool`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs onSelect={handleMulti} defaultActiveKey="multi" id="jointabs">
            <Tab eventKey="multi" title="Multi-Asset">
              <Form>
                <Form.Group className="d-grid gap-2" controlId="tokenInput">
                  <Form.Label>LP Tokens to remove</Form.Label>
                  <InputGroup>
                    <Form.Control
                      value={lpSharesInput}
                      onChange={handleLpSharesInputChange}
                      type="text"
                      placeholder={"0 " + symbolFull}
                      className="amount"
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text className="balance" onClick={() => maxDeposit()}>
                      Current Balance {`${utils.formatEther(lpTokenBalance?.toString() || "0")} ${symbolFull}`}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="d-grid gap-2">
                  <Form.Label>You Will Receive</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>{symbol}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      disabled
                      id="exitMultiReceive"
                      placeholder={"0"}
                      value={utils.formatEther(calcPoolOutFromRatio(tokenLpBalance) || "0")}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>{`t${symbol}`}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      disabled
                      id="exitMultiReceive"
                      placeholder={"0"}
                      value={utils.formatEther(calcPoolOutFromRatio(tenderLpBalance) || "0")}
                    />
                  </InputGroup>
                </Form.Group>
              </Form>
            </Tab>
            <Tab eventKey="single" title="Single-Asset">
              <Form className="d-grid gap-2">
                <Form.Group className="gap-2" controlId="singleinput">
                  <Form.Label>I want to receive:</Form.Label>
                  <select onChange={handleSelectToken} className="form-control">
                    <option value={symbol} selected>
                      {symbol}
                    </option>
                    <option value={`t${symbol}`}>t{symbol}</option>
                  </select>
                </Form.Group>
                <Form.Group className="gap-2">
                  <Form.Label>LP Tokens to remove</Form.Label>
                  <InputGroup>
                    <Form.Control
                      value={lpSharesInput}
                      onChange={handleLpSharesInputChange}
                      type="text"
                      placeholder={"0 " + symbolFull}
                      className="amount"
                    />
                    <InputGroup.Text className="balance" onClick={() => maxDeposit()}>
                      Current Balance {`${utils.formatEther(lpTokenBalance?.toString() || "0")} ${symbolFull}`}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="gap-2">
                  <Form.Label>You Will Receive</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>{selectToken}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      disabled
                      id="exitMultiReceive"
                      placeholder={"0"}
                      value={utils.formatEther(useCalcSingleOutGivenPoolIn() || "0")}
                    />
                  </InputGroup>
                </Form.Group>
              </Form>
            </Tab>
          </Tabs>
          <div className="d-grid gap-2 mt-2">
            <ApproveToken
              symbol={symbolFull}
              spender={addresses[name].liquidity}
              token={contracts[name].liquidity}
              hasAllowance={!hasValue(lpSharesInput) || isLpSharesApproved}
            />
            <Button block variant="primary" onClick={removeLiquidity} disabled={useButtonDisabled()}>
              {exitPoolTx.status === "Mining" || exitSwapPoolAmountInTx.status === "Mining" ? (
                <>
                  <Spinner animation="border" variant="white" />
                  Removing Liquidity...
                </>
              ) : (
                "Remove Liquidity"
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExitPool;
