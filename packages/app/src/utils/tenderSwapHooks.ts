import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { abis, addresses } from "@tender/contracts/src/index";
import { BigNumber, constants, Contract, utils } from "ethers";
import { stakers } from "@tender/shared/src/index";
import { TenderSwap } from "@tender/contracts/gen/types";
import { weiToEthInFloat } from "./amountFormat";
import { signERC2612PermitPatched } from "./signERC2612PermitPatch";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { hasPermit } from "./context";
import { useIsTokenApproved } from "components/approve/useIsTokenApproved";

const TenderSwapABI = new utils.Interface(abis.tenderSwap);

export const useCalculateLpTokenAmount = (pool: string, amounts: BigNumber[], deposit: boolean) => {
  const swapContract = new Contract(pool, TenderSwapABI) as TenderSwap;

  const result = useCall(
    pool &&
      amounts.length === 2 &&
      amounts[0] &&
      amounts[1] && {
        contract: swapContract,
        method: "calculateTokenAmount",
        args: [amounts, deposit],
      }
  );
  return result?.value?.[0].mul(999).div(1000) ?? constants.Zero;
};

export const useCalculateRemoveLiquidity = (pool: string, amount: BigNumber): [BigNumber, BigNumber] => {
  const swapContract = new Contract(pool, TenderSwapABI) as TenderSwap;

  const result = useCall(
    pool &&
      amount &&
      !amount.isZero() && {
        contract: swapContract,
        method: "calculateRemoveLiquidity",
        args: [amount],
      }
  );
  return result?.value?.[0] ?? [constants.Zero, constants.Zero];
};

export const useCalculateRemoveLiquidityOneToken = (
  pool: string,
  amount: BigNumber,
  tokenReceive: string
): BigNumber => {
  const swapContract = new Contract(pool, TenderSwapABI) as TenderSwap;

  const result = useCall(
    pool &&
      amount &&
      !amount.isZero() &&
      tokenReceive && {
        contract: swapContract,
        method: "calculateRemoveLiquidityOneToken",
        args: [amount, tokenReceive],
      }
  );

  return result?.value?.[0] ?? constants.Zero;
};

export const useSwapPriceImpact = (
  isSendingToken: boolean,
  pool: string,
  inputAmount: string,
  receiveAmount: BigNumber
) => {
  const swapContract = new Contract(pool, TenderSwapABI) as TenderSwap;

  const resultVirtualPrice = useCall(
    pool && {
      contract: swapContract,
      method: "getVirtualPrice",
      args: [],
    }
  );

  const virtualPrice = resultVirtualPrice?.value?.[0] ?? constants.One;

  const priceImpact = calculatePriceImpact(
    utils.parseEther(inputAmount === "" ? "0" : inputAmount),
    receiveAmount,
    virtualPrice,
    !isSendingToken
  );

  return { priceImpact };
};

const calculatePriceImpact = (
  tokenInputAmount: BigNumber,
  tokenOutputAmount: BigNumber,
  virtualPrice: BigNumber,
  isWithdraw = false
) => {
  if (tokenInputAmount.lte(0)) {
    return 0;
  }

  return isWithdraw
    ? weiToEthInFloat(tokenOutputAmount) / (weiToEthInFloat(tokenInputAmount) * weiToEthInFloat(virtualPrice)) - 1
    : (weiToEthInFloat(virtualPrice) * weiToEthInFloat(tokenOutputAmount)) / weiToEthInFloat(tokenInputAmount) - 1;
};

export const useLiquidityPriceImpact = (
  pool: string,
  addLiquidity: boolean,
  tokenAmount: string,
  tenderTokenAmount: string
) => {
  const swapContract = new Contract(pool, TenderSwapABI) as TenderSwap;

  const resultTenderToken = useCall(
    pool && {
      contract: swapContract,
      method: "getToken0Balance",
      args: [],
    }
  );
  const resultUnderlyingToken = useCall(
    pool && {
      contract: swapContract,
      method: "getToken1Balance",
      args: [],
    }
  );

  const tokenBalance = resultUnderlyingToken?.value?.[0] ?? constants.One;
  const tenderTokenBalance = resultTenderToken?.value?.[0] ?? constants.One;

  const tokenIn = utils.parseEther(tokenAmount || "0");
  const tenderIn = utils.parseEther(tenderTokenAmount || "0");

  const spotPrice = getSpotPrice(tenderTokenBalance, tokenBalance);
  const executionPrice = getSpotPrice(
    addLiquidity ? tenderTokenBalance.add(tenderIn) : tenderTokenBalance.sub(tenderIn),
    addLiquidity ? tokenBalance.add(tokenIn) : tokenBalance.sub(tokenIn)
  );

  return {
    priceImpact: (executionPrice - spotPrice) / spotPrice,
  };
};

export const getExecutionPrice = (receiveAmount: BigNumber, sendAmount: BigNumber) => {
  return weiToEthInFloat(receiveAmount) / weiToEthInFloat(sendAmount);
};

const getSpotPrice = (tokenSendedBalance: BigNumber, tokenReceivedBalance: BigNumber) => {
  return weiToEthInFloat(tokenSendedBalance) / weiToEthInFloat(tokenReceivedBalance);
};

export const useCalculateSwap = (pool: string, tokenFrom: string, amount: BigNumber) => {
  const swapContract = new Contract(pool, TenderSwapABI) as TenderSwap;

  const result = useCall(
    pool &&
      tokenFrom &&
      amount &&
      !amount.isZero() && {
        contract: swapContract,
        method: "calculateSwap",
        args: [tokenFrom, amount],
      }
  );
  return result?.value?.[0] ?? constants.Zero;
};

export const useSwapWithPermit = (
  token: string,
  protocolName: ProtocolName,
  tokenSendedSymbol: string,
  tokenReceivedSymbol: string,
  owner: string | null | undefined,
  spender: string,
  amount: BigNumber
) => {
  const swapContract = new Contract(addresses[protocolName].tenderSwap, TenderSwapABI) as TenderSwap;

  const { state, send: multicall } = useContractFunction(swapContract, "multicall", {
    transactionName: `Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`,
  });
  const { library } = useEthers();

  const swapWithPermit = async (
    tokenAddress: string,
    tokenAmount: BigNumber,
    minAmount: BigNumber,
    deadline: number
  ) => {
    const permit = await signERC2612PermitPatched(
      library?.getSigner(),
      token,
      owner ?? "",
      spender,
      amount?.toString(),
      getDeadline()
    );
    await multicall([
      TenderSwapABI.encodeFunctionData("selfPermit", [
        token,
        permit.value,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s,
      ]),
      TenderSwapABI.encodeFunctionData("swap", [tokenAddress, tokenAmount, minAmount, deadline]),
    ]);
  };

  return { swapWithPermit, tx: state };
};

export const useExitPoolSingle = (
  token: string,
  protocolName: ProtocolName,
  owner: string | null | undefined,
  spender: string,
  symbol: string,
  lpSharesInputSingle: string
) => {
  const swapContract = new Contract(addresses[protocolName].tenderSwap, TenderSwapABI) as TenderSwap;

  const { account } = useEthers();

  const isLpSharesApproved = useIsTokenApproved(
    addresses[protocolName].lpToken,
    account,
    addresses[protocolName].tenderSwap,
    lpSharesInputSingle
  );

  const { state: removeLiquidityWithPermitTx, send: multicall } = useContractFunction(swapContract, "multicall", {
    transactionName: `exit t${symbol}/${symbol} Liquidity Pool`,
  });

  const { state: removeLiquidityWithApproveTx, send: removeLiquidity } = useContractFunction(
    swapContract,
    "removeLiquidityOneToken",
    {
      transactionName: `Remove t${symbol}/${symbol} Liquidity`,
    }
  );

  const state = isLpSharesApproved ? removeLiquidityWithApproveTx : removeLiquidityWithPermitTx;
  const { library } = useEthers();

  const removeLiquiditySingleOut = async (
    lpSharesInputSingle: BigNumber,
    singleTokenOutAddress: string,
    singleOut: BigNumber
  ) => {
    const deadline = getDeadline();

    if (!isLpSharesApproved) {
      const permit = await signERC2612PermitPatched(
        library?.getSigner(),
        token,
        owner ?? "",
        spender,
        lpSharesInputSingle.toString(),
        deadline
      );

      await multicall([
        TenderSwapABI.encodeFunctionData("selfPermit", [
          token,
          permit.value,
          permit.deadline,
          permit.v,
          permit.r,
          permit.s,
        ]),
        TenderSwapABI.encodeFunctionData("removeLiquidityOneToken", [
          lpSharesInputSingle,
          singleTokenOutAddress,
          singleOut,
          deadline,
        ]),
      ]);
    } else {
      await removeLiquidity(lpSharesInputSingle, singleTokenOutAddress, singleOut, deadline);
    }
  };

  return { removeLiquiditySingleOut, tx: state };
};

export const useExitPool = (
  token: string,
  protocolName: ProtocolName,
  owner: string | null | undefined,
  spender: string,
  symbol: string,
  lpSharesInputMulti: string
) => {
  const swapContract = new Contract(addresses[protocolName].tenderSwap, TenderSwapABI) as TenderSwap;

  const { account } = useEthers();
  const isLpSharesApproved = useIsTokenApproved(
    addresses[protocolName].lpToken,
    account,
    addresses[protocolName].tenderSwap,
    lpSharesInputMulti
  );

  const { state: removeLiquidityWithPermitTx, send: multicall } = useContractFunction(swapContract, "multicall", {
    transactionName: `exit t${symbol}/${symbol} Liquidity Pool`,
  });

  const { state: removeLiquidityWithApproveTx, send: removeLiquidityFunction } = useContractFunction(
    swapContract,
    "removeLiquidity",
    {
      transactionName: `Remove t${symbol}/${symbol} Liquidity`,
    }
  );

  const state = isLpSharesApproved ? removeLiquidityWithApproveTx : removeLiquidityWithPermitTx;
  const { library } = useEthers();

  const removeLiquidity = async (lpSharesInputMulti: BigNumber, tenderOut: BigNumber, tokenOut: BigNumber) => {
    const deadline = getDeadline();

    if (!isLpSharesApproved) {
      const permit = await signERC2612PermitPatched(
        library?.getSigner(),
        token,
        owner ?? "",
        spender,
        lpSharesInputMulti.toString(),
        deadline
      );

      await multicall([
        TenderSwapABI.encodeFunctionData("selfPermit", [
          token,
          permit.value,
          permit.deadline,
          permit.v,
          permit.r,
          permit.s,
        ]),
        TenderSwapABI.encodeFunctionData("removeLiquidity", [lpSharesInputMulti, [tenderOut, tokenOut], deadline]),
      ]);
    } else {
      await removeLiquidityFunction(lpSharesInputMulti, [tenderOut, tokenOut], deadline);
    }
  };

  return { removeLiquidity, exitPoolTx: state };
};

export const useAddLiquidity = (protocolName: ProtocolName, isTokenApproved: boolean, isTenderApproved: boolean) => {
  const swapContract = new Contract(addresses[protocolName].tenderSwap, TenderSwapABI) as TenderSwap;
  const symbol = stakers[protocolName].symbol;

  const { state: addLiquidityWithPermitTx, send: multicall } = useContractFunction(swapContract, "multicall", {
    transactionName: `Add t${symbol}/${symbol} Liquidity`,
  });
  const { state: addLiquidityWithApproveTx, send: addLiquidityWithApprove } = useContractFunction(
    swapContract,
    "addLiquidity",
    { transactionName: `Add t${symbol}/${symbol} Liquidity` }
  );

  const { library, account } = useEthers();
  const multicallData: string[] = [];

  const addLiquidity = async (
    tenderIn: BigNumber,
    tokenIn: BigNumber,
    lpTokenAmount: BigNumber,
    isSafeContext: boolean
  ) => {
    if (!isTenderApproved && !isSafeContext) {
      const tenderToken = addresses[protocolName].tenderToken;
      const permit = await signERC2612PermitPatched(
        library?.getSigner(),
        tenderToken,
        account ?? "",
        addresses[protocolName].tenderSwap,
        tenderIn?.toString(),
        getDeadline()
      );

      multicallData.push(
        TenderSwapABI.encodeFunctionData("selfPermit", [
          tenderToken,
          permit.value,
          permit.deadline,
          permit.v,
          permit.r,
          permit.s,
        ])
      );
    }

    if (!tokenIn.isZero() && hasPermit(protocolName) && !isTokenApproved && !isSafeContext) {
      const token = addresses[protocolName].token;
      const permit = await signERC2612PermitPatched(
        library?.getSigner(),
        token,
        account ?? "",
        addresses[protocolName].tenderSwap,
        tokenIn?.toString(),
        getDeadline()
      );

      multicallData.push(
        TenderSwapABI.encodeFunctionData("selfPermit", [
          token,
          permit.value,
          permit.deadline,
          permit.v,
          permit.r,
          permit.s,
        ])
      );
    }

    if (multicallData.length > 0) {
      multicallData.push(
        TenderSwapABI.encodeFunctionData("addLiquidity", [[tenderIn, tokenIn], lpTokenAmount, getDeadline()])
      );
      await multicall(multicallData);
    } else {
      await addLiquidityWithApprove([tenderIn, tokenIn], lpTokenAmount, getDeadline());
    }
  };

  const state =
    !isTenderApproved || (stakers[protocolName].hasPermit && !isTokenApproved)
      ? addLiquidityWithPermitTx
      : addLiquidityWithApproveTx;

  return { addLiquidity, tx: state };
};

export const getDeadline = () => {
  const DEADLINE_MINUTES = 10;
  const deadlineMS = new Date().getTime() + DEADLINE_MINUTES * 60000;
  return Math.floor(deadlineMS / 1000);
};
