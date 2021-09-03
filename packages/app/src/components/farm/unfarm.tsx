import { FC, useState } from "react";
import { contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { Button, Box, Card, CardHeader, CardBody, CardFooter, Layer, Form, FormField, TextInput } from "grommet";
import { AmountInputFooter } from "../AmountInputFooter";
import { FormSubtract } from "grommet-icons";
import { ButtonSpinner } from "../ButtonSpinner";
import { validateIsLargerThanMax, validateIsPositive } from "../../utils/inputValidation";
import { useContractFunction } from "../../utils/useDappPatch";

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
    console.log(stake);
    setUnfarmInput(utils.formatEther(stake.toString() || "0"));
  };

  // Contract Functions

  const { state: unfarmTx, send: unfarm } = useContractFunction(contracts[name].farm, "unfarm", {
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
          <Card flex={false} pad="medium" width="large">
            <CardHeader justify="center" pad={{ bottom: "small" }}>{`Unfarm ${symbol}`}</CardHeader>
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
                label={
                  unfarmTx.status === "Mining" ? (
                    <Box direction="row" gap="small" align="center">
                      <ButtonSpinner />
                      Unfarming...
                    </Box>
                  ) : (
                    "Unfarm"
                  )
                }
              />
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Unfarm;
