import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useSpotifyToken } from './spotifyConnectProvider';
import { SpotifyPlayerContextProps } from '../types';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { env } from '@/env';


const SpotifyPlayerContext = createContext<SpotifyPlayerContextProps | undefined>(undefined);

export const useSpotifyPlayerContext = () => {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayerContext must be used within a SpotifyPlayerContextProvider');
  }
  return context;
};

export const SpotifyPlayerContextProvider: React.FC<{ name: string, children: ReactNode }> = ({ name, children }) => {
  
  const { token } = useSpotifyToken();
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const isPlayerInitialized = useRef<Boolean>(false);

  useEffect(() => {
    if (!token || isPlayerInitialized.current) return;

    const cleanupPlayer = () => {
      if (spotifyPlayer) spotifyPlayer.disconnect();
      document.body.removeChild(spotifyScript);
    };

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
        getOAuthToken: (cb) => { cb(token.access_token); },
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        const sdk = SpotifyApi.withAccessToken(env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, token);
        sdk.player.transferPlayback([device_id], true).then(() => {
          console.log('Playback transer');
        });
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
  }, [token?.access_token, name]);

  return ( 
    <SpotifyPlayerContext.Provider value={{ player: spotifyPlayer }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};
