import { FC, useState } from "react";
// import { useContractFunction } from "@usedapp/core";
import { Form, Button, Modal, Tabs, Tab, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { useContractFunction, useContractCall } from "@usedapp/core";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
  tokenWeight: BigNumberish;
  tenderTokenWeight: BigNumberish;
  totalWeight: BigNumberish;
  swapFee: BigNumberish;
  tokenLpBalance: BigNumberish;
  tenderLpBalance: BigNumberish;
  lpShares: BigNumberish;
};

const JoinPool: FC<Props> = ({
  name,
  symbol,
  tokenBalance,
  tenderTokenBalance,
  tokenWeight,
  tenderTokenWeight,
  totalWeight,
  swapFee,
  tokenLpBalance,
  tenderLpBalance,
  lpShares,
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

  const [tokenInput, setTokenInput] = useState("");
  const handleTokenInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setTokenInput(val);
    if (val === "") {
      setTenderInput(val);
      return;
    }
    const valBN = utils.parseEther(val);
    console.log(tenderTokenWeight, tokenWeight);
    const otherVal = utils.formatEther(valBN.mul(tenderTokenWeight).div(tokenWeight));
    setTenderInput(otherVal.toString());
  };

  const [tenderInput, setTenderInput] = useState("");
  const handleTenderInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setTenderInput(val);
    if (val === "") {
      setTokenInput(val);
      return;
    }
    const valBN = utils.parseEther(val);
    const otherVal = utils.formatEther(valBN.mul(tokenWeight).div(tenderTokenWeight));
    setTokenInput(otherVal.toString());
  };

  const [selectToken, setSelectToken] = useState(symbol);
  const handleSelectToken = (symbol: string) => {
    setSelectToken(symbol);
  };

  const maxDeposit = (tenderToken: boolean) => {
    if (tenderToken) {
      setTenderInput(utils.formatEther(tenderTokenBalance || "0"));
      const balBN = BigNumber.from(tenderTokenBalance.toString());
      setTokenInput(utils.formatEther(balBN.mul(tokenWeight).div(tenderTokenWeight)));
    } else {
      setTokenInput(utils.formatEther(tokenBalance || "0"));
      const balBN = BigNumber.from(tokenBalance.toString());
      setTenderInput(utils.formatEther(balBN.mul(tenderTokenWeight).div(tokenWeight)));
    }
  };

  // Contract Functions
  const useCalcSinglePoolOut = () => {
    const hasValue = (val: any) => {
      return val && val !== "0";
    };
    let tokenIn: BigNumberish = 0;
    let tokenInBal: BigNumberish = 0;
    let weight: BigNumberish = 0;
    if (selectToken === symbol) {
      tokenIn = utils.parseEther(tokenInput || "0");
      tokenInBal = tokenLpBalance || "0";
      weight = tokenWeight || "0";
    } else {
      tokenIn = utils.parseEther(tenderInput || "0");
      tokenInBal = tenderLpBalance || "0";
      weight = tenderTokenWeight || "0";
    }
    const [calced] =
      useContractCall(
        hasValue(tokenInBal) &&
          hasValue(weight) &&
          hasValue(lpShares) &&
          hasValue(totalWeight) &&
          hasValue(tokenIn) &&
          hasValue(swapFee) && {
            abi: contracts[name].swap.interface,
            address: addresses[name].swap,
            method: "calcPoolOutGivenSingleIn",
            args: [tokenInBal, weight, lpShares || "1", totalWeight || "1", tokenIn, swapFee || "0"],
          }
      ) ?? [];
    return calced || "0";
  };

  const singlePoolOut = useCalcSinglePoolOut() || "0";

  const { state: _approveTokenTx, send: approveUnderlyingTokens } = useContractFunction(
    contracts[name].token,
    "approve"
  );

  const { state: _approveTenderTx, send: approveTenderTokens } = useContractFunction(
    contracts[name].tenderToken,
    "approve"
  );

  const { state: _joinPoolTx, send: joinPool } = useContractFunction(contracts[name].liquidity, "joinPool");
  
  const { state: _joinSwapExternAmountInTx, send: joinSwapExternAmountIn } = useContractFunction(
    contracts[name].liquidity,
    "joinswapExternAmountIn"
  );

  const calcWeight = (weight: BigNumberish): BigNumberish => {
    if (totalWeight.toString() === "0") {
      return constants.Zero;
    }
    const weightBn = BigNumber.from(weight.toString());
    return weightBn.mul(utils.parseEther("1")).div(totalWeight.toString()).mul(100);
  };

  const calcPoolOutFromRatio = () => {
    const tokenInBN = utils.parseEther(tokenInput);
    // return tokenInBN.mul(utils.parseEther("1")).div(tokenLpBalance).mul(lpShares).div(utils.parseEther("1"))
    return tokenInBN.mul(lpShares).div(tokenLpBalance);
  };

  const addLiquidity = async (e: any) => {
    e.preventDefault();
    const tokenIn = utils.parseEther(tokenInput || "0");
    const tenderIn = utils.parseEther(tenderInput || "0");
    if (isMulti) {
      console.log(calcPoolOutFromRatio().toString());
      const poolTokensOut = calcPoolOutFromRatio();
      approveUnderlyingTokens(addresses[name].liquidity, tokenIn);
      await approveTenderTokens(addresses[name].liquidity, tenderIn);
      // NOTE: Pool is currently tenderToken/Token
      joinPool(poolTokensOut, [tenderIn, tokenIn]);
    } else {
      const poolTokensOut = BigNumber.from(singlePoolOut.toString()); // 5% slippage acceptable for now
      let token;
      let amount;
      if (selectToken === symbol) {
        token = addresses[name].token;
        amount = tokenIn;
        await approveUnderlyingTokens(addresses[name].liquidity, amount);
      } else if (selectToken === `t${symbol}`) {
        token = addresses[name].tenderToken;
        amount = tenderIn;
        await approveTenderTokens(addresses[name].liquidity, amount);
      }
      joinSwapExternAmountIn(token, amount, poolTokensOut);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Join Pool
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{`Join tender${symbol}/${symbol}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs onSelect={handleMulti} defaultActiveKey="multi" id="jointabs">
            <Tab eventKey="multi" title="Multi-Asset">
              <Form>
                <Form.Group controlId="tokenInput">
                  <Form.Label>{symbol}</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">{`${utils
                        .formatEther(calcWeight(tokenWeight))
                        .substr(0, 5)} %`}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      value={tokenInput}
                      onChange={handleTokenInputChange}
                      type="text"
                      placeholder={"0 " + symbol}
                      className="amount"
                    />
                    <InputGroup.Text className="balance" onClick={() => maxDeposit(false)}>
                      Current Balance {`${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="tenderTokenInput">
                  <Form.Label>{`tender${symbol}`}</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">{`${utils
                        .formatEther(calcWeight(tenderTokenWeight))
                        .substr(0, 5)} %`}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      value={tenderInput}
                      onChange={handleTenderInputChange}
                      type="text"
                      placeholder={"0 " + "t" + symbol}
                      className="amount"
                    />
                    <InputGroup.Text className="balance" onClick={() => maxDeposit(true)}>
                      Current Balance {`${utils.formatEther(tenderTokenBalance?.toString() || "0")} tender${symbol}`}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Form>
            </Tab>
            <Tab eventKey="single" title="Single-Asset">
              <Form>
                <Form.Group controlId="singleinput">
                  <InputGroup className="mb-3">
                    <DropdownButton
                      as={InputGroup.Prepend}
                      variant="outline-secondary"
                      title={selectToken}
                      id="tokenselector"
                      value={selectToken}
                    >
                      <Dropdown.Item eventKey={symbol} onSelect={() => handleSelectToken(symbol)}>
                        {symbol}
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={`t${symbol}`} onSelect={() => handleSelectToken(`t${symbol}`)}>
                        t{symbol}
                      </Dropdown.Item>
                    </DropdownButton>
                    {selectToken === symbol ? (
                      <>
                        <Form.Control
                          value={tokenInput}
                          onChange={handleTokenInputChange}
                          type="text"
                          placeholder={"0 " + symbol}
                          className="amount"
                        />
                        <InputGroup.Text className="balance" onClick={() => maxDeposit(false)}>
                          Current Balance {`${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
                        </InputGroup.Text>
                      </>
                    ) : (
                      <>
                        <Form.Control
                          value={tenderInput}
                          onChange={handleTenderInputChange}
                          type="text"
                          placeholder={"0 " + "t" + symbol}
                          className="amount"
                        />
                        <InputGroup.Text className="balance" onClick={() => maxDeposit(true)}>
                          Current Balance{" "}
                          {`${utils.formatEther(tenderTokenBalance?.toString() || "0")} tender${symbol}`}
                        </InputGroup.Text>
                      </>
                    )}
                    <Form.Control aria-describedby="basic-addon1" />
                  </InputGroup>
                </Form.Group>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="primary" onClick={addLiquidity}>
            Add Liquidity
          </Button>

          {/* Show Farm or Approve depending on allowance
          {!farmInput || BigNumber.from(tokenAllowance).gte(utils.parseEther(farmInput || "0")) ? (
          <Button
            variant="primary"
            disabled={!farmInput || farmInput.toString() === "0" || farmTx.status === "Mining"}
            onClick={farmLpTokens}
            >
            {farmTx.status === "Mining" ? (
                <>
                <Spinner animation="border" variant="white" />
                Farming...
                </>
            ) : (
                "Farm"
            )}
            </Button>
          ) : (
            <Button
            variant="primary"
            disabled={!farmInput || farmInput.toString() === "0" || approveTx.status === "Mining"}
            onClick={approveLpTokens}
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
          )} */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default JoinPool;
