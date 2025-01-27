'use client'

import React, { useRef } from "react";
import SpotifyPlayer from "./playerComponents/spotifyPlayer";
import { SpotifyPlayerContextProvider } from "./spotifyApi/playerContextProvider";
import ConnectProvider from "./spotifyApi/spotifyConnectProvider";


const funnyNames = ["DeeJay", "Spotify", "Music", "Tunes", "Jams", "Beats", "Sounds", "Melodies", "Rhythms", "Harmonies"];
const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

const RadioApp: React.FC = () => {

  // the name changes every run, just so it's easier to find it spotify devices
  const name = useRef<string>(`Radio ${shuffleArray(funnyNames).pop()} ${shuffleArray(funnyNames).pop()}`);

  return (
    <ConnectProvider>
      <SpotifyPlayerContextProvider name={name.current}>
        <SpotifyPlayer name={name.current} />
      </SpotifyPlayerContextProvider>
    </ConnectProvider>
  );
};

export default RadioApp;
