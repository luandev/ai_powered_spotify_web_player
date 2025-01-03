import { AuthorizationCodeWithPKCEStrategy, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { api, HydrateClient } from "~/trpc/server";
import SpotifyConnect from "../_components/spotify_connect";


export default function Radio() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <SpotifyConnect />
        </div>
      </main>
    </HydrateClient>
  );
}