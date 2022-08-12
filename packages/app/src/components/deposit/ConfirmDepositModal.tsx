import { FC, MouseEventHandler, useEffect, useState } from "react";
import { utils, BigNumberish } from "ethers";
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
  Image,
  TextInput,
  Text,
  Heading,
} from "grommet";

import { FormClose } from "grommet-icons";
import { stakers, theme } from "@tender/shared/src/index";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { useBalanceValidation } from "utils/inputValidation";
import { AmountInputFooter } from "components/AmountInputFooter";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { isPendingTransaction } from "utils/transactions";
import { TransactionStatus } from "@usedapp/core";
import { LoadingButtonContent } from "components/LoadingButtonContent";
import { useCalcDepositOut } from "utils/tenderDepositHooks";
import styled from "styled-components";
import { normalizeColor } from "grommet/utils";

type Props = {
  show: boolean;
  tokenAmount: string;
  setTokenAmount: (v: string) => void;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
  protocolName: ProtocolName;
  onDismiss: () => void;
  deposit: MouseEventHandler<HTMLElement>;
  tx: TransactionStatus;
};

const ConfirmDepositModal: FC<Props> = ({
  show,
  tokenAmount,
  tokenBalance,
  setTokenAmount,
  tenderTokenBalance,
  protocolName,
  onDismiss,
  deposit,
  tx,
}) => {
  const staker = stakers[protocolName];
  const symbol = staker.symbol;
  const bwLogo = `/${staker.bwLogo}`;
  const bwTenderLogo = `/${staker.bwTenderLogo}`;

  const { validationMessage } = useBalanceValidation(tokenAmount, tokenBalance, symbol);
  const [confirmStatus, setConfirmStatus] = useState<"None" | "Waiting">("None");

  // reset to initial state
  useEffect(() => {
    if (show === true) {
      setConfirmStatus("None");
    }
  }, [show]);

  const tokenOut = useCalcDepositOut(
    protocolName,
    utils.formatUnits(utils.parseUnits(tokenAmount || "0", "ether"), "wei")
  );

  const isGRT = symbol === "GRT";

  return (
    <>
      {show && (
        <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={onDismiss} onClickOutside={onDismiss}>
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
              onClick={onDismiss}
            />
            <CardHeader justify="center" pad="none">
              <Heading level={2} alignSelf="center">
                {`Confirm Stake ${symbol} for t${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box pad={{ top: "medium", horizontal: "large" }} align="center">
                <Form style={{ width: "100%" }}>
                  <Box gap="medium">
                    <FormField label={`Stake ${symbol}`}>
                      <TextInput
                        id="formDepositStake"
                        type="number"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        required={true}
                        style={{ textAlign: "right", padding: "20px 50px" }}
                        icon={
                          <Box pad="xsmall" direction="row" align="center" gap="small">
                            <Image height="35" src={bwLogo} />
                            <Text>{symbol}</Text>
                          </Box>
                        }
                      />
                      <Text color="red">{validationMessage}</Text>
                      <AmountInputFooter
                        label={`Balance: ${weiToEthWithDecimals(tokenBalance, 6)} ${symbol}`}
                        onClick={() => {
                          setTokenAmount(utils.formatEther(tokenBalance.toString() ?? "0"));
                        }}
                      />
                    </FormField>
                    <FormField label={`Receive t${symbol}`}>
                      <TextInput
                        readOnly
                        id="formDepositReceive"
                        placeholder={"0"}
                        value={weiToEthWithDecimals(tokenOut, 6)}
                        style={{ textAlign: "right", padding: "20px 50px" }}
                        icon={
                          <Box pad="xsmall" direction="row" align="center" gap="small">
                            <Image height="35" src={bwTenderLogo} />
                            <Text>{`t${symbol}`}</Text>
                          </Box>
                        }
                      />
                      <AmountInputFooter label={`Balance: ${weiToEthWithDecimals(tenderTokenBalance, 6)} ${symbol}`} />
                    </FormField>
                    {isGRT && (
                      <Box>
                        <Text>
                          Notice: staking GRT infers a 0.5%{" "}
                          <StyledA href="https://thegraph.com/docs/en/network/delegating/#the-delegation-tax">
                            delegation
                          </StyledA>{" "}
                          fee towards the Graph Protocol.
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Form>
              </Box>
            </CardBody>
            <CardFooter justify="center" pad={{ vertical: "medium" }}>
              <Box style={{ width: "100%" }} pad={{ horizontal: "large" }} justify="center" gap="small">
                <Button
                  primary
                  onClick={(e) => {
                    deposit(e);
                    setConfirmStatus("Waiting");
                  }}
                  label={
                    isPendingTransaction(tx) || confirmStatus === "Waiting" ? (
                      <LoadingButtonContent label="Staking..." />
                    ) : (
                      "Confirm Stake"
                    )
                  }
                />
              </Box>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default ConfirmDepositModal;

const brandColor = normalizeColor("brand", theme);
const StyledA = styled.a`
  color: ${brandColor};
`;
