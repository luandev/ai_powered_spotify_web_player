import { HydrateClient } from "~/trpc/server";
import React from "react";
import SpotifyApp from "../_components/spotifyApp";


export default function Radio() {
  return (
    <HydrateClient>
      <div>
        <SpotifyApp />
      </div>
    </HydrateClient>
  );
}
