import { NextApiRequest, NextApiResponse } from "next";

import ConfigBuilder from "../../lib/config-builder";

const meHander = async (req: NextApiRequest, res: NextApiResponse) => {
  const configBuilder = new ConfigBuilder();

  const { access_token } = configBuilder.read();

  const meUrl = "https://api.spotify.com/v1/me/player/currently-playing";

  const meOptions = {
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
  };

  const meRes = await fetch(meUrl, meOptions);

  const meData = await meRes.json();

  const { item } = meData;

  const { artists, name, id, uri } = item;

  res.status(200).json({ artists, song: { name, id, uri } });
};

export default meHander;
