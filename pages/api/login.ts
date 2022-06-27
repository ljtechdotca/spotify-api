import { NextApiRequest, NextApiResponse } from "next";
import ConfigBuilder from "../../lib/config-builder";
import generateRandomString from "../../lib/generate-random-string";

const loginHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const { scope } = new ConfigBuilder().read();

  const query = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID as string,
    scope: scope,
    redirect_uri: "http://localhost:3000/api/callback",
    state: generateRandomString(16),
  }).toString();

  res.redirect(200, "https://accounts.spotify.com/authorize?" + query);
};

export default loginHandler;
