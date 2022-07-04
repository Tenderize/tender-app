import { NextApiResponse } from "next";
import { ChainId } from "@usedapp/core";
import {
  Subgraph,
  SubgraphForLanding,
  Queries,
  getUnixTimestampMonthAgo,
  calculateAPY,
} from "@tender/shared/src/index";
import { NextApiRequestWithCache, lruCache, CACHE_MAX_AGE_IN_SEC } from "../../utils/middlewares/cache";
import { isProduction } from "@tender/shared/src/data/stakers";
import { TenderizerDays } from "@tender/shared/src/queries";

const handler = async (req: NextApiRequestWithCache, res: NextApiResponse) => {
  res.setHeader("Cache-Control", `public, s-maxage=${60 * 60}, stale-while-revalidate=${60 * 60 * 2}`);
  const cacheKey = encodeURIComponent(req.url ?? "apy");

  if (req.cache != null && req.cache.has(cacheKey)) {
    const { data } = req.cache.get(cacheKey) as any;
    res.setHeader("Cache-Control", `public,max-age=${CACHE_MAX_AGE_IN_SEC}`);
    res.setHeader("X-Cache", "HIT");

    res.status(200).json(calculateAPY(data));
  } else {
    const monthAgo = getUnixTimestampMonthAgo();
    try {
      const { data: ethereumData } = await Subgraph.query<TenderizerDays>({
        query: Queries.GetTenderizerDays,
        variables: { from: monthAgo },
        context: { chainId: isProduction() ? ChainId.Mainnet : ChainId.Rinkeby },
      });
      const { data: arbitrumData } = await SubgraphForLanding.query<TenderizerDays>({
        query: Queries.GetTenderizerDays,
        variables: { from: monthAgo },
        context: { chainId: isProduction() ? ChainId.Arbitrum : ChainId.ArbitrumRinkeby },
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
