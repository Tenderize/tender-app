/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Registry, RegistryInterface } from "../Registry";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "steak",
            type: "address",
          },
          {
            internalType: "address",
            name: "tenderizer",
            type: "address",
          },
          {
            internalType: "address",
            name: "tenderToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "tenderSwap",
            type: "address",
          },
          {
            internalType: "address",
            name: "tenderFarm",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct Registry.TenderizerConfig",
        name: "config",
        type: "tuple",
      },
    ],
    name: "TenderizerCreated",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "steak",
            type: "address",
          },
          {
            internalType: "address",
            name: "tenderizer",
            type: "address",
          },
          {
            internalType: "address",
            name: "tenderToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "tenderSwap",
            type: "address",
          },
          {
            internalType: "address",
            name: "tenderFarm",
            type: "address",
          },
        ],
        internalType: "struct Registry.TenderizerConfig",
        name: "config",
        type: "tuple",
      },
    ],
    name: "addTenderizer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class Registry__factory {
  static readonly abi = _abi;
  static createInterface(): RegistryInterface {
    return new utils.Interface(_abi) as RegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Registry {
    return new Contract(address, _abi, signerOrProvider) as Registry;
  }
}
