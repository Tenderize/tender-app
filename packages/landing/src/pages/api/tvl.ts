import { NextApiResponse } from "next";
import { ChainId } from "@usedapp/core";
import { Subgraph, SubgraphForLanding, Queries } from "@tender/shared/src/index";
import { NextApiRequestWithCache, lruCache, CACHE_MAX_AGE_IN_SEC } from "../../utils/middlewares/cache";
import { ProtocolName, Staker, stakers } from "@tender/shared/src/data/stakers";
import { TVLData } from "@tender/shared/src/queries";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { BigNumber, utils } from "ethers";

const stakersArray = Object.values(stakers);

const coinGeckoApiIds: Record<ProtocolName, string> = {
  audius: "audius",
  livepeer: "livepeer",
  matic: "matic-network",
  graph: "the-graph",
};

type CoinGeckoPriceResponse = Record<string, { usd: number }>;

const handler = async (req: NextApiRequestWithCache, res: NextApiResponse) => {
  res.setHeader("Cache-Control", `public, s-maxage=${60 * 60}, stale-while-revalidate=${60 * 60 * 2}`);
  const cacheKey = encodeURIComponent(req.url ?? "tvl");

  if (req.cache != null && req.cache.has(cacheKey)) {
    const { data } = req.cache.get(cacheKey) as any;
    res.setHeader("Cache-Control", `public,max-age=${CACHE_MAX_AGE_IN_SEC}`);
    res.setHeader("X-Cache", "HIT");

    res.status(200).json(data);
  } else {
    try {
      const ethereumData = await getTvl(Subgraph, ChainId.Mainnet);
      const arbitrumData = await getTvl(SubgraphForLanding, ChainId.Arbitrum);
      const data = { ...ethereumData, ...arbitrumData };

      if (data != null) {
        req.cache.set(cacheKey, {
          data,
        });
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("X-Cache", "MISS");
      }
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
      res.status(200).json(undefined);
    }
  }
};

const getTvl = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  productionChain: ChainId
): Promise<Record<ProtocolName, Pick<Staker, "name" | "tvl">>> => {
  const result = await apolloClient.query<TVLData>({
    query: Queries.GetTVL,
    context: { chainId: productionChain },
  });
  const pricesResponse = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(coinGeckoApiIds).join("%2C")}&vs_currencies=usd`
  );
  const prices: CoinGeckoPriceResponse = await pricesResponse.json();

  const data = result.data.tenderizers.map((tenderizer) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const protocolName = stakersArray.find((item) => item.subgraphId === tenderizer.id)!.name;
    const token1Balance =
      result.data.tenderSwaps.find((tenderSwap) => tenderSwap.id === tenderizer.id)?.balances[1] ?? "0";

    const coingeckoId = coinGeckoApiIds[protocolName];
    return [
      protocolName,
      {
        name: protocolName,
        tvl:
          Number.parseFloat(utils.formatEther(BigNumber.from(token1Balance).add(tenderizer.currentPrincipal))) *
          (prices?.[coingeckoId]?.usd ?? 0),
      },
    ];
  });

  return Object.fromEntries(data);
};

export default lruCache(handler);
