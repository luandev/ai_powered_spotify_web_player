import { AccessToken, AuthorizationCodeWithPKCEStrategy, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { api, HydrateClient } from "~/trpc/server";
import { env } from "~/env";


export default function App() {

  const tokenHandler = async (token: AccessToken) => {
    const hello = await api.post.hello({ token });
  }


  return (
    <HydrateClient>
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
      Welcome  <span className="text-[hsl(280,100%,70%)]">radio</span> App
      </h1>
      <button onClick={() => {
         SpotifyApi.performUserAuthorization(
          env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
          "https://localhost:3000/radio/app", 
          [
            'user-read-private',
            'user-read-email',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-read-playback-state',
            'user-modify-playback-state'
          ], tokenHandler);

      }}>Connect</button>
    </div>
  </main>
    </HydrateClient>
  );
}
