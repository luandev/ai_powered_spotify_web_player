import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { env } from "~/env";
import { NextResponse } from 'next/server';


export async function GET() {
  // Handle GET request
  return NextResponse.json({ message: 'This is a GET response' });
}

export async function POST(request: Request) {
  const data = await request.json();
  const data2 = request.body;

    if (!data || !data.accessToken) {
      return new NextResponse(JSON.stringify({ error: "Access token is required" }), { status: 400 });
    }

    // Initialize the Spotify SDK with the user's access token
    const sdk = SpotifyApi.withAccessToken(env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, data);

    return res.status(200).json({ message: "Spotify SDK initialized" });
}
