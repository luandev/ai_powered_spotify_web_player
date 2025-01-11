import { HydrateClient } from "~/trpc/server";
import React from "react";
import SpotifyApp from "../_components/radio/spotifyApp";


export default function Radio() {
  return (
    <HydrateClient>
        <SpotifyApp />
    </HydrateClient>
  );
}
