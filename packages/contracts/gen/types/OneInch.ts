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

export interface OneInchInterface extends utils.Interface {
  contractName: "OneInch";
  functions: {
    "FLAG_DISABLE_AAVE()": FunctionFragment;
    "FLAG_DISABLE_BANCOR()": FunctionFragment;
    "FLAG_DISABLE_BDAI()": FunctionFragment;
    "FLAG_DISABLE_CHAI()": FunctionFragment;
    "FLAG_DISABLE_COMPOUND()": FunctionFragment;
    "FLAG_DISABLE_CURVE_BINANCE()": FunctionFragment;
    "FLAG_DISABLE_CURVE_COMPOUND()": FunctionFragment;
    "FLAG_DISABLE_CURVE_SYNTHETIX()": FunctionFragment;
    "FLAG_DISABLE_CURVE_USDT()": FunctionFragment;
    "FLAG_DISABLE_CURVE_Y()": FunctionFragment;
    "FLAG_DISABLE_FULCRUM()": FunctionFragment;
    "FLAG_DISABLE_IEARN()": FunctionFragment;
    "FLAG_DISABLE_KYBER()": FunctionFragment;
    "FLAG_DISABLE_OASIS()": FunctionFragment;
    "FLAG_DISABLE_SMART_TOKEN()": FunctionFragment;
    "FLAG_DISABLE_UNISWAP()": FunctionFragment;
    "FLAG_DISABLE_WETH()": FunctionFragment;
    "FLAG_ENABLE_KYBER_BANCOR_RESERVE()": FunctionFragment;
    "FLAG_ENABLE_KYBER_OASIS_RESERVE()": FunctionFragment;
    "FLAG_ENABLE_KYBER_UNISWAP_RESERVE()": FunctionFragment;
    "FLAG_ENABLE_MULTI_PATH_DAI()": FunctionFragment;
    "FLAG_ENABLE_MULTI_PATH_ETH()": FunctionFragment;
    "FLAG_ENABLE_MULTI_PATH_USDC()": FunctionFragment;
    "FLAG_ENABLE_UNISWAP_COMPOUND()": FunctionFragment;
    "claimAsset(address,uint256)": FunctionFragment;
    "getExpectedReturn(address,address,uint256,uint256,uint256)": FunctionFragment;
    "isOwner()": FunctionFragment;
    "oneSplitImpl()": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setNewImpl(address)": FunctionFragment;
    "swap(address,address,uint256,uint256,uint256[],uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_AAVE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_BANCOR",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_BDAI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_CHAI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_COMPOUND",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_CURVE_BINANCE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_CURVE_COMPOUND",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_CURVE_SYNTHETIX",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_CURVE_USDT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_CURVE_Y",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_FULCRUM",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_IEARN",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_KYBER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_OASIS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_SMART_TOKEN",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_UNISWAP",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_DISABLE_WETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_ENABLE_KYBER_BANCOR_RESERVE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_ENABLE_KYBER_OASIS_RESERVE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_ENABLE_KYBER_UNISWAP_RESERVE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_ENABLE_MULTI_PATH_DAI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_ENABLE_MULTI_PATH_ETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_ENABLE_MULTI_PATH_USDC",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FLAG_ENABLE_UNISWAP_COMPOUND",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimAsset",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getExpectedReturn",
    values: [string, string, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "isOwner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "oneSplitImpl",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setNewImpl", values: [string]): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [
      string,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish[],
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_AAVE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_BANCOR",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_BDAI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_CHAI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_COMPOUND",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_CURVE_BINANCE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_CURVE_COMPOUND",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_CURVE_SYNTHETIX",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_CURVE_USDT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_CURVE_Y",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_FULCRUM",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_IEARN",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_KYBER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_OASIS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_SMART_TOKEN",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_UNISWAP",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_DISABLE_WETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_ENABLE_KYBER_BANCOR_RESERVE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_ENABLE_KYBER_OASIS_RESERVE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_ENABLE_KYBER_UNISWAP_RESERVE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_ENABLE_MULTI_PATH_DAI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_ENABLE_MULTI_PATH_ETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_ENABLE_MULTI_PATH_USDC",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FLAG_ENABLE_UNISWAP_COMPOUND",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimAsset", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getExpectedReturn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "oneSplitImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setNewImpl", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "ImplementationUpdated(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ImplementationUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type ImplementationUpdatedEvent = TypedEvent<
  [string],
  { newImpl: string }
>;

export type ImplementationUpdatedEventFilter =
  TypedEventFilter<ImplementationUpdatedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface OneInch extends BaseContract {
  contractName: "OneInch";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OneInchInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    FLAG_DISABLE_AAVE(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_BANCOR(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_BDAI(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_CHAI(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_COMPOUND(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_CURVE_BINANCE(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_CURVE_COMPOUND(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    FLAG_DISABLE_CURVE_SYNTHETIX(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    FLAG_DISABLE_CURVE_USDT(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_CURVE_Y(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_FULCRUM(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_IEARN(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_KYBER(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_OASIS(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_SMART_TOKEN(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_UNISWAP(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_DISABLE_WETH(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_ENABLE_KYBER_BANCOR_RESERVE(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    FLAG_ENABLE_KYBER_OASIS_RESERVE(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    FLAG_ENABLE_KYBER_UNISWAP_RESERVE(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    FLAG_ENABLE_MULTI_PATH_DAI(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_ENABLE_MULTI_PATH_ETH(overrides?: CallOverrides): Promise<[BigNumber]>;

    FLAG_ENABLE_MULTI_PATH_USDC(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    FLAG_ENABLE_UNISWAP_COMPOUND(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    claimAsset(
      asset: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getExpectedReturn(
      fromToken: string,
      toToken: string,
      amount: BigNumberish,
      parts: BigNumberish,
      featureFlags: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber[]] & {
        returnAmount: BigNumber;
        distribution: BigNumber[];
      }
    >;

    isOwner(overrides?: CallOverrides): Promise<[boolean]>;

    oneSplitImpl(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setNewImpl(
      impl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swap(
      fromToken: string,
      toToken: string,
      amount: BigNumberish,
      minReturn: BigNumberish,
      distribution: BigNumberish[],
      featureFlags: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  FLAG_DISABLE_AAVE(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_BANCOR(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_BDAI(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_CHAI(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_CURVE_BINANCE(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_CURVE_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_CURVE_SYNTHETIX(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_CURVE_USDT(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_CURVE_Y(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_FULCRUM(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_IEARN(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_KYBER(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_OASIS(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_SMART_TOKEN(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_UNISWAP(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_DISABLE_WETH(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_ENABLE_KYBER_BANCOR_RESERVE(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  FLAG_ENABLE_KYBER_OASIS_RESERVE(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  FLAG_ENABLE_KYBER_UNISWAP_RESERVE(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  FLAG_ENABLE_MULTI_PATH_DAI(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_ENABLE_MULTI_PATH_ETH(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_ENABLE_MULTI_PATH_USDC(overrides?: CallOverrides): Promise<BigNumber>;

  FLAG_ENABLE_UNISWAP_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

  claimAsset(
    asset: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getExpectedReturn(
    fromToken: string,
    toToken: string,
    amount: BigNumberish,
    parts: BigNumberish,
    featureFlags: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber[]] & {
      returnAmount: BigNumber;
      distribution: BigNumber[];
    }
  >;

  isOwner(overrides?: CallOverrides): Promise<boolean>;

  oneSplitImpl(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setNewImpl(
    impl: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swap(
    fromToken: string,
    toToken: string,
    amount: BigNumberish,
    minReturn: BigNumberish,
    distribution: BigNumberish[],
    featureFlags: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    FLAG_DISABLE_AAVE(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_BANCOR(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_BDAI(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CHAI(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_BINANCE(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_SYNTHETIX(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_USDT(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_Y(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_FULCRUM(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_IEARN(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_KYBER(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_OASIS(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_SMART_TOKEN(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_UNISWAP(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_WETH(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_ENABLE_KYBER_BANCOR_RESERVE(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    FLAG_ENABLE_KYBER_OASIS_RESERVE(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    FLAG_ENABLE_KYBER_UNISWAP_RESERVE(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    FLAG_ENABLE_MULTI_PATH_DAI(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_ENABLE_MULTI_PATH_ETH(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_ENABLE_MULTI_PATH_USDC(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_ENABLE_UNISWAP_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

    claimAsset(
      asset: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getExpectedReturn(
      fromToken: string,
      toToken: string,
      amount: BigNumberish,
      parts: BigNumberish,
      featureFlags: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber[]] & {
        returnAmount: BigNumber;
        distribution: BigNumber[];
      }
    >;

    isOwner(overrides?: CallOverrides): Promise<boolean>;

    oneSplitImpl(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setNewImpl(impl: string, overrides?: CallOverrides): Promise<void>;

    swap(
      fromToken: string,
      toToken: string,
      amount: BigNumberish,
      minReturn: BigNumberish,
      distribution: BigNumberish[],
      featureFlags: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ImplementationUpdated(address)"(
      newImpl?: string | null
    ): ImplementationUpdatedEventFilter;
    ImplementationUpdated(
      newImpl?: string | null
    ): ImplementationUpdatedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    FLAG_DISABLE_AAVE(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_BANCOR(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_BDAI(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CHAI(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_BINANCE(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_SYNTHETIX(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_USDT(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_CURVE_Y(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_FULCRUM(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_IEARN(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_KYBER(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_OASIS(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_SMART_TOKEN(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_UNISWAP(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_DISABLE_WETH(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_ENABLE_KYBER_BANCOR_RESERVE(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    FLAG_ENABLE_KYBER_OASIS_RESERVE(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    FLAG_ENABLE_KYBER_UNISWAP_RESERVE(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    FLAG_ENABLE_MULTI_PATH_DAI(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_ENABLE_MULTI_PATH_ETH(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_ENABLE_MULTI_PATH_USDC(overrides?: CallOverrides): Promise<BigNumber>;

    FLAG_ENABLE_UNISWAP_COMPOUND(overrides?: CallOverrides): Promise<BigNumber>;

    claimAsset(
      asset: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getExpectedReturn(
      fromToken: string,
      toToken: string,
      amount: BigNumberish,
      parts: BigNumberish,
      featureFlags: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isOwner(overrides?: CallOverrides): Promise<BigNumber>;

    oneSplitImpl(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setNewImpl(
      impl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swap(
      fromToken: string,
      toToken: string,
      amount: BigNumberish,
      minReturn: BigNumberish,
      distribution: BigNumberish[],
      featureFlags: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    FLAG_DISABLE_AAVE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    FLAG_DISABLE_BANCOR(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_BDAI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    FLAG_DISABLE_CHAI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    FLAG_DISABLE_COMPOUND(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_CURVE_BINANCE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_CURVE_COMPOUND(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_CURVE_SYNTHETIX(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_CURVE_USDT(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_CURVE_Y(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_FULCRUM(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_IEARN(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_KYBER(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_OASIS(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_SMART_TOKEN(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_UNISWAP(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_DISABLE_WETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    FLAG_ENABLE_KYBER_BANCOR_RESERVE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_ENABLE_KYBER_OASIS_RESERVE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_ENABLE_KYBER_UNISWAP_RESERVE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_ENABLE_MULTI_PATH_DAI(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_ENABLE_MULTI_PATH_ETH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_ENABLE_MULTI_PATH_USDC(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FLAG_ENABLE_UNISWAP_COMPOUND(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimAsset(
      asset: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getExpectedReturn(
      fromToken: string,
      toToken: string,
      amount: BigNumberish,
      parts: BigNumberish,
      featureFlags: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oneSplitImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setNewImpl(
      impl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swap(
      fromToken: string,
      toToken: string,
      amount: BigNumberish,
      minReturn: BigNumberish,
      distribution: BigNumberish[],
      featureFlags: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
