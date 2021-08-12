import { FC, useState, useCallback, ChangeEventHandler } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { useContractFunction, useContractCall } from "@usedapp/core";
import {
  Image,
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
  Text,
  Select,
  Tabs,
  Tab,
  Paragraph,
} from "grommet";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { AmountInputFooter } from "../AmountInputFooter";
import { ButtonSpinner } from "../ButtonSpinner";
import { validateIsLargerThanMax, validateIsPositive } from "../../utils/inputValidation";
import stakers from "../../data/stakers";
import { useLocation } from "react-router";

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
  const location = useLocation();
  const logo = require("../../images/" + stakers[location.pathname].bwLogo);
  const tenderLogo = require("../../images/" + stakers[location.pathname].bwTenderLogo);

  const [show, setShow] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isMulti, setIsMulti] = useState(true);
  const [lpSharesInput, setLpSharesInput] = useState("");

  const [selectedToken, setSelectedToken] = useState(symbol);

  const isLpSharesApproved = useIsTokenApproved(addresses[name].liquidity, addresses[name].liquidity, lpSharesInput);

  const hasValue = (val: any) => {
    return val && val !== "0";
  };

  const useCalcSingleOutGivenPoolIn = () => {
    let tokenBalOut: BigNumberish = 0;
    let tokenWeightOut: BigNumberish = 0;

    if (selectedToken === symbol) {
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

  const calcPoolOutFromRatio = (balance: BigNumberish) => {
    const tokenInBN = utils.parseEther(lpSharesInput || "0");
    // return tokenInBN.mul(utils.parseEther("1")).div(tokenLpBalance).mul(lpShares).div(utils.parseEther("1"))
    const total = hasValue(lpShares) ? lpShares : "1";
    return tokenInBN.mul(balance).div(total).sub(1000);
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
      if (selectedToken === symbol) {
        token = addresses[name].token;
      } else if (selectedToken === `t${symbol}`) {
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
      <Button secondary onClick={handleShow} label="Exit Pool" />

      {show && (
        <Layer
          style={{ overflow: "auto" }}
          animation="fadeIn"
          margin={{ top: "xlarge" }}
          position="top"
          onEsc={handleClose}
          onClickOutside={handleClose}
        >
          <Card flex={false} pad="medium" width="large">
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
                    <Form validate="change">
                      <Box gap="medium">
                        <LPTokensToRemoveInputField
                          lpTokenBalance={lpTokenBalance}
                          lpSharesInput={lpSharesInput}
                          setLpSharesInput={setLpSharesInput}
                          symbolFull={symbolFull}
                        />
                        <FormField label="You will receive">
                          <Box direction="row">
                            <Box gap="small" fill>
                              <TextInput
                                disabled
                                readOnly
                                id="exitMultiReceive"
                                placeholder={`0 ${symbol}`}
                                icon={<Image src={logo.default} />}
                                style={{textAlign:"right", padding:"20px 50px"}}
                                value={`${utils.formatEther(calcPoolOutFromRatio(tokenLpBalance) || "0")} ${symbol}`}
                              />
                              <TextInput
                                readOnly
                                disabled
                                id="exitMultiReceive"
                                placeholder={`0 t${symbol}`}
                                icon={<Image src={tenderLogo.default} />}
                                style={{textAlign:"right", padding:"20px 50px"}}
                                value={`${utils.formatEther(calcPoolOutFromRatio(tenderLpBalance) || "0")} t${symbol}`}
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
                                value={
                                  <Box direction="row" gap="small" align="center" pad="7px">
                                    <img
                                      height={30}
                                      width={30}
                                      src={selectedToken === symbol ? logo.default : tenderLogo.default}
                                      alt="token logo"
                                    />
                                    {selectedToken}
                                  </Box>
                                }
                                options={[
                                  <Box direction="row" gap="small" align="center">
                                    <img
                                      height={30}
                                      width={30}
                                      src={selectedToken === symbol ? tenderLogo.default : logo.default}
                                      alt="token logo"
                                    />
                                    {selectedToken === symbol ? `t${symbol}` : symbol}
                                  </Box>,
                                ]}
                                onChange={() => setSelectedToken(selectedToken === symbol ? `t${symbol}` : symbol)}
                              />
                            </Box>
                          </FormField>
                          <FormField label="You will receive">
                            <Box direction="row" align="center" width="medium" gap="small">
                              <Text>{selectedToken}</Text>
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
              <Box pad={{horizontal: "large"}} justify="center" gap="small">
                <ApproveToken
                  symbol={symbolFull}
                  spender={addresses[name].liquidity}
                  token={contracts[name].liquidity}
                  show={!isLpSharesApproved}
                />
                <Button
                  primary
                  onClick={removeLiquidity}
                  disabled={!hasValue(lpSharesInput) || !isLpSharesApproved}
                  label={
                    exitPoolTx.status === "Mining" || exitSwapPoolAmountInTx.status === "Mining" ? (
                      <Box direction="row" align="center" gap="small">
                        <ButtonSpinner />
                        Removing Liquidity...
                      </Box>
                    ) : (
                      "Remove Liquidity"
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
    <FormField
      label="LP Tokens to remove"
      name="lpTokenToRemove"
      validate={[validateIsPositive(lpSharesInput), validateIsLargerThanMax(lpSharesInput, lpTokenBalance)]}
    >
      <Box direction="row" align="center" gap="small">
        <TextInput
          value={lpSharesInput}
          onChange={handleLpSharesInputChange}
          type="text"
          placeholder={"0 " + symbolFull}
        />
      </Box>
      <AmountInputFooter
        label={`Balance: ${utils.formatEther(lpTokenBalance?.toString() || "0")} ${symbolFull}`}
        onClick={maxDeposit}
      />
    </FormField>
  );
};

export default ExitPool;
