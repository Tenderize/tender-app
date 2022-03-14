import { FC, useState, useCallback, useEffect, ChangeEventHandler } from "react";
import { addresses } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
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
  Heading,
} from "grommet";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { AmountInputFooter } from "../AmountInputFooter";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { useBalanceValidation } from "../../utils/inputValidation";
import { stakers } from "@tender/shared/src/index";
import { useEthers } from "@usedapp/core";
import { weiToEthWithDecimals } from "../../utils/amountFormat";
import {
  useCalculateRemoveLiquidity,
  useCalculateRemoveLiquidityOneToken,
  useExitPool,
  useExitPoolSingle,
} from "utils/tenderSwapHooks";
import { FormClose } from "grommet-icons";
import { isPendingTransaction } from "utils/transactions";

type Props = {
  protocolName: string;
  symbol: string;
  lpTokenBalance: BigNumberish;
};

const ExitPool: FC<Props> = ({ protocolName, symbol, lpTokenBalance }) => {
  const staker = stakers[protocolName];
  const [show, setShow] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isMulti, setIsMulti] = useState(true);
  const [lpSharesInputMulti, setLpSharesInputMulti] = useState("");
  const [lpSharesInputSingle, setLpSharesInputSingle] = useState("");

  const [tokenOutput, setTokenOutput] = useState("");
  const [tenderOutput, setTenderOutput] = useState("");
  const [selectedToken, setSelectedToken] = useState(symbol);
  const { account } = useEthers();

  const isLpSharesApproved = useIsTokenApproved(
    addresses[protocolName].lpToken,
    account,
    addresses[protocolName].tenderSwap,
    lpSharesInputMulti || lpSharesInputSingle
  );
  const hasValue = (val: any) => {
    return val && val !== "0";
  };

  const { removeLiquiditySingleOut, tx: exitPoolSingleTx } = useExitPoolSingle(
    addresses[protocolName].lpToken,
    protocolName,
    account,
    addresses[protocolName].tenderSwap,
    symbol,
    isLpSharesApproved
  );

  const { removeLiquidity, exitPoolTx } = useExitPool(
    addresses[protocolName].lpToken,
    protocolName,
    account,
    addresses[protocolName].tenderSwap,
    symbol,
    isLpSharesApproved
  );

  const singleTokenOutAddress =
    selectedToken === symbol ? addresses[protocolName].token : addresses[protocolName].tenderToken;

  const singleOut = useCalculateRemoveLiquidityOneToken(
    addresses[protocolName].tenderSwap,
    utils.parseEther(lpSharesInputSingle || "0"),
    singleTokenOutAddress
  );

  const [tenderOut, tokenOut] = useCalculateRemoveLiquidity(
    addresses[protocolName].tenderSwap,
    utils.parseEther(lpSharesInputMulti || "0")
  );

  useEffect(() => {
    setTokenOutput(weiToEthWithDecimals(tokenOut, 6));
    setTenderOutput(weiToEthWithDecimals(tenderOut, 6));
  }, [tenderOut, tokenOut]);

  const handleRemoveLiquidity = async (e: any) => {
    e.preventDefault();
    if (isMulti) {
      // NOTE: Pool cardinality is tenderToken/Token
      await removeLiquidity(utils.parseEther(lpSharesInputMulti || "0"), tenderOut, tokenOut);
    } else {
      await removeLiquiditySingleOut(utils.parseEther(lpSharesInputSingle || "0"), singleTokenOutAddress, singleOut);
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

  const symbolFull = `t${symbol}-${symbol}-SWAP`;

  return (
    <Box pad={{ horizontal: "large", top: "small" }}>
      <Button secondary onClick={handleShow} label="Remove Liquidity" />
      {show && (
        <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={handleClose} onClickOutside={handleClose}>
          <Card
            flex={false}
            pad={{ vertical: "medium", horizontal: "xlarge" }}
            width="large"
            style={{ position: "relative" }}
          >
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={handleClose}
            />
            <CardHeader justify="center" pad="none">
              <Heading level={2} alignSelf="center">
                {`Remove t${symbol}/${symbol} Liquidity`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Tabs id="exit-type" activeIndex={tabIndex} onActive={onActive}>
                <Tab
                  title={
                    <Box justify="center" align="center">
                      <Paragraph>Multi Asset</Paragraph>
                    </Box>
                  }
                >
                  <Box pad={{ top: "medium", horizontal: "large" }} align="center">
                    <Form style={{ width: "100%" }}>
                      <Box gap="medium">
                        <LPTokensToRemoveInputField
                          lpTokenBalance={lpTokenBalance}
                          lpSharesInput={lpSharesInputMulti}
                          setLpSharesInput={setLpSharesInputMulti}
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
                                icon={
                                  <Box pad="xsmall" direction="row" align="center" gap="small">
                                    <Image height="35" src={`/${staker.bwLogo}`} />
                                    <Text>{symbol}</Text>
                                  </Box>
                                }
                                style={{ textAlign: "right", padding: "20px 50px" }}
                                value={tokenOutput}
                              />
                              <TextInput
                                readOnly
                                disabled
                                id="exitMultiReceive"
                                placeholder={`0 t${symbol}`}
                                icon={
                                  <Box pad="xsmall" direction="row" align="center" gap="small">
                                    <Image height="35" src={`/${staker.bwTenderLogo}`} />
                                    <Text>t{symbol}</Text>
                                  </Box>
                                }
                                style={{ textAlign: "right", padding: "20px 50px" }}
                                value={tenderOutput}
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
                  <Box pad={{ top: "medium", horizontal: "large" }} align="center">
                    <Form style={{ width: "100%" }}>
                      <Box gap="medium">
                        <LPTokensToRemoveInputField
                          lpTokenBalance={lpTokenBalance}
                          lpSharesInput={lpSharesInputSingle}
                          setLpSharesInput={setLpSharesInputSingle}
                          symbolFull={symbolFull}
                        />
                        <Box>
                          <FormField label="Select Token To Receive" controlId="selectTokenReceive">
                            <Select
                              value={
                                <TextInput
                                  disabled
                                  readOnly
                                  value={utils.formatEther(singleOut)}
                                  placeholder={"0"}
                                  type="number"
                                  style={{ textAlign: "right", padding: "20px 50px", border: "none" }}
                                  icon={
                                    <Box pad="xsmall" direction="row" align="center" gap="small">
                                      <Image
                                        height="35"
                                        src={selectedToken === symbol ? `/${staker.bwLogo}` : `/${staker.bwTenderLogo}`}
                                      />
                                      <Text>{selectedToken === symbol ? symbol : `t${symbol}`}</Text>
                                    </Box>
                                  }
                                />
                              }
                              options={[
                                <Box direction="row" gap="small" align="center">
                                  <Image
                                    height={30}
                                    width={30}
                                    src={selectedToken === symbol ? `/${staker.bwTenderLogo}` : `/${staker.bwLogo}`}
                                    alt="token logo"
                                  />
                                  {selectedToken === symbol ? `t${symbol}` : symbol}
                                </Box>,
                              ]}
                              onChange={() => setSelectedToken(selectedToken === symbol ? `t${symbol}` : symbol)}
                            />
                          </FormField>
                        </Box>
                      </Box>
                    </Form>
                  </Box>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ vertical: "medium" }}>
              <Box style={{ width: "100%" }} pad={{ horizontal: "large" }} justify="center" gap="small">
                <Button
                  primary
                  onClick={handleRemoveLiquidity}
                  disabled={
                    !hasValue(lpSharesInputSingle || lpSharesInputMulti) ||
                    isPendingTransaction(exitPoolSingleTx) ||
                    isPendingTransaction(exitPoolTx)
                  }
                  label={
                    isPendingTransaction(exitPoolSingleTx) || isPendingTransaction(exitPoolTx) ? (
                      <LoadingButtonContent label="Removing Liquidity..." />
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

  const { validationMessage } = useBalanceValidation(lpSharesInput, lpTokenBalance);

  return (
    <FormField label="LP Tokens to remove" name="lpTokenToRemove">
      <Box direction="row" align="center" gap="small">
        <TextInput
          value={lpSharesInput}
          onChange={handleLpSharesInputChange}
          type="number"
          placeholder={"0 " + symbolFull}
          style={{ textAlign: "right", padding: "20px 50px" }}
        />
      </Box>
      <Text color="red">{validationMessage}</Text>
      <AmountInputFooter
        label={`Staked: ${weiToEthWithDecimals(lpTokenBalance?.toString() || "0", 6)} ${symbolFull}`}
        onClick={maxDeposit}
      />
    </FormField>
  );
};

export default ExitPool;
