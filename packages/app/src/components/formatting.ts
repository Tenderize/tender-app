import { BigNumber, BigNumberish } from "ethers";
import { formatEther } from "@ethersproject/units";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export const formatBalance = (balance: BigNumberish | undefined) =>
  formatter.format(parseFloat(formatEther(balance ?? BigNumber.from("0"))));

export const blockTimestampToDate = (timestamp: string) => new Date(Number(timestamp) * 1000);

export const daysBetweenBlockTimestamps = (timestamp1: string, timestamp2: string) => {
  return daysBetweenDates(blockTimestampToDate(timestamp1), blockTimestampToDate(timestamp2));
};
export const daysBetweenDates = (date1: Date, date2: Date): number => {
  const diff = date2.getTime() - date1.getTime();
  return Math.floor(diff / (1000 * 3600 * 24));
};
