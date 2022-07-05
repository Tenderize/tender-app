import useSWR from "swr";
import { Staker, stakers } from "@tender/shared/src";
import { ProtocolName } from "@tender/shared/src/data/stakers";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useAPYData = () => {
  const { data } = useSWR<Record<ProtocolName, Staker>>("/api/apy", fetcher);
  return data ?? stakers;
};

export const useTVLData = () => {
  const { data } = useSWR<Record<ProtocolName, Pick<Staker, "name" | "tvl">>>("/api/tvl", fetcher);
  return data ?? stakers;
};
