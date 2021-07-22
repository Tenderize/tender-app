import { FC, useState, useCallback, ChangeEventHandler } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { useContractFunction, useContractCall } from "@usedapp/core";
import { Button as SecondaryButton } from "../base";
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
import { normalizeColor } from "grommet/utils";
import { theme } from "../../theme";

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

  const [selectToken, setSelectToken] = useState(symbol);

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
      <SecondaryButton secondary color="brand" onClick={handleShow} label="Exit Pool" />

      {show && (
        <Layer
          margin={{ top: "xlarge" }}
          position="top"
          background="transparent"
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Card pad="medium" width="large" background={normalizeColor("modalBackground", theme)}>
            <CardHeader justify="center" pad={{ bottom: "small" }}>{`Exit tender${symbol}/${symbol}`}</CardHeader>
            <CardBody>
              <Tabs id="exit-type" activeIndex={tabIndex} onActive={onActive}>
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
                        <LPTokensToRemoveInputField
                          lpTokenBalance={lpTokenBalance}
                          lpSharesInput={lpSharesInput}
                          setLpSharesInput={setLpSharesInput}
                          symbolFull={symbolFull}
                        />
                        <FormField label="You will receive">
                          <Box direction="row">
                            <Box justify="around" pad={{ right: "small" }}>
                              <Text>{symbol}</Text>
                              <Text>{`t${symbol}`}</Text>
                            </Box>
                            <Box gap="small" fill>
                              <TextInput
                                disabled
                                readOnly
                                id="exitMultiReceive"
                                placeholder={"0"}
                                value={utils.formatEther(calcPoolOutFromRatio(tokenLpBalance) || "0")}
                              />
                              <TextInput
                                readOnly
                                disabled
                                id="exitMultiReceive"
                                placeholder={"0"}
                                value={utils.formatEther(calcPoolOutFromRatio(tenderLpBalance) || "0")}
                              />
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
                      <Box gap="medium">
                        <LPTokensToRemoveInputField
                          lpTokenBalance={lpTokenBalance}
                          lpSharesInput={lpSharesInput}
                          setLpSharesInput={setLpSharesInput}
                          symbolFull={symbolFull}
                        />
                        <Box>
                          <FormField label="Select Token To Receive" controlId="selectTokenReceive">
                            <Box width="medium">
                              <Select
                                value={selectToken}
                                options={[symbol, `t${symbol}`]}
                                onChange={({ option }) => setSelectToken(option)}
                              />
                            </Box>
                          </FormField>
                          <FormField label="You will receive">
                            <Box direction="row" align="center" width="medium" gap="small">
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
                        </Box>
                      </Box>
                    </Form>
                  </Box>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Box justify="center" gap="small">
                <ApproveToken
                  symbol={symbolFull}
                  spender={addresses[name].liquidity}
                  token={contracts[name].liquidity}
                  hasAllowance={isLpSharesApproved}
                />
                <Button
                  primary
                  color="brand"
                  onClick={removeLiquidity}
                  disabled={!hasValue(lpSharesInput) || !isLpSharesApproved}
                  label={
                    <>
                      {exitPoolTx.status === "Mining" || exitSwapPoolAmountInTx.status === "Mining" ? (
                        <Box direction="row" align="center">
                          <Spinner color="white" />
                          Removing Liquidity...
                        </Box>
                      ) : (
                        "Remove Liquidity"
                      )}
                    </>
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

const LPTokensToRemoveInputField: FC<{
  lpSharesInput: string;
  setLpSharesInput: (value: string) => void;
  symbolFull: string;
  lpTokenBalance: BigNumberish;
}> = ({ lpSharesInput, setLpSharesInput, symbolFull, lpTokenBalance }) => {
  const maxDeposit = useCallback(() => {
    setLpSharesInput(utils.formatEther(lpTokenBalance || "0"));
  }, [lpTokenBalance, setLpSharesInput]);

  const handleLpSharesInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const val = e.target.value;
      if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
      setLpSharesInput(val);
    },
    [setLpSharesInput]
  );

  return (
    <FormField label="LP Tokens to remove">
      <Box direction="row" align="center" gap="small">
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
      <Text>Current Balance {`${utils.formatEther(lpTokenBalance?.toString() || "0")} ${symbolFull}`}</Text>
    </FormField>
  );
};

export default ExitPool;
