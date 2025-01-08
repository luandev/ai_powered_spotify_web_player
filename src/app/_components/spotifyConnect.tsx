'use client'

import { useState, useEffect } from "react";
import { SpotifyApi, AccessToken } from "@spotify/web-api-ts-sdk";
import { UserInterface } from "~/server/services/types";
import { api } from "~/trpc/react";

const SpotifyConnect = ({ onConnect }: { onConnect: (profile: UserInterface) => void }) => {
  const [profile, setProfile] = useState<UserInterface | null>(null);
  const [shouldConnect, setShouldConnect] = useState<boolean>(false);
  const createUserInterface = api.spotify.load.useMutation({});

  const handleToken = async (token: AccessToken) => {
    const userInterface = await createUserInterface.mutateAsync({ token });
    console.log(userInterface);

    setProfile(userInterface);
    onConnect(userInterface);
  };

  const connectToSpotify = async () => {
    SpotifyApi.performUserAuthorization(
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      "http://localhost:3000/radio",
      [
        'user-read-email',  
        'user-read-private',
        'user-follow-read',
        'user-read-playback-state', 
        'user-read-currently-playing',
        'user-read-recently-played', 
      ],
      handleToken
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
      {profile && (
        <div>
          <h2>Profile JSON:</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SpotifyConnect;