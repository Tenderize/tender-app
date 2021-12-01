import { NextApiRequest, NextApiResponse } from "next";
import LRU from "lru-cache";

export type NextApiRequestWithCache = NextApiRequest & { cache: LRU<string, unknown> };

export const CACHE_MAX_AGE_IN_SEC = 60 * 60;
const context = {
  cache: new LRU<string, unknown>({
    max: 1,
    maxAge: CACHE_MAX_AGE_IN_SEC * 1000,
  }),
};

export const lruCache =
  (handler: (req: NextApiRequestWithCache, res: NextApiResponse) => void) =>
  (req: NextApiRequestWithCache, res: NextApiResponse) => {
    req.cache = context.cache;

    return handler(req, res);
  };
