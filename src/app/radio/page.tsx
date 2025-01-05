import { AuthorizationCodeWithPKCEStrategy, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { HydrateClient } from "~/trpc/server";
import { env } from "~/env";


export default function Radio() {
  return (
    <HydrateClient>
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
      Login with Spotify, to listen to the  <span className="text-[hsl(280,100%,70%)]">radio</span> App
      </h1>
      <button onClick={() => {
         SpotifyApi.withImplicitGrant(
          env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
          "https://localhost:3000/radio/app", 
          [
            'user-read-private',
            'user-read-email',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-read-playback-state',
            'user-modify-playback-state'
          ]);

      }}>Connect</button>
    </div>
  </main>
    </HydrateClient>
  );
}
