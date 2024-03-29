/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface TenderSwapInterface extends utils.Interface {
  contractName: "TenderSwap";
  functions: {
    "addLiquidity(uint256[2],uint256,uint256)": FunctionFragment;
    "amplificationParams()": FunctionFragment;
    "(uint256)": FunctionFragment;
    "calculateRemoveLiquidityOneToken(uint256,address)": FunctionFragment;
    "calculateSwap(address,uint256)": FunctionFragment;
    "calculateTokenAmount(uint256[],bool)": FunctionFragment;
    "feeParams()": FunctionFragment;
    "getA()": FunctionFragment;
    "getAPrecise()": FunctionFragment;
    "getToken0()": FunctionFragment;
    "getToken0Balance()": FunctionFragment;
    "getToken1()": FunctionFragment;
    "getToken1Balance()": FunctionFragment;
    "getVirtualPrice()": FunctionFragment;
    "initialize(address,address,string,string,uint256,uint256,uint256,address)": FunctionFragment;
    "lpToken()": FunctionFragment;
    "multicall(bytes[])": FunctionFragment;
    "owner()": FunctionFragment;
    "rampA(uint256,uint256)": FunctionFragment;
    "removeLiquidity(uint256,uint256[2],uint256)": FunctionFragment;
    "removeLiquidityImbalance(uint256[2],uint256,uint256)": FunctionFragment;
    "removeLiquidityOneToken(uint256,address,uint256,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "setAdminFee(uint256)": FunctionFragment;
    "setSwapFee(uint256)": FunctionFragment;
    "stopRampA()": FunctionFragment;
    "swap(address,uint256,uint256,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [[BigNumberish, BigNumberish], BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "amplificationParams", values?: undefined): string;
  encodeFunctionData(functionFragment: "calculateRemoveLiquidity", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "calculateRemoveLiquidityOneToken", values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: "calculateSwap", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "calculateTokenAmount", values: [BigNumberish[], boolean]): string;
  encodeFunctionData(functionFragment: "feeParams", values?: undefined): string;
  encodeFunctionData(functionFragment: "getA", values?: undefined): string;
  encodeFunctionData(functionFragment: "getAPrecise", values?: undefined): string;
  encodeFunctionData(functionFragment: "getToken0", values?: undefined): string;
  encodeFunctionData(functionFragment: "getToken0Balance", values?: undefined): string;
  encodeFunctionData(functionFragment: "getToken1", values?: undefined): string;
  encodeFunctionData(functionFragment: "getToken1Balance", values?: undefined): string;
  encodeFunctionData(functionFragment: "getVirtualPrice", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string, BigNumberish, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "lpToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "multicall", values: [BytesLike[]]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "rampA", values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "removeLiquidity",
    values: [BigNumberish, [BigNumberish, BigNumberish], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidityImbalance",
    values: [[BigNumberish, BigNumberish], BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidityOneToken",
    values: [BigNumberish, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "selfPermit",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermitIfNecessary",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "setAdminFee", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "setSwapFee", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "stopRampA", values?: undefined): string;
  encodeFunctionData(functionFragment: "swap", values: [string, BigNumberish, BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: "transferOwnership", values: [string]): string;

  decodeFunctionResult(functionFragment: "addLiquidity", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "amplificationParams", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "calculateRemoveLiquidity", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "calculateRemoveLiquidityOneToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "calculateSwap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "calculateTokenAmount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeParams", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getAPrecise", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getToken0", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getToken0Balance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getToken1", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getToken1Balance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getVirtualPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lpToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rampA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "removeLiquidity", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "removeLiquidityImbalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "removeLiquidityOneToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "selfPermit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "selfPermitIfNecessary", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAdminFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setSwapFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stopRampA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;

  events: {
    "AddLiquidity(address,uint256[2],uint256[2],uint256,uint256)": EventFragment;
    "NewAdminFee(uint256)": EventFragment;
    "NewSwapFee(uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RampA(uint256,uint256,uint256,uint256)": EventFragment;
    "RemoveLiquidity(address,uint256[2],uint256)": EventFragment;
    "RemoveLiquidityImbalance(address,uint256[2],uint256[2],uint256,uint256)": EventFragment;
    "RemoveLiquidityOne(address,uint256,uint256,address,uint256)": EventFragment;
    "StopRampA(uint256,uint256)": EventFragment;
    "Swap(address,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddLiquidity"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewAdminFee"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewSwapFee"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RampA"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoveLiquidity"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoveLiquidityImbalance"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoveLiquidityOne"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StopRampA"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Swap"): EventFragment;
}

export type AddLiquidityEvent = TypedEvent<
  [string, [BigNumber, BigNumber], [BigNumber, BigNumber], BigNumber, BigNumber],
  {
    provider: string;
    tokenAmounts: [BigNumber, BigNumber];
    fees: [BigNumber, BigNumber];
    invariant: BigNumber;
    lpTokenSupply: BigNumber;
  }
>;

export type AddLiquidityEventFilter = TypedEventFilter<AddLiquidityEvent>;

export type NewAdminFeeEvent = TypedEvent<[BigNumber], { newAdminFee: BigNumber }>;

export type NewAdminFeeEventFilter = TypedEventFilter<NewAdminFeeEvent>;

export type NewSwapFeeEvent = TypedEvent<[BigNumber], { newSwapFee: BigNumber }>;

export type NewSwapFeeEventFilter = TypedEventFilter<NewSwapFeeEvent>;

export type OwnershipTransferredEvent = TypedEvent<[string, string], { previousOwner: string; newOwner: string }>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export type RampAEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber],
  {
    oldA: BigNumber;
    newA: BigNumber;
    initialTime: BigNumber;
    futureTime: BigNumber;
  }
>;

export type RampAEventFilter = TypedEventFilter<RampAEvent>;

export type RemoveLiquidityEvent = TypedEvent<
  [string, [BigNumber, BigNumber], BigNumber],
  {
    provider: string;
    tokenAmounts: [BigNumber, BigNumber];
    lpTokenSupply: BigNumber;
  }
>;

export type RemoveLiquidityEventFilter = TypedEventFilter<RemoveLiquidityEvent>;

export type RemoveLiquidityImbalanceEvent = TypedEvent<
  [string, [BigNumber, BigNumber], [BigNumber, BigNumber], BigNumber, BigNumber],
  {
    provider: string;
    tokenAmounts: [BigNumber, BigNumber];
    fees: [BigNumber, BigNumber];
    invariant: BigNumber;
    lpTokenSupply: BigNumber;
  }
>;

export type RemoveLiquidityImbalanceEventFilter = TypedEventFilter<RemoveLiquidityImbalanceEvent>;

export type RemoveLiquidityOneEvent = TypedEvent<
  [string, BigNumber, BigNumber, string, BigNumber],
  {
    provider: string;
    lpTokenAmount: BigNumber;
    lpTokenSupply: BigNumber;
    tokenReceived: string;
    receivedAmount: BigNumber;
  }
>;

export type RemoveLiquidityOneEventFilter = TypedEventFilter<RemoveLiquidityOneEvent>;

export type StopRampAEvent = TypedEvent<[BigNumber, BigNumber], { currentA: BigNumber; time: BigNumber }>;

export type StopRampAEventFilter = TypedEventFilter<StopRampAEvent>;

export type SwapEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  {
    buyer: string;
    tokenSold: string;
    amountSold: BigNumber;
    amountReceived: BigNumber;
  }
>;

export type SwapEventFilter = TypedEventFilter<SwapEvent>;

export interface TenderSwap extends BaseContract {
  contractName: "TenderSwap";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TenderSwapInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addLiquidity(
      _amounts: [BigNumberish, BigNumberish],
      _minToMint: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    amplificationParams(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        initialA: BigNumber;
        futureA: BigNumber;
        initialATime: BigNumber;
        futureATime: BigNumber;
      }
    >;

    calculateRemoveLiquidity(amount: BigNumberish, overrides?: CallOverrides): Promise<[[BigNumber, BigNumber]]>;

    calculateRemoveLiquidityOneToken(
      tokenAmount: BigNumberish,
      tokenReceive: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { availableTokenAmount: BigNumber }>;

    calculateSwap(_tokenFrom: string, _dx: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    calculateTokenAmount(amounts: BigNumberish[], deposit: boolean, overrides?: CallOverrides): Promise<[BigNumber]>;

    feeParams(overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & { swapFee: BigNumber; adminFee: BigNumber }>;

    getA(overrides?: CallOverrides): Promise<[BigNumber]>;

    getAPrecise(overrides?: CallOverrides): Promise<[BigNumber]>;

    getToken0(overrides?: CallOverrides): Promise<[string]>;

    getToken0Balance(overrides?: CallOverrides): Promise<[BigNumber]>;

    getToken1(overrides?: CallOverrides): Promise<[string]>;

    getToken1Balance(overrides?: CallOverrides): Promise<[BigNumber]>;

    getVirtualPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    initialize(
      _token0: string,
      _token1: string,
      lpTokenName: string,
      lpTokenSymbol: string,
      _a: BigNumberish,
      _fee: BigNumberish,
      _adminFee: BigNumberish,
      lpTokenTargetAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    lpToken(overrides?: CallOverrides): Promise<[string]>;

    multicall(
      _data: BytesLike[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    rampA(
      futureA: BigNumberish,
      futureTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeLiquidity(
      amount: BigNumberish,
      minAmounts: [BigNumberish, BigNumberish],
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeLiquidityImbalance(
      _amounts: [BigNumberish, BigNumberish],
      _maxBurnAmount: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeLiquidityOneToken(
      _tokenAmount: BigNumberish,
      _tokenReceive: string,
      _minAmount: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    selfPermit(
      _token: string,
      _value: BigNumberish,
      _deadline: BigNumberish,
      _v: BigNumberish,
      _r: BytesLike,
      _s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    selfPermitIfNecessary(
      _token: string,
      _value: BigNumberish,
      _deadline: BigNumberish,
      _v: BigNumberish,
      _r: BytesLike,
      _s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAdminFee(
      newAdminFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSwapFee(
      newSwapFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stopRampA(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    swap(
      _tokenFrom: string,
      _dx: BigNumberish,
      _minDy: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      _newOwnner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addLiquidity(
    _amounts: [BigNumberish, BigNumberish],
    _minToMint: BigNumberish,
    _deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  amplificationParams(overrides?: CallOverrides): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      initialA: BigNumber;
      futureA: BigNumber;
      initialATime: BigNumber;
      futureATime: BigNumber;
    }
  >;

  calculateRemoveLiquidity(amount: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

  calculateRemoveLiquidityOneToken(
    tokenAmount: BigNumberish,
    tokenReceive: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculateSwap(_tokenFrom: string, _dx: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  calculateTokenAmount(amounts: BigNumberish[], deposit: boolean, overrides?: CallOverrides): Promise<BigNumber>;

  feeParams(overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & { swapFee: BigNumber; adminFee: BigNumber }>;

  getA(overrides?: CallOverrides): Promise<BigNumber>;

  getAPrecise(overrides?: CallOverrides): Promise<BigNumber>;

  getToken0(overrides?: CallOverrides): Promise<string>;

  getToken0Balance(overrides?: CallOverrides): Promise<BigNumber>;

  getToken1(overrides?: CallOverrides): Promise<string>;

  getToken1Balance(overrides?: CallOverrides): Promise<BigNumber>;

  getVirtualPrice(overrides?: CallOverrides): Promise<BigNumber>;

  initialize(
    _token0: string,
    _token1: string,
    lpTokenName: string,
    lpTokenSymbol: string,
    _a: BigNumberish,
    _fee: BigNumberish,
    _adminFee: BigNumberish,
    lpTokenTargetAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  lpToken(overrides?: CallOverrides): Promise<string>;

  multicall(
    _data: BytesLike[],
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  rampA(
    futureA: BigNumberish,
    futureTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeLiquidity(
    amount: BigNumberish,
    minAmounts: [BigNumberish, BigNumberish],
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeLiquidityImbalance(
    _amounts: [BigNumberish, BigNumberish],
    _maxBurnAmount: BigNumberish,
    _deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeLiquidityOneToken(
    _tokenAmount: BigNumberish,
    _tokenReceive: string,
    _minAmount: BigNumberish,
    _deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  selfPermit(
    _token: string,
    _value: BigNumberish,
    _deadline: BigNumberish,
    _v: BigNumberish,
    _r: BytesLike,
    _s: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  selfPermitIfNecessary(
    _token: string,
    _value: BigNumberish,
    _deadline: BigNumberish,
    _v: BigNumberish,
    _r: BytesLike,
    _s: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAdminFee(
    newAdminFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSwapFee(
    newSwapFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stopRampA(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  swap(
    _tokenFrom: string,
    _dx: BigNumberish,
    _minDy: BigNumberish,
    _deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    _newOwnner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addLiquidity(
      _amounts: [BigNumberish, BigNumberish],
      _minToMint: BigNumberish,
      _deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    amplificationParams(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        initialA: BigNumber;
        futureA: BigNumber;
        initialATime: BigNumber;
        futureATime: BigNumber;
      }
    >;

    calculateRemoveLiquidity(amount: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

    calculateRemoveLiquidityOneToken(
      tokenAmount: BigNumberish,
      tokenReceive: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateSwap(_tokenFrom: string, _dx: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    calculateTokenAmount(amounts: BigNumberish[], deposit: boolean, overrides?: CallOverrides): Promise<BigNumber>;

    feeParams(overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & { swapFee: BigNumber; adminFee: BigNumber }>;

    getA(overrides?: CallOverrides): Promise<BigNumber>;

    getAPrecise(overrides?: CallOverrides): Promise<BigNumber>;

    getToken0(overrides?: CallOverrides): Promise<string>;

    getToken0Balance(overrides?: CallOverrides): Promise<BigNumber>;

    getToken1(overrides?: CallOverrides): Promise<string>;

    getToken1Balance(overrides?: CallOverrides): Promise<BigNumber>;

    getVirtualPrice(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _token0: string,
      _token1: string,
      lpTokenName: string,
      lpTokenSymbol: string,
      _a: BigNumberish,
      _fee: BigNumberish,
      _adminFee: BigNumberish,
      lpTokenTargetAddress: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    lpToken(overrides?: CallOverrides): Promise<string>;

    multicall(_data: BytesLike[], overrides?: CallOverrides): Promise<string[]>;

    owner(overrides?: CallOverrides): Promise<string>;

    rampA(futureA: BigNumberish, futureTime: BigNumberish, overrides?: CallOverrides): Promise<void>;

    removeLiquidity(
      amount: BigNumberish,
      minAmounts: [BigNumberish, BigNumberish],
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    removeLiquidityImbalance(
      _amounts: [BigNumberish, BigNumberish],
      _maxBurnAmount: BigNumberish,
      _deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeLiquidityOneToken(
      _tokenAmount: BigNumberish,
      _tokenReceive: string,
      _minAmount: BigNumberish,
      _deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    selfPermit(
      _token: string,
      _value: BigNumberish,
      _deadline: BigNumberish,
      _v: BigNumberish,
      _r: BytesLike,
      _s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    selfPermitIfNecessary(
      _token: string,
      _value: BigNumberish,
      _deadline: BigNumberish,
      _v: BigNumberish,
      _r: BytesLike,
      _s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setAdminFee(newAdminFee: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setSwapFee(newSwapFee: BigNumberish, overrides?: CallOverrides): Promise<void>;

    stopRampA(overrides?: CallOverrides): Promise<void>;

    swap(
      _tokenFrom: string,
      _dx: BigNumberish,
      _minDy: BigNumberish,
      _deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(_newOwnner: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "AddLiquidity(address,uint256[2],uint256[2],uint256,uint256)"(
      provider?: string | null,
      tokenAmounts?: null,
      fees?: null,
      invariant?: null,
      lpTokenSupply?: null
    ): AddLiquidityEventFilter;
    AddLiquidity(
      provider?: string | null,
      tokenAmounts?: null,
      fees?: null,
      invariant?: null,
      lpTokenSupply?: null
    ): AddLiquidityEventFilter;

    "NewAdminFee(uint256)"(newAdminFee?: null): NewAdminFeeEventFilter;
    NewAdminFee(newAdminFee?: null): NewAdminFeeEventFilter;

    "NewSwapFee(uint256)"(newSwapFee?: null): NewSwapFeeEventFilter;
    NewSwapFee(newSwapFee?: null): NewSwapFeeEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;

    "RampA(uint256,uint256,uint256,uint256)"(
      oldA?: null,
      newA?: null,
      initialTime?: null,
      futureTime?: null
    ): RampAEventFilter;
    RampA(oldA?: null, newA?: null, initialTime?: null, futureTime?: null): RampAEventFilter;

    "RemoveLiquidity(address,uint256[2],uint256)"(
      provider?: string | null,
      tokenAmounts?: null,
      lpTokenSupply?: null
    ): RemoveLiquidityEventFilter;
    RemoveLiquidity(provider?: string | null, tokenAmounts?: null, lpTokenSupply?: null): RemoveLiquidityEventFilter;

    "RemoveLiquidityImbalance(address,uint256[2],uint256[2],uint256,uint256)"(
      provider?: string | null,
      tokenAmounts?: null,
      fees?: null,
      invariant?: null,
      lpTokenSupply?: null
    ): RemoveLiquidityImbalanceEventFilter;
    RemoveLiquidityImbalance(
      provider?: string | null,
      tokenAmounts?: null,
      fees?: null,
      invariant?: null,
      lpTokenSupply?: null
    ): RemoveLiquidityImbalanceEventFilter;

    "RemoveLiquidityOne(address,uint256,uint256,address,uint256)"(
      provider?: string | null,
      lpTokenAmount?: null,
      lpTokenSupply?: null,
      tokenReceived?: null,
      receivedAmount?: null
    ): RemoveLiquidityOneEventFilter;
    RemoveLiquidityOne(
      provider?: string | null,
      lpTokenAmount?: null,
      lpTokenSupply?: null,
      tokenReceived?: null,
      receivedAmount?: null
    ): RemoveLiquidityOneEventFilter;

    "StopRampA(uint256,uint256)"(currentA?: null, time?: null): StopRampAEventFilter;
    StopRampA(currentA?: null, time?: null): StopRampAEventFilter;

    "Swap(address,address,uint256,uint256)"(
      buyer?: string | null,
      tokenSold?: null,
      amountSold?: null,
      amountReceived?: null
    ): SwapEventFilter;
    Swap(buyer?: string | null, tokenSold?: null, amountSold?: null, amountReceived?: null): SwapEventFilter;
  };

  estimateGas: {
    addLiquidity(
      _amounts: [BigNumberish, BigNumberish],
      _minToMint: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    amplificationParams(overrides?: CallOverrides): Promise<BigNumber>;

    calculateRemoveLiquidity(amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    calculateRemoveLiquidityOneToken(
      tokenAmount: BigNumberish,
      tokenReceive: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateSwap(_tokenFrom: string, _dx: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    calculateTokenAmount(amounts: BigNumberish[], deposit: boolean, overrides?: CallOverrides): Promise<BigNumber>;

    feeParams(overrides?: CallOverrides): Promise<BigNumber>;

    getA(overrides?: CallOverrides): Promise<BigNumber>;

    getAPrecise(overrides?: CallOverrides): Promise<BigNumber>;

    getToken0(overrides?: CallOverrides): Promise<BigNumber>;

    getToken0Balance(overrides?: CallOverrides): Promise<BigNumber>;

    getToken1(overrides?: CallOverrides): Promise<BigNumber>;

    getToken1Balance(overrides?: CallOverrides): Promise<BigNumber>;

    getVirtualPrice(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _token0: string,
      _token1: string,
      lpTokenName: string,
      lpTokenSymbol: string,
      _a: BigNumberish,
      _fee: BigNumberish,
      _adminFee: BigNumberish,
      lpTokenTargetAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    lpToken(overrides?: CallOverrides): Promise<BigNumber>;

    multicall(
      _data: BytesLike[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    rampA(
      futureA: BigNumberish,
      futureTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeLiquidity(
      amount: BigNumberish,
      minAmounts: [BigNumberish, BigNumberish],
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeLiquidityImbalance(
      _amounts: [BigNumberish, BigNumberish],
      _maxBurnAmount: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeLiquidityOneToken(
      _tokenAmount: BigNumberish,
      _tokenReceive: string,
      _minAmount: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    selfPermit(
      _token: string,
      _value: BigNumberish,
      _deadline: BigNumberish,
      _v: BigNumberish,
      _r: BytesLike,
      _s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    selfPermitIfNecessary(
      _token: string,
      _value: BigNumberish,
      _deadline: BigNumberish,
      _v: BigNumberish,
      _r: BytesLike,
      _s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAdminFee(
      newAdminFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSwapFee(
      newSwapFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stopRampA(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    swap(
      _tokenFrom: string,
      _dx: BigNumberish,
      _minDy: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      _newOwnner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addLiquidity(
      _amounts: [BigNumberish, BigNumberish],
      _minToMint: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    amplificationParams(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    calculateRemoveLiquidity(amount: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    calculateRemoveLiquidityOneToken(
      tokenAmount: BigNumberish,
      tokenReceive: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateSwap(_tokenFrom: string, _dx: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    calculateTokenAmount(
      amounts: BigNumberish[],
      deposit: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    feeParams(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getA(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAPrecise(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getToken0(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getToken0Balance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getToken1(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getToken1Balance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVirtualPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _token0: string,
      _token1: string,
      lpTokenName: string,
      lpTokenSymbol: string,
      _a: BigNumberish,
      _fee: BigNumberish,
      _adminFee: BigNumberish,
      lpTokenTargetAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    lpToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    multicall(
      _data: BytesLike[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rampA(
      futureA: BigNumberish,
      futureTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidity(
      amount: BigNumberish,
      minAmounts: [BigNumberish, BigNumberish],
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidityImbalance(
      _amounts: [BigNumberish, BigNumberish],
      _maxBurnAmount: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidityOneToken(
      _tokenAmount: BigNumberish,
      _tokenReceive: string,
      _minAmount: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    selfPermit(
      _token: string,
      _value: BigNumberish,
      _deadline: BigNumberish,
      _v: BigNumberish,
      _r: BytesLike,
      _s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    selfPermitIfNecessary(
      _token: string,
      _value: BigNumberish,
      _deadline: BigNumberish,
      _v: BigNumberish,
      _r: BytesLike,
      _s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAdminFee(
      newAdminFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSwapFee(
      newSwapFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stopRampA(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    swap(
      _tokenFrom: string,
      _dx: BigNumberish,
      _minDy: BigNumberish,
      _deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      _newOwnner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
