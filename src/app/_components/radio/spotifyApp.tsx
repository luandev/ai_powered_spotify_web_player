'use client'

import React, { useRef } from "react";
import SpotifyConnectProvider from "./spotifyConnectContext";
import SpotifyPlayer from "./spotifyPlayer";
import { SpotifyPlayerProvider } from "./spotifyPlayerContext";


const funnyNames = ["DeeJay", "Spotify", "Music", "Tunes", "Jams", "Beats", "Sounds", "Melodies", "Rhythms", "Harmonies"];
const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

const SpotifyApp: React.FC = () => {
  const name = useRef<string>(`Radio ${shuffleArray(funnyNames).pop()} ${shuffleArray(funnyNames).pop()}`);

  return (
    <div>
      <SpotifyConnectProvider>
        <SpotifyPlayerProvider name={name.current} volume={1}>
          <SpotifyPlayer name={name.current} />
        </SpotifyPlayerProvider>
      </SpotifyConnectProvider>
    </div>
  );
};

export default SpotifyApp;
