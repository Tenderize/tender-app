import { FC, useState, ChangeEventHandler, MouseEventHandler } from "react";
import { addresses, contracts } from "@tender/contracts/src/index";
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
import { useCalculateLpTokenAmount, useAddLiquidity, useLiquidityPriceImpact } from "utils/tenderSwapHooks";
import { hasValue, useBalanceValidation } from "utils/inputValidation";
import { isPendingTransaction } from "utils/transactions";
import { weiToEthWithDecimals, withDecimals } from "utils/amountFormat";
import { stakers } from "@tender/shared/src/index";
import { useEthers } from "@usedapp/core";
import { FormClose } from "grommet-icons";
import { useResetInputAfterTx } from "utils/useResetInputAfterTx";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { useIsGnosisSafe } from "utils/context";

type Props = {
  protocolName: ProtocolName;
  symbol: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
};

const AddLiquidity: FC<Props> = ({ protocolName, symbol, tokenBalance, tenderTokenBalance }) => {
  const staker = stakers[protocolName];
  const bwLogo = `/${staker.bwLogo}`;
  const bwTenderLogo = `/${staker.bwTenderLogo}`;
  const [show, setShow] = useState(false);
  const { account } = useEthers();

  // whether supported asset (e.g. LPT) has ERC20 permit support
  const hasPermit = stakers[protocolName].hasPermit;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tokenInput, setTokenInput] = useState("");

  const [tenderInput, setTenderInput] = useState("");

  const lpTokenSymbol = `t${symbol}-SWAP`;

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

  const isTokenApproved = useIsTokenApproved(
    addresses[protocolName].token,
    account,
    addresses[protocolName].tenderSwap,
    tokenInput
  );
  const isTenderApproved = useIsTokenApproved(
    addresses[protocolName].tenderToken,
    account,
    addresses[protocolName].tenderSwap,
    tenderInput
  );

  const isSafeContext = useIsGnosisSafe();

  const isButtonDisabled = () => {
    // if either field has an invalid value return true
    if (!hasValue(tokenInput) || !hasValue(tenderInput)) return true;
    // if a transaction is pending return true
    if (isPendingTransaction(addLiquidityTx)) return true;
    // if underlying token (e.g. LPT) has no permit support and is not approved, return true
    if ((!hasPermit || isSafeContext) && !isTokenApproved) return true;
  };

  const { addLiquidity, tx: addLiquidityTx } = useAddLiquidity(protocolName, isTokenApproved, isTenderApproved);

  const lpTokenAmount = useCalculateLpTokenAmount(
    addresses[protocolName].tenderSwap,
    [utils.parseEther(tenderInput || "0"), utils.parseEther(tokenInput || "0")],
    true
  );

  const handleAddLiquidity: MouseEventHandler<HTMLButtonElement & HTMLAnchorElement> = async (e) => {
    e.preventDefault();
    const tokenIn = utils.parseEther(tokenInput || "0");
    const tenderIn = utils.parseEther(tenderInput || "0");
    addLiquidity(tenderIn, tokenIn, lpTokenAmount.sub(1), isSafeContext);
  };

  const { validationMessage: tokenValidationMessage } = useBalanceValidation(tokenInput, tokenBalance);
  const { validationMessage: tenderValidationMessage } = useBalanceValidation(tenderInput, tenderTokenBalance);

  useResetInputAfterTx(addLiquidityTx, (input: string) => {
    setTokenInput(input);
    setTenderInput(input);
  });

  const { priceImpact } = useLiquidityPriceImpact(addresses[protocolName].tenderSwap, true, tokenInput, tenderInput);

  return (
    <Box pad={{ horizontal: "large", top: "small" }}>
      <Button primary onClick={handleShow} label="Add Liquidity" />
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
                {`Add t${symbol}/${symbol} Liquidity`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box pad={{ top: "medium", horizontal: "large" }} align="center">
                <Form style={{ width: "100%" }}>
                  <Box gap="medium">
                    <FormField label={`${symbol} Amount`} protocolName="tokenInput">
                      <TextInput
                        value={tokenInput}
                        onChange={handleTokenInputChange}
                        type="number"
                        icon={
                          <Box pad="xsmall" direction="row" align="center" gap="small">
                            <Image height="35" src={bwLogo} />
                            <Text>{symbol}</Text>
                          </Box>
                        }
                        style={{ textAlign: "right", padding: "20px 50px" }}
                        placeholder={"0"}
                      />
                      <Text color="red">{tokenValidationMessage}</Text>
                      <AmountInputFooter
                        label={`Balance: ${weiToEthWithDecimals(tokenBalance?.toString() || "0", 6)} ${symbol}`}
                        onClick={maxTokenDeposit}
                      />
                    </FormField>
                    <FormField label={`t${symbol} Amount`} protocolName="tenderInput">
                      <TextInput
                        value={tenderInput}
                        onChange={handleTenderInputChange}
                        type="number"
                        icon={
                          <Box pad="xsmall" direction="row" align="center" gap="small">
                            <Image height="35" src={bwTenderLogo} />
                            <Text>t{symbol}</Text>
                          </Box>
                        }
                        style={{ textAlign: "right", padding: "20px 50px" }}
                        placeholder={"0"}
                      />
                      <Text color="red">{tenderValidationMessage}</Text>
                      <AmountInputFooter
                        label={`Balance: ${weiToEthWithDecimals(tenderTokenBalance?.toString() || "0", 6)} t${symbol}`}
                        onClick={maxTenderTokenDeposit}
                      />
                    </FormField>
                    <FormField label={`Amount of ${lpTokenSymbol} to receive`}>
                      <TextInput
                        readOnly
                        disabled
                        value={weiToEthWithDecimals(lpTokenAmount, 6)}
                        placeholder={"0"}
                        type="number"
                        style={{ textAlign: "right", padding: "20px 50px" }}
                        icon={
                          <Box pad="xsmall" direction="row" align="center" gap="small">
                            <Text>{lpTokenSymbol}</Text>
                          </Box>
                        }
                      />
                    </FormField>
                    <Text textAlign="end">{`Price impact: ${withDecimals((priceImpact * 100).toString(), 2)} %`}</Text>
                  </Box>
                </Form>
              </Box>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ vertical: "medium" }}>
              <Box style={{ width: "100%" }} pad={{ horizontal: "large" }} justify="center" gap="small">
                {
                  // TODO this is a workaround, report gap bug to grommet (applying gap for undefined or empty elements)
                  !isTokenApproved && (
                    <ApproveToken
                      symbol={symbol}
                      spender={addresses[protocolName].tenderSwap}
                      token={contracts[protocolName].token}
                      show={(!hasPermit || isSafeContext) && !isTokenApproved}
                      chainId={stakers[protocolName].chainId}
                    />
                  )
                }
                {!isTenderApproved && (
                  <ApproveToken
                    symbol={bwTenderLogo}
                    spender={addresses[protocolName].tenderSwap}
                    token={contracts[protocolName].tenderToken}
                    show={isSafeContext && !isTenderApproved}
                    chainId={stakers[protocolName].chainId}
                  />
                )}
                <Button
                  primary
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

export default AddLiquidity;
