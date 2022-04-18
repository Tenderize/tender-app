import useSWR from "swr";
import { Queries, calculateAPY } from "@tender/shared/src/index";
import { APYData } from "@tender/shared/src/calculateAPY";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useAPYData = (): APYData => {
  const { data } = useSWR<Queries.TenderizerDaysType>("/api/apy", fetcher);
  return calculateAPY(data);
};
