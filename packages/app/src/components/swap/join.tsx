import { FC, useState, useCallback, ChangeEventHandler, MouseEventHandler } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { useContractCall } from "@usedapp/core";
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
import { validateIsPositive, validateIsLargerThanMax, hasValue } from "../../utils/inputValidation";
import stakers from "../../data/stakers";
import { useContractFunction } from "../../utils/useDappPatch";

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
  const staker = stakers[name];
  const bwLogo = `/${staker.bwLogo}`;
  const bwTenderLogo = `/${staker.bwTenderLogo}`;
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

  const [selectedToken, setSelectedToken] = useState(symbol);
  const handleSelectToken = (symbol: string) => {
    setSelectedToken(symbol);
    setTokenInput("");
    setTenderInput("");
  };

  const maxTokenDeposit = useCallback(() => {
    setTokenInput(utils.formatEther(tokenBalance || "0"));
    const balBN = BigNumber.from(tokenBalance.toString());
    setTenderInput(utils.formatEther(balBN.mul(tenderTokenWeight).div(tokenWeight)));
  }, [tenderTokenWeight, tokenBalance, tokenWeight]);

  const maxTenderTokenDeposit = useCallback(() => {
    setTenderInput(utils.formatEther(tenderTokenBalance || "0"));
    const balBN = BigNumber.from(tenderTokenBalance.toString());
    setTokenInput(utils.formatEther(balBN.mul(tokenWeight).div(tenderTokenWeight)));
  }, [tenderTokenBalance, tenderTokenWeight, tokenWeight]);

  const isTokenApproved = useIsTokenApproved(addresses[name].token, addresses[name].liquidity, tokenInput);
  const isTenderApproved = useIsTokenApproved(addresses[name].tenderToken, addresses[name].liquidity, tenderInput);

  const tokenSelected = selectedToken === symbol;

  const isButtonDisabled = () => {
    if (isMulti) {
      return !(hasValue(tokenInput) && hasValue(tenderInput) && isTokenApproved && isTenderApproved);
    } else {
      if (tokenSelected) {
        return !hasValue(tokenInput) && !isTokenApproved;
      } else {
        return !hasValue(tenderInput) && !isTenderApproved;
      }
    }
  };

  // Contract Functions
  const useCalcSinglePoolOut = () => {
    let tokenIn: BigNumberish = 0;
    let tokenInBal: BigNumberish = 0;
    let weight: BigNumberish = 0;
    if (tokenSelected) {
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
    const lpSharesBN = BigNumber.from(lpShares);
    const tokenLpBalanceBN = BigNumber.from(tokenLpBalance);

    const buffer = utils.parseEther("0.001");
    return tokenInBN.mul(lpSharesBN).div(tokenLpBalanceBN).sub(buffer);
  };

  const addLiquidity: MouseEventHandler<HTMLButtonElement & HTMLAnchorElement> = async (e) => {
    e.preventDefault();
    const tokenIn = utils.parseEther(tokenInput || "0");
    const tenderIn = utils.parseEther(tenderInput || "0");
    if (isMulti) {
      const poolTokensOut = calcPoolOutFromRatio();
      console.log(utils.formatEther(poolTokensOut));
      // NOTE: Pool is currently tenderToken/Token
      joinPool(poolTokensOut, [tenderIn, tokenIn]);
    } else {
      const poolTokensOut = BigNumber.from(singlePoolOut.toString()); // 5% slippage acceptable for now
      let token;
      let amount;
      if (tokenSelected) {
        token = addresses[name].token;
        amount = tokenIn;
      } else if (selectedToken === `t${symbol}`) {
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
          style={{ overflow: "auto" }}
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
                    <Form validate="change">
                      <Box gap="medium">
                        <FormField
                          label={`${symbol} Amount`}
                          name="tokenInput"
                          validate={[validateIsPositive(tokenInput), validateIsLargerThanMax(tokenInput, tokenBalance)]}
                        >
                          <Box direction="row" align="center" gap="small">
                            <Text>{`${utils.formatEther(calcWeight(tokenWeight)).substr(0, 5)} %`}</Text>
                            <Box width="medium">
                              <TextInput
                                value={tokenInput}
                                onChange={handleTokenInputChange}
                                type="text"
                                icon={
                                  <Box pad="xsmall" direction="row" align="center" gap="small">
                                    <Image height="35" src={bwLogo} />
                                    <Text>{symbol}</Text>
                                  </Box>
                                }
                                style={{ textAlign: "right", padding: "20px 50px" }}
                                placeholder={"0"}
                              />
                            </Box>
                          </Box>
                          <AmountInputFooter
                            label={`Balance: ${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
                            onClick={maxTokenDeposit}
                          />
                        </FormField>
                        <FormField
                          label={`t${symbol} Amount`}
                          name="tenderInput"
                          validate={[
                            validateIsPositive(tenderInput),
                            validateIsLargerThanMax(tenderInput, tenderTokenBalance),
                          ]}
                        >
                          <Box direction="row" align="center" gap="small">
                            <Text>{`${utils.formatEther(calcWeight(tenderTokenWeight)).substr(0, 5)} %`}</Text>
                            <Box width="medium">
                              <TextInput
                                value={tenderInput}
                                onChange={handleTenderInputChange}
                                type="text"
                                icon={
                                  <Box pad="xsmall" direction="row" align="center" gap="small">
                                    <Image height="35" src={bwTenderLogo} />
                                    <Text>t{symbol}</Text>
                                  </Box>
                                }
                                style={{ textAlign: "right", padding: "20px 50px" }}
                                placeholder={"0"}
                              />
                            </Box>
                          </Box>
                          <AmountInputFooter
                            label={`Balance: ${utils.formatEther(tenderTokenBalance?.toString() || "0")} t${symbol}`}
                            onClick={maxTenderTokenDeposit}
                          />
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
                    {selectedToken === symbol ? (
                      <SingleAssetTokenInputForm
                        input={tokenInput}
                        symbol={symbol}
                        balance={tokenBalance}
                        handleSelectToken={handleSelectToken}
                        handleInputChange={handleTokenInputChange}
                        logo={bwLogo}
                        tenderLogo={bwTenderLogo}
                        setInputToMax={maxTenderTokenDeposit}
                      />
                    ) : (
                      <SingleAssetTenderInputForm
                        input={tenderInput}
                        symbol={symbol}
                        balance={tenderTokenBalance}
                        handleSelectToken={handleSelectToken}
                        handleInputChange={handleTokenInputChange}
                        logo={bwLogo}
                        tenderLogo={bwTenderLogo}
                        setInputToMax={maxTenderTokenDeposit}
                      />
                    )}
                  </Box>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Box justify="center" gap="small">
                {
                  // TODO this is a workaround, report gap bug to grommet (applying gap for undefined or empty elements)
                  !isTokenApproved && (isMulti || (!isMulti && tokenSelected)) && (
                    <ApproveToken
                      symbol={symbol}
                      spender={addresses[name].liquidity}
                      token={contracts[name].token}
                      show={!isTokenApproved && (isMulti || (!isMulti && tokenSelected))}
                    />
                  )
                }
                {!isTenderApproved && (isMulti || (!isMulti && selectedToken === `t${symbol}`)) && (
                  <ApproveToken
                    symbol={`t${symbol}`}
                    spender={addresses[name].liquidity}
                    token={contracts[name].tenderToken}
                    show={!isTenderApproved && (isMulti || (!isMulti && selectedToken === `t${symbol}`))}
                  />
                )}
                <Button
                  primary
                  onClick={addLiquidity}
                  disabled={isButtonDisabled()}
                  label={
                    joinPoolTx.status === "Mining" || joinSwapExternAmountInTx.status === "Mining" ? (
                      <LoadingButtonContent label="Adding Liquidity..." />
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

type BodyProps = {
  input: string;
  symbol: string;
  balance: BigNumberish;
  handleSelectToken: (symbol: string) => void;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  logo: any;
  tenderLogo: any;
  setInputToMax: () => void;
};

const SingleAssetTokenInputForm: FC<BodyProps> = ({
  input,
  symbol,
  balance,
  handleSelectToken,
  handleInputChange,
  logo,
  tenderLogo,
  setInputToMax,
}) => {
  return (
    <Form validate="change">
      <FormField
        label={`${symbol} Amount`}
        name="tokenInput"
        validate={[validateIsPositive(input), validateIsLargerThanMax(input, balance)]}
      >
        <Box direction="row" gap="small">
          <Box width="small">
            <Select
              value={
                // TODO padding workaround, select is a button internally and can't take up available space easily
                <Box fill direction="row" gap="small" align="center" pad="7px">
                  <img height={30} width={30} src={logo} alt="token logo" />
                  {symbol}
                </Box>
              }
              options={[
                <Box fill direction="row" gap="small" align="center">
                  <img height={30} width={30} src={tenderLogo} alt="token logo" />
                  {`t${symbol}`}
                </Box>,
              ]}
              onChange={() => handleSelectToken(`t${symbol}`)}
            />
          </Box>
          <Box>
            <TextInput value={input} onChange={handleInputChange} type="text" placeholder={"0"} />
          </Box>
        </Box>
        <AmountInputFooter
          label={`Balance: ${utils.formatEther(balance?.toString() || "0")} ${symbol}`}
          onClick={setInputToMax}
        />
      </FormField>
    </Form>
  );
};

const SingleAssetTenderInputForm: FC<BodyProps> = ({
  input,
  symbol,
  balance,
  handleSelectToken,
  handleInputChange,
  logo,
  tenderLogo,
  setInputToMax,
}) => {
  return (
    <Form validate="change">
      <FormField
        label={`t${symbol} Amount`}
        name="tokenInput"
        validate={[validateIsPositive(input), validateIsLargerThanMax(input, balance)]}
      >
        <Box direction="row" gap="small">
          <Box width="small">
            <Select
              value={
                // TODO padding workaround, select is a button internally and can't take up available space easily
                <Box direction="row" gap="small" align="center" pad="8px">
                  <img height={30} width={30} src={tenderLogo} alt="token logo" />
                  {`t${symbol}`}
                </Box>
              }
              options={[
                <Box direction="row" gap="small" align="center">
                  <img height={30} width={30} src={logo} alt="token logo" />
                  {symbol}
                </Box>,
              ]}
              onChange={() => {
                handleSelectToken(symbol);
              }}
            />
          </Box>

          <Box>
            <TextInput value={input} onChange={handleInputChange} type="text" placeholder={"0"} />
          </Box>
        </Box>
        <AmountInputFooter
          label={`Balance: ${utils.formatEther(balance?.toString() || "0")} t${symbol}`}
          onClick={setInputToMax}
        />
      </FormField>
    </Form>
  );
};

export default JoinPool;
