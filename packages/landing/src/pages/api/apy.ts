import { NextApiResponse } from "next";
import { Subgraph, Queries } from "@tender/shared/src/index";
import { NextApiRequestWithCache, lruCache, CACHE_MAX_AGE_IN_SEC } from "../../utils/middlewares/cache";

const handler = async (req: NextApiRequestWithCache, res: NextApiResponse) => {
  res.setHeader("Cache-Control", `public, s-maxage=${60 * 60}, stale-while-revalidate=${60 * 60 * 2}`);
  const cacheKey = encodeURIComponent(req.url ?? "apy");

  if (req.cache != null && req.cache.has(cacheKey)) {
    const { data } = req.cache.get(cacheKey) as any;
    res.setHeader("Cache-Control", `public,max-age=${CACHE_MAX_AGE_IN_SEC}`);
    res.setHeader("X-Cache", "HIT");

    return res.status(200).json(data);
  }

  const monthAgo = getUnixTimestampMonthAgo();
  const { data } = await Subgraph.query({
    query: Queries.GetTenderizerDays,
    variables: { from: monthAgo },
  });

  if (data != null) {
    req.cache.set(cacheKey, {
      data,
    });
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Cache", "MISS");
  }

  res.status(200).json(data);
};

const getUnixTimestampMonthAgo = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime() / 1000;
};

export default lruCache(handler);
