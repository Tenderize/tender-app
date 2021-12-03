import { NextApiResponse, NextApiRequest } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@tenderize");
  const jsonObj = await data.json();
  res.status(200).json(jsonObj);
};

export default handler;
