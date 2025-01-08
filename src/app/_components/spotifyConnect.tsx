'use client'

import { useState, useEffect } from "react";
import { SpotifyApi, AccessToken } from "@spotify/web-api-ts-sdk";
import { UserInterface } from "~/server/services/types";
import { api } from "~/trpc/react";

interface SpotifyConnectComponent {
  onConnect?: (userInterface: UserInterface) => void;
  onToken?: (token: AccessToken) => void;
}

const SpotifyConnect = ({ onConnect, onToken }: SpotifyConnectComponent) => {
  const [profile, setProfile] = useState<UserInterface | null>(null);
  const [token, setToken] = useState<AccessToken | null>(null);
  const [shouldConnect, setShouldConnect] = useState<boolean>(false);
  const createUserInterface = api.spotify.load.useMutation({});

  const handleToken = async (token: AccessToken) => {
    setToken(token);
    if (onToken) {
      onToken(token);
    }
  };

  const handleUserInterface = async (token: AccessToken) => {
    const userInterface = await createUserInterface.mutateAsync({ token });
    setProfile(userInterface);
    
    if(onConnect) {
      onConnect(userInterface);
    }
  };

  const handleButton = async (token: AccessToken) => {
    handleToken(token);
    handleUserInterface(token);
    
  };

  const connectToSpotify = async () => {
    SpotifyApi.performUserAuthorization(
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      "http://localhost:3000/radio",
      [
        'streaming',
        'user-read-email',  
        'user-read-private',
        'user-follow-read',
        'user-read-playback-state', 
        'user-read-currently-playing',
        'user-read-recently-played', 
      ],
      handleButton
    );
  };

  useEffect(() => {
    if (shouldConnect) {
      connectToSpotify();
    }
  }, [shouldConnect]);

  return (
    <div>
      {!profile && <button onClick={() => setShouldConnect(true)}>Connect to Spotify</button>}
      {/* {profile && (
        <div>
          <h2>Profile JSON:</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default SpotifyConnect;