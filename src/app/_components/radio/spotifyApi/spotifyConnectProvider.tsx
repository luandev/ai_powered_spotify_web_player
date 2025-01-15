'use client'

import { useState, useEffect, useContext, createContext } from "react";
import { SpotifyApi, AccessToken } from "@spotify/web-api-ts-sdk";
import { UserJson } from "~/server/services/types";
import { api } from "~/trpc/react";

interface SpotifyConnectProps {
  onConnect?: (user: UserJson) => void;
  onToken?: (token: AccessToken) => void;
  children: React.ReactNode;
}

type SpotifyTokenContextProps = {
  token: AccessToken | null;
  profile: UserJson | null;
}

const SpotifyTokenContext = createContext<SpotifyTokenContextProps | undefined>(undefined);
export const useSpotifyToken = () => {
  const context = useContext(SpotifyTokenContext);
  if (!context) {
    throw new Error('useSpotifyToken must be used within a SpotifyTokenProvider');
  }
  return context;
}

const SpotifyConnectProvider = ({ onConnect, onToken, children }: SpotifyConnectProps) => {
  const [profile, setProfile] = useState<UserJson | null>(null);
  const [token, setToken] = useState<AccessToken | null>(null);
  const [shouldConnect, setShouldConnect] = useState<boolean>(false);
  const createUserInterface = api.spotify.load.useMutation({});

  const handleToken = (token: AccessToken) => {
    setToken(token);
    if (onToken) {
      onToken(token);
    }
  };

  const handleUserInterface = async (token: AccessToken) => {
    const user = await createUserInterface.mutateAsync({ token });
    setProfile(user);
    
    if(onConnect) {
      onConnect(user);
    }
  };

  const onAuthorization = async (token: AccessToken) => {
    handleToken(token);
    await handleUserInterface(token);
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
      onAuthorization
    );
  };

  useEffect(() => {
    if (shouldConnect) {
      connectToSpotify();
    }
  }, [shouldConnect]);


  const renderConnectButton = (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to The Spirit of Radio</h1>
        <p className="text-lg mb-8">Connect to Spotify and enjoy your favorite music</p>
        <button
          onClick={setShouldConnect.bind(null, true)}
          className="bg-white text-purple-500 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        >
          Connect to Spotify
        </button>
      </div>
    </div>
  );  

  return (
    <>
      {!profile && renderConnectButton}
      <SpotifyTokenContext.Provider value={{ token, profile }}>
        {children}  
      </SpotifyTokenContext.Provider>
    </>
  );
};

export default SpotifyConnectProvider;