import { FC, useState } from "react";
import { contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { Button, Card, CardHeader, CardBody, CardFooter, Layer, Form, FormField, TextInput, Heading } from "grommet";
import { AmountInputFooter } from "../AmountInputFooter";
import { FormClose, FormSubtract } from "grommet-icons";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { validateIsLargerThanMax, validateIsPositive } from "../../utils/inputValidation";
import { useContractFunction } from "@usedapp/core";

type Props = {
  name: string;
  symbol: string;
  stake: BigNumberish;
};

const Unfarm: FC<Props> = ({ name, symbol, stake }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [unfarmInput, setUnfarmInput] = useState("");
  const handleUnfarmInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setUnfarmInput(val);
  };

  const maxUnfarm = () => {
    setUnfarmInput(utils.formatEther(stake.toString() || "0"));
  };

  const { state: unfarmTx, send: unfarm } = useContractFunction(contracts[name].tenderFarm, "unfarm", {
    transactionName: `Unfarm ${symbol}`,
  });
  const unfarmLpTokens = async (e: any) => {
    e.preventDefault();
    await unfarm(utils.parseEther(unfarmInput || "0"));
    setUnfarmInput("");
  };

  return (
    <>
      <Button
        primary
        reverse
        icon={<FormSubtract color="white" />}
        onClick={handleShow}
        label="Unfarm"
        disabled={stake.toString() === "0"}
      />
      {show && (
        <Layer
          style={{ overflow: "auto" }}
          animation="fadeIn"
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Card flex={false} style={{ position: "relative" }} pad="medium" width="large">
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={handleClose}
            />
            <CardHeader justify="center" pad={{ bottom: "small" }}>
              <Heading level={2} alignSelf="center">
                {`Unfarm ${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Form validate="change">
                <FormField
                  label="Unfarm Amount"
                  validate={[validateIsPositive(unfarmInput), validateIsLargerThanMax(unfarmInput, stake)]}
                >
                  <TextInput
                    value={unfarmInput}
                    onChange={handleUnfarmInputChange}
                    type="text"
                    placeholder={"0 " + symbol}
                  />
                  <AmountInputFooter
                    label={`Current Stake: ${utils.formatEther(stake?.toString() || "0")} ${symbol}`}
                    onClick={maxUnfarm}
                  />
                </FormField>
              </Form>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Button primary onClick={handleClose} label="Cancel" />
              <Button
                secondary
                disabled={!unfarmInput || unfarmInput.toString() === "0" || unfarmTx.status === "Mining"}
                onClick={unfarmLpTokens}
                label={unfarmTx.status === "Mining" ? <LoadingButtonContent label="Unfarming..." /> : "Unfarm"}
              />
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Unfarm;
