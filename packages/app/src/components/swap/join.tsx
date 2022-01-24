import { FC, useState, ChangeEventHandler, MouseEventHandler } from "react";
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
  Heading,
} from "grommet";
import ApproveToken from "components/approve/ApproveToken";
import { useIsTokenApproved } from "components/approve/useIsTokenApproved";
import { AmountInputFooter } from "components/AmountInputFooter";
import { LoadingButtonContent } from "components/LoadingButtonContent";
import { useCalculateLpTokenAmount, getDeadline } from "utils/tenderSwapHooks";
import { validateIsPositive, validateIsLargerThanMax, hasValue } from "utils/inputValidation";
import { isPendingTransaction } from "utils/transactions";
import { weiToEthWithDecimals } from "utils/amountFormat";
import stakers from "data/stakers";
import { useContractFunction, useEthers } from "@usedapp/core";
import { FormClose } from "grommet-icons";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
};

const JoinPool: FC<Props> = ({ name, symbol, tokenBalance, tenderTokenBalance }) => {
  const staker = stakers[name];
  const bwLogo = `/${staker.bwLogo}`;
  const bwTenderLogo = `/${staker.bwTenderLogo}`;
  const [show, setShow] = useState(false);
  const { account } = useEthers();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tokenInput, setTokenInput] = useState("");

  const [tenderInput, setTenderInput] = useState("");

  const lpTokenSymbol = `t${symbol}-${symbol}-SWAP`;

  const handleTenderInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setTenderInput(val);
  };

  const handleTokenInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setTokenInput(val);
  };

  const maxTokenDeposit = () => {
    setTokenInput(utils.formatEther(tokenBalance || "0"));
  };

  const maxTenderTokenDeposit = () => {
    setTenderInput(utils.formatEther(tenderTokenBalance || "0"));
  };

  const isTokenApproved = useIsTokenApproved(addresses[name].token, account, addresses[name].tenderSwap, tokenInput);
  const isTenderApproved = useIsTokenApproved(
    addresses[name].tenderToken,
    account,
    addresses[name].tenderSwap,
    tenderInput
  );

  const isButtonDisabled = () => {
    return (
      !(hasValue(tokenInput) && hasValue(tenderInput) && isTokenApproved && isTenderApproved) ||
      isPendingTransaction(addLiquidityTx)
    );
  };

  const { state: addLiquidityTx, send: addLiquidity } = useContractFunction(
    contracts[name].tenderSwap,
    "addLiquidity",
    { transactionName: `Add t${symbol}/${symbol} Liquidity` }
  );

  const lpTokenAmount = useCalculateLpTokenAmount(
    addresses[name].tenderSwap,
    [utils.parseEther(tokenInput || "0"), utils.parseEther(tenderInput || "0")],
    true
  );

  const handleAddLiquidity: MouseEventHandler<HTMLButtonElement & HTMLAnchorElement> = async (e) => {
    e.preventDefault();
    const tokenIn = utils.parseEther(tokenInput || "0");
    const tenderIn = utils.parseEther(tenderInput || "0");
    addLiquidity([tenderIn, tokenIn], lpTokenAmount.sub(1), getDeadline());
  };

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
          <Card flex={false} pad="medium" width="large" style={{ position: "relative" }}>
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={handleClose}
            />
            <CardHeader justify="center" pad={{ bottom: "small" }}>
              <Heading level={2} alignSelf="center">
                {`Join tender${symbol}/${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box pad={{ top: "medium" }} align="center">
                <Form validate="change">
                  <Box gap="medium">
                    <FormField
                      label={`${symbol} Amount`}
                      name="tokenInput"
                      validate={[validateIsPositive(tokenInput), validateIsLargerThanMax(tokenInput, tokenBalance)]}
                    >
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
                      <AmountInputFooter
                        label={`Balance: ${utils.formatEther(tenderTokenBalance?.toString() || "0")} t${symbol}`}
                        onClick={maxTenderTokenDeposit}
                      />
                    </FormField>
                  </Box>
                </Form>
                <Text>
                  {lpTokenAmount && !lpTokenAmount.isZero() ? (
                    <>
                      You will receive {weiToEthWithDecimals(lpTokenAmount, 6)} {lpTokenSymbol}
                    </>
                  ) : (
                    <>&nbsp;</>
                  )}
                </Text>
              </Box>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Box justify="center" gap="small">
                {
                  // TODO this is a workaround, report gap bug to grommet (applying gap for undefined or empty elements)
                  !isTokenApproved && (
                    <ApproveToken
                      symbol={symbol}
                      spender={addresses[name].tenderSwap}
                      token={contracts[name].token}
                      show={!isTokenApproved}
                    />
                  )
                }
                {!isTenderApproved && (
                  <ApproveToken
                    symbol={`t${symbol}`}
                    spender={addresses[name].tenderSwap}
                    token={contracts[name].tenderToken}
                    show={!isTenderApproved}
                  />
                )}
                <Button
                  primary
                  style={{ width: 467 }}
                  onClick={handleAddLiquidity}
                  disabled={isButtonDisabled()}
                  label={
                    isPendingTransaction(addLiquidityTx) ? (
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

export default JoinPool;
