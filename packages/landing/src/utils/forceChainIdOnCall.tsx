import { ReactElement, useCallback, useState } from "react";
import { ChainId, useEthers } from "@usedapp/core";
import { Box, Button, Card, CardFooter, CardHeader, Layer } from "grommet";

type InferArguments<T> = T extends (...t: [...infer Arg]) => any ? Arg : never;
type InferReturn<T> = Promise<T extends (...t: [...infer Res]) => infer Res ? Res : never>;

export const useForceRinkebyFunction = <TFunc extends (...args: any[]) => any>(
  func: TFunc
): {
  rinkebyForcedFunction: (...args: InferArguments<TFunc>) => InferReturn<TFunc>;
  renderError: () => ReactElement;
} => {
  const { chainId } = useEthers();
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const onClose = useCallback((e) => {
    e.preventDefault();
    setWrongNetwork(false);
  }, []);

  const renderError = () => {
    if (wrongNetwork === false) return <></>;
    return (
      <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={onClose} onClickOutside={onClose}>
        <Card flex={false} pad="medium" width="large">
          <CardHeader justify="center" pad={{ bottom: "small" }}>
            {"Please switch to rinkeby to use Tenderize"}
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
      if (chainId === ChainId.Rinkeby) {
        return await func(...args);
      } else {
        setWrongNetwork(true);
      }
    },
    renderError,
  };
};
