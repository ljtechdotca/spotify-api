import { NextApiRequest, NextApiResponse } from "next";
import { URLSearchParams } from "url";
import ConfigBuilder from "../../lib/config-builder";

const spotify_id = process.env.SPOTIFY_CLIENT_ID as string;
const spotify_secret = process.env.SPOTIFY_CLIENT_SECRET as string;

const callbackHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  try {
    const { code, state } = query;

    if (!state) throw new Error();

    const configBuilder = new ConfigBuilder();

    const authQuery = new URLSearchParams({
      code: code,
      redirect_uri: "http://localhost:3000/api/callback",
      grant_type: "authorization_code",
    }).toString();

    const authUrl = "https://accounts.spotify.com/api/token?" + authQuery;

    const authOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer(spotify_id + ":" + spotify_secret).toString("base64"),
      },
    };

    const authRes = await fetch(authUrl, authOptions);

    const authData = await authRes.json();

    const { access_token, refresh_token } = authData;

    configBuilder.write(access_token, refresh_token);

    const successQuery = new URLSearchParams({
      success: "user-read-currently-playing",
    }).toString();

    res.redirect(200, "/#" + successQuery);
  } catch (error) {
    console.log(error);

    const errorQuery = new URLSearchParams({
      error: "invalid_token",
    }).toString();

    res.redirect(400, "/#" + errorQuery);
  }
};

export default callbackHandler;
