'use client'

import { useState, useEffect, Fragment } from "react";
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
    <Fragment>
      {!profile && (
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
      )}
    </Fragment>
  );
};

export default SpotifyConnect;