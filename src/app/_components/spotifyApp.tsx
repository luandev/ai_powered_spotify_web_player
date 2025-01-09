'use client'

import React, { useState } from "react";
import { UserJson } from "~/server/services/types";
import SpotifyConnect from "./spotifyConnect";
import { AccessToken } from "@spotify/web-api-ts-sdk";
import SpotifyPlayer from "./spotifyPlayer";
import { SpotifyPlayerProvider } from "./SpotifyPlayerContext";

const funnyNames = ["DeeJay", "Spotify", "Music", "Tunes", "Jams", "Beats", "Sounds", "Melodies", "Rhythms", "Harmonies"];
const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

const SpotifyApp: React.FC = () => {
  const [profile, setProfile] = useState<UserJson | null>(null);
  const [token, setToken] = useState<AccessToken | null>(null);
  const [name, setName] = useState<string>(`Radio ${shuffleArray(funnyNames).pop()} ${shuffleArray(funnyNames).pop()}`);

  return (
    <div>
      <SpotifyConnect onToken={(_token) => setToken(_token)} onConnect={(_profile) => setProfile(_profile)} />
      {token && 
        <SpotifyPlayerProvider name={name} volume={1} accessToken={token.access_token}>
          <SpotifyPlayer name={name} />
        </SpotifyPlayerProvider> }
    </div>
  );
};

export default SpotifyApp;
