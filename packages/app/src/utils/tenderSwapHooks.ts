import { useContractCall, useContractFunction, useEthers } from "@usedapp/core";
import { abis, contracts, addresses } from "@tender/contracts";
import { BigNumber, constants, utils } from "ethers";
import { signERC2612Permit } from "eth-permit";
import { stakers } from "@tender/shared/src/index";

const TenderSwapABI = new utils.Interface(abis.tenderSwap);

export const useCalculateLpTokenAmount = (pool: string, amounts: BigNumber[], deposit: boolean) => {
  const [tokens]: BigNumber[] = useContractCall(
    pool &&
      amounts.length === 2 &&
      amounts[0] &&
      amounts[1] && {
        abi: TenderSwapABI,
        address: pool,
        method: "calculateTokenAmount",
        args: [amounts, deposit],
      }
  ) ?? [constants.Zero];
  return tokens.mul(999).div(1000);
};

export const useCalculateRemoveLiquidity = (pool: string, amount: BigNumber): [BigNumber, BigNumber] => {
  const [values] = useContractCall(
    pool &&
      amount &&
      !amount.isZero() && {
        abi: TenderSwapABI,
        address: pool,
        method: "calculateRemoveLiquidity",
        args: [amount],
      }
  ) ?? [[constants.Zero, constants.Zero]];

  return values;
};

export const useCalculateRemoveLiquidityOneToken = (
  pool: string,
  amount: BigNumber,
  tokenReceive: string
): BigNumber => {
  const [tokens] = useContractCall(
    pool &&
      amount &&
      !amount.isZero() &&
      tokenReceive && {
        abi: TenderSwapABI,
        address: pool,
        method: "calculateRemoveLiquidityOneToken",
        args: [amount, tokenReceive],
      }
  ) ?? [constants.Zero];

  return tokens;
};

export const useCalculateSwap = (pool: string, tokenFrom: string, amount: BigNumber) => {
  const [tokens]: BigNumber[] = useContractCall(
    pool &&
      tokenFrom &&
      amount &&
      !amount.isZero() && {
        abi: TenderSwapABI,
        address: pool,
        method: "calculateSwap",
        args: [tokenFrom, amount],
      }
  ) ?? [constants.Zero];
  return tokens;
};

export const useSwapWithPermit = (
  token: string,
  protocolName: string,
  tokenSendedSymbol: string,
  tokenReceivedSymbol: string,
  owner: string | null | undefined,
  spender: string,
  amount: BigNumber
) => {
  const { state, send: multicall } = useContractFunction(contracts[protocolName].tenderSwap, "multicall", {
    transactionName: `Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`,
  });
  const { library } = useEthers();

  const swapWithPermit = async (
    tokenAddress: string,
    tokenAmount: BigNumber,
    minAmount: BigNumber,
    deadline: number
  ) => {
    const permit = await signERC2612Permit(
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
  protocolName: string,
  owner: string | null | undefined,
  spender: string,
  symbol: string,
  isLpSharesApproved: boolean
) => {
  const { state: removeLiquidityWithPermitTx, send: multicall } = useContractFunction(
    contracts[protocolName].tenderSwap,
    "multicall",
    {
      transactionName: `exit t${symbol}/${symbol} Liquidity Pool`,
    }
  );

  const { state: removeLiquidityWithApproveTx, send: removeLiquidity } = useContractFunction(
    contracts[protocolName].tenderSwap,
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
      const permit = await signERC2612Permit(
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
  protocolName: string,
  owner: string | null | undefined,
  spender: string,
  symbol: string,
  isLpSharesApproved: boolean
) => {
  const { state: removeLiquidityWithPermitTx, send: multicall } = useContractFunction(
    contracts[protocolName].tenderSwap,
    "multicall",
    {
      transactionName: `exit t${symbol}/${symbol} Liquidity Pool`,
    }
  );

  const { state: removeLiquidityWithApproveTx, send: removeLiquidityFunction } = useContractFunction(
    contracts[protocolName].tenderSwap,
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
      const permit = await signERC2612Permit(
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

export const useAddLiquidity = (protocolName: string, isTokenApproved: boolean, isTenderApproved: boolean) => {
  const symbol = stakers[protocolName].symbol;

  const { state: addLiquidityWithPermitTx, send: multicall } = useContractFunction(
    contracts[protocolName].tenderSwap,
    "multicall",
    {
      transactionName: `Add t${symbol}/${symbol} Liquidity`,
    }
  );
  const { state: addLiquidityWithApproveTx, send: addLiquidityWithApprove } = useContractFunction(
    contracts[protocolName].tenderSwap,
    "addLiquidity",
    { transactionName: `Add t${symbol}/${symbol} Liquidity` }
  );

  const { library, account } = useEthers();
  const multicallData: string[] = [];

  const addLiquidity = async (tenderIn: BigNumber, tokenIn: BigNumber, lpTokenAmount: BigNumber) => {
    if (!isTenderApproved) {
      const tenderToken = addresses[protocolName].tenderToken;
      const permit = await signERC2612Permit(
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

    if (!tokenIn.isZero() && stakers[protocolName].hasPermit && !isTokenApproved) {
      const token = addresses[protocolName].token;
      const permit = await signERC2612Permit(
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
