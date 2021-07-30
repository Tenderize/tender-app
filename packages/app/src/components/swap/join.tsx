import { FC, useState, useCallback, ChangeEventHandler, MouseEventHandler } from "react";
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
  Paragraph,
} from "grommet";
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

  const [tokenInput, setTokenInput] = useState("");
  const handleTokenInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
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
  const handleTenderInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
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

  const hasValue = (val: string) => {
    return val && val !== "0";
  };

  const isButtonDisabled = () => {
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
    const hasValue = (val: BigNumberish) => {
      return val != null && val !== "0";
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

  const addLiquidity: MouseEventHandler<HTMLButtonElement> = async (e) => {
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
    setTabIndex(nextIndex);
    if (nextIndex === 0) {
      setIsMulti(true);
    } else {
      setIsMulti(false);
    }
  }, []);

  return (
    <Box pad={{ horizontal: "large", top: "small" }}>
      <Button primary onClick={handleShow} label="Join Pool" />
      {show && (
        <Layer
          style={{ overflow: "scroll" }}
          animation="fadeIn"
          margin={{ top: "xlarge" }}
          position="top"
          onEsc={handleClose}
          onClickOutside={handleClose}
        >
          <Card flex={false} pad="medium" width="large">
            <CardHeader justify="center" pad={{ bottom: "small" }}>{`Join tender${symbol}/${symbol}`}</CardHeader>
            <CardBody>
              <Tabs id="join-type" activeIndex={tabIndex} onActive={onActive}>
                <Tab
                  title={
                    <Box justify="center" align="center">
                      <Paragraph>Multi Asset</Paragraph>
                    </Box>
                  }
                >
                  <Box pad={{ top: "medium" }} align="center">
                    <Form>
                      <Box gap="medium">
                        <FormField label={`${symbol} Amount`} controlId="tokenInput">
                          <Box direction="row" align="center" gap="small">
                            <Text>{`${utils.formatEther(calcWeight(tokenWeight)).substr(0, 5)} %`}</Text>
                            <Box direction="row" width="medium">
                              <TextInput
                                value={tokenInput}
                                onChange={handleTokenInputChange}
                                type="text"
                                placeholder={"0 " + symbol}
                              />
                              <Button onClick={() => maxDeposit(false)}>Max</Button>
                            </Box>
                          </Box>
                        </FormField>
                        <FormField label={`t${symbol} Amount`} controlId="tenderInput">
                          <Box direction="row" align="center" gap="small">
                            <Text>{`${utils.formatEther(calcWeight(tenderTokenWeight)).substr(0, 5)} %`}</Text>
                            <Box direction="row" width="medium">
                              <TextInput
                                value={tenderInput}
                                onChange={handleTenderInputChange}
                                type="text"
                                placeholder={"0 " + "t" + symbol}
                              />
                              <Button onClick={() => maxDeposit(true)}>Max</Button>
                            </Box>
                          </Box>
                        </FormField>
                      </Box>
                    </Form>
                  </Box>
                </Tab>
                <Tab
                  title={
                    <Box justify="center" align="center">
                      <Paragraph>Single Asset</Paragraph>
                    </Box>
                  }
                >
                  <Box pad={{ top: "medium" }} align="center">
                    <Form>
                      <FormField label={`${symbol} Amount`} controlId="tokenInput">
                        <Box direction="row" gap="small">
                          <Box width="small">
                            <Select
                              value={selectToken}
                              options={[symbol, `t${symbol}`]}
                              onChange={({ option }) => handleSelectToken(option)}
                            />
                          </Box>
                          {selectToken === symbol ? (
                            <>
                              <TextInput
                                value={tokenInput}
                                onChange={handleTokenInputChange}
                                type="text"
                                placeholder={"0 " + symbol}
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
                              />
                              <Button secondary onClick={() => maxDeposit(true)}>
                                Max
                              </Button>
                            </>
                          )}
                        </Box>
                      </FormField>
                    </Form>
                  </Box>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Box justify="center" gap="small">
                <ApproveToken
                  symbol={symbol}
                  spender={addresses[name].liquidity}
                  token={contracts[name].token}
                  hasAllowance={isTokenApproved}
                />
                <ApproveToken
                  symbol={`t${symbol}`}
                  spender={addresses[name].liquidity}
                  token={contracts[name].tenderToken}
                  hasAllowance={isTenderApproved}
                />
                <Button
                  primary
                  onClick={addLiquidity}
                  disabled={isButtonDisabled()}
                  label={
                    joinPoolTx.status === "Mining" || joinSwapExternAmountInTx.status === "Mining" ? (
                      <>
                        <Spinner color="white" />
                        Adding Liquidity...
                      </>
                    ) : (
                      "Add Liquidity"
                    )
                  }
                />
              </Box>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </Box>
  );
};

export default JoinPool;
