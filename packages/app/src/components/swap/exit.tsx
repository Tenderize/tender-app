import { FC, useState, useCallback, useEffect, ChangeEventHandler } from "react";
import { addresses, contracts } from "@tender/contracts";
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
} from "grommet";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { AmountInputFooter } from "../AmountInputFooter";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { validateIsLargerThanMax, validateIsPositive } from "../../utils/inputValidation";
import stakers from "../../data/stakers";
import { useContractFunction } from "../../utils/useDappPatch";
import { weiToEthWithDecimals } from "../../utils/amountFormat";
import { getDeadline, useCalculateRemoveLiquidity, useCalculateRemoveLiquidityOneToken } from "utils/tenderSwapHooks";
import { useEthers } from "@usedapp/core";

type Props = {
  name: string;
  symbol: string;
  lpTokenBalance: BigNumberish;
};

const ExitPool: FC<Props> = ({ name, symbol, lpTokenBalance }) => {
  const staker = stakers[name];
  const [show, setShow] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isMulti, setIsMulti] = useState(true);
  const [lpSharesInput, setLpSharesInput] = useState("");
  const [tokenOutput, setTokenOutput] = useState("");
  const [tenderOutput, setTenderOutput] = useState("");
  const [selectedToken, setSelectedToken] = useState(symbol);
  const { account } = useEthers();

  const isLpSharesApproved = useIsTokenApproved(
    addresses[name].lpToken,
    account || "",
    addresses[name].tenderSwap,
    lpSharesInput
  );
  const hasValue = (val: any) => {
    return val && val !== "0";
  };

  const { state: exitPoolSingleTx, send: removeLiquidityOneToken } = useContractFunction(
    contracts[name].tenderSwap,
    "removeLiquidityOneToken",
    {
      transactionName: `exit t${symbol}/${symbol} Liquidity Pool`,
    }
  );

  const { state: exitPoolTx, send: removeLiquidity } = useContractFunction(
    contracts[name].tenderSwap,
    "removeLiquidity",
    {
      transactionName: `exit t${symbol}/${symbol} Liquidity Pool`,
    }
  );

  const singleTokenOutAddress = selectedToken === symbol ? addresses[name].token : addresses[name].tenderToken;

  const singleOut = useCalculateRemoveLiquidityOneToken(
    addresses[name].tenderSwap,
    utils.parseEther(lpSharesInput || "0"),
    singleTokenOutAddress
  );

  const [tenderOut, tokenOut] = useCalculateRemoveLiquidity(
    addresses[name].tenderSwap,
    utils.parseEther(lpSharesInput || "0")
  );

  useEffect(() => {
    setTokenOutput(weiToEthWithDecimals(tokenOut, 6));
    setTenderOutput(weiToEthWithDecimals(tenderOut, 6));
  }, [tenderOut, tokenOut]);

  const handleRemoveLiquidity = async (e: any) => {
    e.preventDefault();
    const poolIn = utils.parseEther(lpSharesInput || "0");
    if (isMulti) {
      // NOTE: Pool cardinality is tenderToken/Token
      await removeLiquidity(poolIn, [tenderOut, tokenOut], getDeadline());
    } else {
      await removeLiquidityOneToken(poolIn, singleTokenOutAddress, singleOut, getDeadline());
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
                                      src={selectedToken === symbol ? `/${staker.bwLogo}` : `/${staker.bwTenderLogo}`}
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
                                      src={selectedToken === symbol ? `/${staker.bwTenderLogo}` : `/${staker.bwLogo}`}
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
                                value={utils.formatEther(singleOut)}
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
              <Box pad={{ horizontal: "large" }} justify="center" gap="small">
                <ApproveToken
                  symbol={symbolFull}
                  spender={addresses[name].tenderSwap}
                  token={contracts[name].lpToken}
                  show={!isLpSharesApproved}
                />
                <Button
                  primary
                  onClick={handleRemoveLiquidity}
                  disabled={!hasValue(lpSharesInput) || !isLpSharesApproved}
                  label={
                    exitPoolSingleTx.status === "Mining" || exitPoolTx.status === "Mining" ? (
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
        label={`Staked: ${weiToEthWithDecimals(lpTokenBalance?.toString() || "0", 2)} ${symbolFull}`}
        onClick={maxDeposit}
      />
    </FormField>
  );
};

export default ExitPool;
