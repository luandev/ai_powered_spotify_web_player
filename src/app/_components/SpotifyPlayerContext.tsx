import { AccessToken } from '@spotify/web-api-ts-sdk';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SpotifyPlayerContextProps {
  player: Spotify.Player;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextProps | undefined>(undefined);

export const useSpotifyPlayer = () => {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayer must be used within a SpotifyPlayerProvider');
  }
  return context;
};

export const SpotifyPlayerProvider: React.FC<{ accessToken: string, name: string, volume: number, children: ReactNode }> = ({ accessToken: token, name, volume, children }) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name,
        volume,
        getOAuthToken: (cb) => { cb(token); },
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

      return () => {
        player.disconnect();
      };
    };
  }, [token]);

  return ( 
    <React.Fragment>
      {player && 
      <SpotifyPlayerContext.Provider value={{ player: player! }}>
        {children}
      </SpotifyPlayerContext.Provider>
      }
    </React.Fragment>
  );
};