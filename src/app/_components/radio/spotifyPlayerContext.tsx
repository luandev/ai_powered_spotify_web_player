import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useSpotifyToken } from './spotifyConnectContext';
import { SpotifyPlayerContextProps } from './types';


const SpotifyPlayerContext = createContext<SpotifyPlayerContextProps | undefined>(undefined);

export const useSpotifyPlayer = () => {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayer must be used within a SpotifyPlayerProvider');
  }
  return context;
};

export const SpotifyPlayerProvider: React.FC<{ name: string, volume: number, children: ReactNode }> = ({ name, volume, children }) => {
  const {token} = useSpotifyToken();
  const accessToken = token?.access_token;

  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const isInitialized = useRef<Boolean>(false);

  useEffect(() => {
    if (!accessToken || isInitialized.current) return;

    const cleanup = () => {
      if (player) player.disconnect();
      document.body.removeChild(script);
    };

    const clampedVolume = Math.min(1, Math.max(0, volume)); // Ensure valid volume range

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onerror = () => {
      console.error("Failed to load Spotify Web Playback SDK.");
    };

    document.body.appendChild(script);

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

      setPlayer(player);
      player.connect();
    };
    isInitialized.current = true;
    return cleanup;
  }, [accessToken, name, volume]);

  return ( 
    <SpotifyPlayerContext.Provider value={{ player: player }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};