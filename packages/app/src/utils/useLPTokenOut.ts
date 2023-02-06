import { addresses } from "@tender/contracts/src";
import { useCalculateLpTokenAmount } from "./tenderSwapHooks";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { constants, utils } from "ethers";
import { useEffect, useState } from "react";
import { weiToEthInFloat } from "./amountFormat";

export const useLPTokenOut = (protocolName: ProtocolName, tenderInput: string, tokenInput: string) => {
  const defaultLPTokenOut = useCalculateLpTokenAmount(
    addresses[protocolName].tenderSwap,
    [utils.parseEther(tenderInput || "0"), utils.parseEther(tokenInput || "0")],
    true
  );
  const [lpTokenMinOut, setLPTokenMinOut] = useState(defaultLPTokenOut);

  const sumIn = utils.parseEther(tokenInput || "0").add(utils.parseEther(tenderInput || "0"));
  const suggestedSlippage = defaultLPTokenOut.eq(constants.Zero)
    ? 0
    : round(Math.abs((1 - weiToEthInFloat(sumIn) / weiToEthInFloat(defaultLPTokenOut)) * 100));
  const [slippage, setSlippage] = useState(suggestedSlippage);

  useEffect(() => {
    setSlippage(suggestedSlippage);
  }, [suggestedSlippage]);

  useEffect(() => {
    const sumIn = utils.parseEther(tokenInput || "0").add(utils.parseEther(tenderInput || "0"));
    const outMin = sumIn.sub(
      sumIn
        .mul(slippage * 100)
        .div(100)
        .div(100)
    );

    setLPTokenMinOut(outMin ?? constants.Zero);
  }, [slippage, tokenInput, tenderInput]);

  return {
    lpTokenMinOut,
    slippage,
    setSlippage,
    suggestedSlippage,
  };
};

const round = (v: number): number => {
  return Math.round(v * 100) / 100;
};
