'use client'

import { useState, useEffect } from "react";
import { AuthorizationCodeWithPKCEStrategy, SpotifyApi, UserProfile, PlaybackState, AccessToken,  } from "@spotify/web-api-ts-sdk";
import { env } from "~/env";

const SpotifyConnect = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shouldConnect, setShouldConnect] = useState<boolean>(false);

  const handleToken = async (token: AccessToken) =>  {
    const spotify = SpotifyApi.withAccessToken(env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, token);
    const profile = await spotify.currentUser.profile();
    setProfile(profile);
  }

  const connetToSpotify = async () => {
    SpotifyApi.performUserAuthorization(
      "client-id", 
      env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, 
      ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private', 'user-read-playback-state', 'user-modify-playback-state'],
      handleToken);
  }

  useEffect(() => {
    connetToSpotify();
  }, [shouldConnect]);

  return (
    <div>
     <button onClick={() => setShouldConnect(true)}>Connect to Spotify</button>
    </div>
  );
};

export default SpotifyConnect;