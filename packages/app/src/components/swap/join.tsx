import { FC, useState, useCallback } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { useContractFunction, useContractCall } from "@usedapp/core";

import { Button, Box, Card, CardHeader, CardBody, CardFooter, Layer, Form, FormField, TextInput, Spinner, Text, Select, Tabs, Tab } from 'grommet'
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";

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

  const [tabIndex, setTabIndex] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isMulti, setIsMulti] = useState(true);
  const handleMulti = (v: string | null) => {
    if (v === "single") setIsMulti(false);
    if (v === "multi") setIsMulti(true);
    setTokenInput("");
    setTenderInput("");
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
    if (isMulti) {
      const valBN = utils.parseEther(val);
      const otherVal = utils.formatEther(valBN.mul(tenderTokenWeight).div(tokenWeight));
      setTenderInput(otherVal.toString());
    }
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
    if (isMulti) {
      const valBN = utils.parseEther(val);
      const otherVal = utils.formatEther(valBN.mul(tokenWeight).div(tenderTokenWeight));
      setTokenInput(otherVal.toString());
    }
  };

  const [selectToken, setSelectToken] = useState(symbol);
  const handleSelectToken = (symbol: string) => {
    setSelectToken(symbol);
    setTokenInput("");
    setTenderInput("");
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

  const isTokenApproved = useIsTokenApproved(addresses[name].token, addresses[name].liquidity, tokenInput);
  const isTenderApproved = useIsTokenApproved(addresses[name].tenderToken, addresses[name].liquidity, tenderInput);

  const hasValue = (val: any) => {
    return val && val !== "0";
  };

  const useButtonDisabled = () => {
    if (isMulti) {
      return !(hasValue(tokenInput) && hasValue(tenderInput) && isTokenApproved && isTenderApproved);
    } else {
      if (selectToken === symbol) {
        return !hasValue(tokenInput) && !isTokenApproved;
      } else {
        return !hasValue(tenderInput) && !isTenderApproved;
      }
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

  const { state: joinPoolTx, send: joinPool } = useContractFunction(contracts[name].liquidity, "joinPool", {
    transactionName: `Join t${symbol}/${symbol} Liquidity Pool`,
  });

  const { state: joinSwapExternAmountInTx, send: joinSwapExternAmountIn } = useContractFunction(
    contracts[name].liquidity,
    "joinswapExternAmountIn",
    { transactionName: `Join t${symbol}/${symbol} Liquidity Pool` }
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
      const poolTokensOut = calcPoolOutFromRatio();
      // NOTE: Pool is currently tenderToken/Token
      joinPool(poolTokensOut, [tenderIn, tokenIn]);
    } else {
      const poolTokensOut = BigNumber.from(singlePoolOut.toString()); // 5% slippage acceptable for now
      let token;
      let amount;
      if (selectToken === symbol) {
        token = addresses[name].token;
        amount = tokenIn;
      } else if (selectToken === `t${symbol}`) {
        token = addresses[name].tenderToken;
        amount = tenderIn;
      }
      joinSwapExternAmountIn(token, amount, poolTokensOut);
    }
  };

  const onActive = useCallback((nextIndex: number) => {
    setTabIndex(nextIndex)
    if (nextIndex === 0) {
      setIsMulti(true)
    } else {
      setIsMulti(false)
    }
  }, []);

  return (
    <>
      <Button primary onClick={handleShow}>
        Join Pool
      </Button>

      {show && 
        <Layer onEsc={() => setShow(false)}
        onClickOutside={() => setShow(false)}>
          <Card height="medium" width="large" background="light-1">
            <CardHeader>
            {`Join tender${symbol}/${symbol}`}
            </CardHeader>
            <CardBody>
              <Tabs id="join-type" activeIndex={tabIndex} onActive={onActive}>
                <Tab
                plain
                title={
                  "Multi Asset"
                }
                >
                  <Form>
                  <FormField label={`${symbol} Amount`} controlId="tokenInput">
                    <Box direction="row" width="medium">
                        <Text>
                          {`${utils
                            .formatEther(calcWeight(tokenWeight))
                            .substr(0, 5)} %`}
                        </Text>
                        <TextInput
                        value={tokenInput}
                        onChange={handleTokenInputChange}
                        type="text"
                        placeholder={"0 " + symbol}
                        className="amount"
                      />
                      <Button secondary onClick={() => maxDeposit(false)}>
                          Max
                      </Button>
                    </Box>
                    </FormField>
                    <FormField label={`${symbol} Amount`} controlId="tokenInput">
                    <Box direction="row" width="medium">
                        <Text>
                          {`${utils
                            .formatEther(calcWeight(tenderTokenWeight))
                            .substr(0, 5)} %`}
                        </Text>
                        <TextInput
                        value={tenderInput}
                        onChange={handleTenderInputChange}
                        type="text"
                        placeholder={"0 " + "t" + symbol}
                        className="amount"
                      />
                      <Button secondary onClick={() => maxDeposit(true)}>
                          Max
                      </Button>
                    </Box>
                    </FormField>
                </Form>
                </Tab>
                <Tab
                  plain
                  title={"Single Asset"}
                >
                   <Form>
                <FormField label={`${symbol} Amount`} controlId="tokenInput">
                    <Box direction="row" width="medium">
                    <Select
                          value={selectToken}
                          options={[symbol, `t${symbol}`]}
                          onChange={({option}) => handleSelectToken(option)}
                        />
                        {selectToken === symbol ? (
                          <>
                            <TextInput
                            value={tokenInput}
                            onChange={handleTokenInputChange}
                            type="text"
                            placeholder={"0 " + symbol}
                            className="amount"
                          />
                          <Button secondary onClick={() => maxDeposit(false)}>
                              Max
                          </Button>
                          </>
                        ) : (
                          <>
                          <TextInput
                          value={tenderInput}
                          onChange={handleTenderInputChange}
                          type="text"
                          placeholder={"0 " + "t" + symbol}
                          className="amount"
                        />
                        <Button secondary onClick={() => maxDeposit(true)}>
                            Max
                        </Button>
                          </>
                        )}
                    </Box>
                    </FormField>
                </Form>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter>
            <ApproveToken
              symbol={symbol}
              spender={addresses[name].liquidity}
              token={contracts[name].token}
              hasAllowance={!hasValue(tokenInput) || ((isMulti || selectToken === symbol) && isTokenApproved)}
            />
            <ApproveToken
              symbol={`t${symbol}`}
              spender={addresses[name].liquidity}
              token={contracts[name].tenderToken}
              hasAllowance={!hasValue(tenderInput) || ((isMulti || selectToken === `t${symbol}`) && isTenderApproved)}
            />
            <Button secondary onClick={addLiquidity} disabled={true}>
              {joinPoolTx.status === "Mining" || joinSwapExternAmountInTx.status === "Mining" ? (
                <>
                  <Spinner color="white" />
                  Adding Liquidity...
                </>
              ) : (
                "Add Liquidity"
              )}
            </Button>
            </CardFooter>
          </Card>
        </Layer>
      }
    </>
  );
};

export default JoinPool;
