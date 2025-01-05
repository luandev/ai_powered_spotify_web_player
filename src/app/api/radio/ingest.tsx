import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";

let sdk: SpotifyApi | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body;

    if (!data || !data.accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    // Initialize the Spotify SDK with the user's access token
    sdk = SpotifyApi.withAccessToken(env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, data);

    return res.status(200).json({ message: "Spotify SDK initialized" });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export { sdk }; // Export sdk for use in other parts of your application
