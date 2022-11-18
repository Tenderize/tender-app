import { BigNumber, BigNumberish } from "ethers";
import { formatEther } from "@ethersproject/units";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export const formatBalance = (balance: BigNumberish | undefined) =>
  formatter.format(parseFloat(formatEther(balance ?? BigNumber.from("0"))));

export const blockTimestampToDate = (timestamp: string) => new Date(Number(timestamp) * 1000);
