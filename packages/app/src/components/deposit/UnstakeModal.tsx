import { FC, MouseEventHandler, useState } from "react";
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
import { stakers } from "@tender/shared/src/index";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { isLargerThanMax, isPositive, useBalanceValidation } from "utils/inputValidation";
import { AmountInputFooter } from "components/AmountInputFooter";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { useUnstake } from "utils/tenderDepositHooks";
import { BrandedALink } from "components/BrandedALink";

type Props = {
  show: boolean;
  tenderTokenBalance: BigNumberish;
  protocolName: ProtocolName;
  onDismiss: () => void;
};

const UnstakeModal: FC<Props> = ({ show, tenderTokenBalance, protocolName, onDismiss }) => {
  const staker = stakers[protocolName];
  const symbol = staker.symbol;
  const bwTenderLogo = `/${staker.bwTenderLogo}`;

  const [unstakeInput, setUnstakeInput] = useState("");

  const { validationMessage } = useBalanceValidation(unstakeInput, tenderTokenBalance, symbol);

  const maxUnstake = () => {
    setUnstakeInput(utils.formatEther(tenderTokenBalance.toString()));
  };

  const handleInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setUnstakeInput(val);
  };

  const { unstake } = useUnstake(protocolName);

  const handleUnstake: MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();
    await unstake(utils.parseEther(unstakeInput || "0"));
    setUnstakeInput("");
    onDismiss();
  };

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
                {`Unstake t${symbol} for ${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box pad={{ top: "medium", horizontal: "large" }} align="center">
                <Form style={{ width: "100%" }}>
                  <Box gap="medium">
                    <FormField label={`Unstake t${symbol}`}>
                      <TextInput
                        id="formUnstake"
                        type="number"
                        placeholder="0"
                        value={unstakeInput}
                        onChange={handleInputChange}
                        required={true}
                        style={{ textAlign: "right", padding: "20px 50px" }}
                        icon={
                          <Box pad="xsmall" direction="row" align="center" gap="small">
                            <Image height="35" src={bwTenderLogo} />
                            <Text>{`t${symbol}`}</Text>
                          </Box>
                        }
                      />
                      <Text color="red">{validationMessage}</Text>
                      <AmountInputFooter
                        label={`Balance: ${weiToEthWithDecimals(tenderTokenBalance, 6)} t${symbol}`}
                        onClick={maxUnstake}
                      />
                    </FormField>

                    <Box>
                      <Text>
                        After unstaking, the tokens will have to go through an unbonding period. The exact withdrawing
                        date depends on the <BrandedALink href={getWithdrawLink(protocolName)}>underlying</BrandedALink>{" "}
                        protocol.
                      </Text>
                    </Box>
                  </Box>
                </Form>
              </Box>
            </CardBody>
            <CardFooter justify="center" pad={{ vertical: "medium" }}>
              <Box style={{ width: "100%" }} pad={{ horizontal: "large" }} justify="center" gap="small">
                <Button
                  primary
                  disabled={
                    !isPositive(unstakeInput) ||
                    isLargerThanMax(unstakeInput, tenderTokenBalance) ||
                    unstakeInput.toString() === "0"
                  }
                  onClick={handleUnstake}
                  label={"Unstake"}
                />
              </Box>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default UnstakeModal;

const getWithdrawLink = (protocolName: ProtocolName): string => {
  switch (protocolName) {
    case "audius":
      return "https://docs.audius.org/token/staking#staking-on-audius";
    case "graph":
      return "https://thegraph.com/docs/en/network/delegating/#the-delegation-tax";
    case "livepeer":
      return "https://www.figment.io/resources/livepeer-staking-delegation-guide-2";
    case "matic":
      return "https://polygon.technology/staking/";
  }
};
