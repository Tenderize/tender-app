import { NextApiResponse } from "next";
import { ChainId } from "@usedapp/core";
import { SubgraphForLanding, Queries, getUnixTimestampQuarter, calculateAPY } from "@tender/shared/src/index";
import { NextApiRequestWithCache, lruCache, CACHE_MAX_AGE_IN_SEC } from "../../utils/middlewares/cache";

const handler = async (req: NextApiRequestWithCache, res: NextApiResponse) => {
  res.setHeader("Cache-Control", `public, s-maxage=${60 * 60}, stale-while-revalidate=${60 * 60 * 2}`);
  const cacheKey = encodeURIComponent(req.url ?? "apy");

  if (req.cache != null && req.cache.has(cacheKey)) {
    const { data } = req.cache.get(cacheKey) as any;
    res.setHeader("Cache-Control", `public,max-age=${CACHE_MAX_AGE_IN_SEC}`);
    res.setHeader("X-Cache", "HIT");

    res.status(200).json(calculateAPY(data));
  } else {
    const monthAgo = getUnixTimestampQuarter();
    try {
      const { data: ethereumData } = await SubgraphForLanding.query<Queries.TenderizerDaysType>({
        query: Queries.GetTenderizerDays,
        variables: { from: monthAgo },
        context: { chainId: ChainId.Mainnet },
      });
      const { data: arbitrumData } = await SubgraphForLanding.query<Queries.TenderizerDaysType>({
        query: Queries.GetTenderizerDays,
        variables: { from: monthAgo },
        context: { chainId: ChainId.Arbitrum },
      });

      const data = { tenderizers: [...ethereumData.tenderizers, ...arbitrumData.tenderizers] };
      if (data != null) {
        req.cache.set(cacheKey, {
          data,
        });
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("X-Cache", "MISS");
      }
      res.status(200).json(calculateAPY(data));
    } catch (e) {
      console.log(e);
      res.status(200).json(undefined);
    }
  }
};

export default lruCache(handler);
