import { NextApiRequest, NextApiResponse } from "next";
import { apolloClient } from "../../config";
import { GetTenderizerDays } from "../../queries";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Cache-Control", `public, s-maxage=${60 * 60}, stale-while-revalidate=${60 * 60 * 2}`);

  const monthAgo = getUnixTimestampMonthAgo();
  const { data } = await apolloClient.query({
    query: GetTenderizerDays,
    variables: { from: monthAgo },
  });
  res.status(200).json(data);
};

const getUnixTimestampMonthAgo = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime() / 1000;
};

export default handler;
