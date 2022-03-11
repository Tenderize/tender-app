import useSWR from "swr";
import { Queries, calculateAPY } from "@tender/shared/src/index";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useAPYData = () => {
  const { data } = useSWR<Queries.TenderizerDaysType>("/api/apy", fetcher);
  return calculateAPY(data);
};
