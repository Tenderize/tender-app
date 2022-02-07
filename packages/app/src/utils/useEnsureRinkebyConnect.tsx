import { ReactElement, useCallback, useState } from "react";
import { ChainId, useEthers } from "@usedapp/core";
import { Box, Button, Card, CardFooter, CardHeader, Heading, Layer } from "grommet";

type InferArguments<T> = T extends (...t: [...infer Arg]) => any ? Arg : never;
type InferReturn<T> = Promise<T extends (...t: [...infer Res]) => infer Res ? Res : never>;

export const useEnsureRinkebyConnect = <TFunc extends (...args: any[]) => any>(
  func: TFunc
): {
  rinkebyForcedFunction: (...args: InferArguments<TFunc>) => InferReturn<TFunc>;
  renderError: () => ReactElement;
} => {
  const { account, chainId } = useEthers();
  const [displayWarning, setdisplayWarning] = useState(false);
  const onClose = useCallback((e) => {
    e.preventDefault();
    setdisplayWarning(false);
  }, []);

  const renderError = () => {
    if (!displayWarning) return <></>;
    return (
      <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={onClose} onClickOutside={onClose}>
        <Card flex={false} pad="medium" width="large">
          <CardHeader justify="center" pad="none">
            <Heading level={2} alignSelf="center">
              {!account ? "Please connect your wallet" : "Please switch to rinkeby to use Tenderize"}
            </Heading>
          </CardHeader>
          <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
            <Box justify="center" gap="small">
              <Button primary onClick={onClose} label={"OK"} />
            </Box>
          </CardFooter>
        </Card>
      </Layer>
    );
  };

  return {
    rinkebyForcedFunction: async (...args: InferArguments<TFunc>) => {
      if (chainId === ChainId.Rinkeby && account != null) {
        return await func(...args);
      } else {
        setdisplayWarning(true);
      }
    },
    renderError,
  };
};
