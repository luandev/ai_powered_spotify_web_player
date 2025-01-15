import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useSpotifyToken } from './spotifyConnectProvider';
import { SpotifyPlayerContextProps } from '../types';

const SpotifyPlayerContext = createContext<SpotifyPlayerContextProps | undefined>(undefined);

export const useSpotifyPlayerContext = () => {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayerContext must be used within a SpotifyPlayerContextProvider');
  }
  return context;
};

export const SpotifyPlayerContextProvider: React.FC<{ name: string, volume: number, children: ReactNode }> = ({ name, volume, children }) => {
  const { token } = useSpotifyToken();
  const accessToken = token?.access_token;

  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const isPlayerInitialized = useRef<Boolean>(false);

  useEffect(() => {
    if (!accessToken || isPlayerInitialized.current) return;

    const cleanupPlayer = () => {
      if (spotifyPlayer) spotifyPlayer.disconnect();
      document.body.removeChild(spotifyScript);
    };

    const clampedVolume = Math.min(1, Math.max(0, volume)); // Ensure valid volume range

    const spotifyScript = document.createElement("script");
    spotifyScript.src = "https://sdk.scdn.co/spotify-player.js";
    spotifyScript.async = true;
    spotifyScript.onerror = () => {
      console.error("Failed to load Spotify Web Playback SDK.");
    };

    document.body.appendChild(spotifyScript);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name,
        volume: clampedVolume,
        getOAuthToken: (cb) => { cb(accessToken); },
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });

      player.addListener('account_error', ({ message }) => {
        console.error(message);
      });

      setSpotifyPlayer(player);
      player.connect();
    };
    isPlayerInitialized.current = true;
    return cleanupPlayer;
  }, [accessToken, name, volume]);

  return ( 
    <SpotifyPlayerContext.Provider value={{ player: spotifyPlayer }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};
