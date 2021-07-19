import { FC, useState, useCallback } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { useContractFunction, useContractCall } from "@usedapp/core";

import {
  Button,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Layer,
  Form,
  FormField,
  TextInput,
  Spinner,
  Text,
  Select,
  Tabs,
  Tab,
} from "grommet";
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
  const [tabIndex, setTabIndex] = useState(0);

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

  const maxDeposit = () => {
    setLpSharesInput(utils.formatEther(lpTokenBalance || "0"));
  };

  const isLpSharesApproved = useIsTokenApproved(addresses[name].liquidity, addresses[name].liquidity, lpSharesInput);

  const hasValue = (val: any) => {
    return val && val !== "0";
  };

  const useButtonDisabled = () => {
    if (!hasValue(lpSharesInput)) return true;
    if (!isLpSharesApproved) return true;
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

  const onActive = useCallback((nextIndex: number) => {
    setTabIndex(nextIndex);
    if (nextIndex === 0) {
      setIsMulti(true);
    } else {
      setIsMulti(false);
    }
  }, []);

  const symbolFull = `t${symbol}-${symbol} Pool Token`;

  return (
    <Box pad={{ horizontal: "large", top: "small" }}>
      <Button primary onClick={handleShow} label="Exit Pool" />

      {show && (
        <Layer onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
          <Card height="medium" width="large" background="light-1">
            <CardHeader>{`Exit tender${symbol}/${symbol} pool`}</CardHeader>
            <CardBody>
              <Tabs id="exit-type" activeIndex={tabIndex} onActive={onActive}>
                <Tab title={"Multi Asset"}>
                  <Form>
                    <FormField label="LP Tokens to remove">
                      <Box direction="row" width="medium">
                        <TextInput
                          value={lpSharesInput}
                          onChange={handleLpSharesInputChange}
                          type="text"
                          placeholder={"0 " + symbolFull}
                          className="amount"
                        />
                        <Button secondary onClick={() => maxDeposit()}>
                          Max
                        </Button>
                      </Box>
                      <Text>
                        Current Balance {`${utils.formatEther(lpTokenBalance?.toString() || "0")} ${symbolFull}`}
                      </Text>
                    </FormField>
                    <FormField label="You will receive">
                      <Box direction="row" width="medium">
                        <Text>{symbol}</Text>
                        <TextInput
                          disabled
                          readOnly
                          id="exitMultiReceive"
                          placeholder={"0"}
                          value={utils.formatEther(calcPoolOutFromRatio(tokenLpBalance) || "0")}
                        />
                      </Box>
                      <Box direction="row" width="medium">
                        <Text>{`t${symbol}`}</Text>
                        <TextInput
                          readOnly
                          disabled
                          id="exitMultiReceive"
                          placeholder={"0"}
                          value={utils.formatEther(calcPoolOutFromRatio(tenderLpBalance) || "0")}
                        />
                      </Box>
                    </FormField>
                  </Form>
                </Tab>
                <Tab title={"Single Asset"}>
                  <Form>
                    <FormField label="LP Tokens to remove">
                      <Box direction="row" width="medium">
                        <TextInput
                          value={lpSharesInput}
                          onChange={handleLpSharesInputChange}
                          type="text"
                          placeholder={"0 " + symbolFull}
                          className="amount"
                        />
                        <Button secondary onClick={() => maxDeposit()}>
                          Max
                        </Button>
                      </Box>
                      <Text>
                        Current Balance {`${utils.formatEther(lpTokenBalance?.toString() || "0")} ${symbolFull}`}
                      </Text>
                    </FormField>
                    <FormField label="Select Token To Receive" controlId="selectTokenReceive">
                      <Box direction="row" width="medium">
                        <Select
                          value={selectToken}
                          options={[symbol, `t${symbol}`]}
                          onChange={({ option }) => setSelectToken(option)}
                        />
                      </Box>
                    </FormField>
                    <FormField label="You will receive">
                      <Box direction="row" width="medium">
                        <Text>{selectToken}</Text>
                        <TextInput
                          readOnly
                          disabled
                          id="exitMultiReceive"
                          placeholder={"0"}
                          value={utils.formatEther(singleOutPoolIn || "0")}
                        />
                      </Box>
                    </FormField>
                  </Form>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter>
              <Box direction="column" width="medium">
                <ApproveToken
                  symbol={symbolFull}
                  spender={addresses[name].liquidity}
                  token={contracts[name].liquidity}
                  hasAllowance={!hasValue(lpSharesInput) || isLpSharesApproved}
                />
                <Button primary onClick={removeLiquidity} disabled={!hasValue(lpSharesInput) || !isLpSharesApproved}>
                  {exitPoolTx.status === "Mining" || exitSwapPoolAmountInTx.status === "Mining" ? (
                    <Box direction="row" align="center">
                      <Spinner color="white" />
                      Removing Liquidity...
                    </Box>
                  ) : (
                    "Remove Liquidity"
                  )}
                </Button>
              </Box>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </Box>
  );
};

export default ExitPool;
