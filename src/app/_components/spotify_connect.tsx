'use client'

import { useState, useEffect } from "react";
import { AuthorizationCodeWithPKCEStrategy, SpotifyApi, UserProfile } from "@spotify/web-api-ts-sdk";

const SpotifyConnect = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const implicitGrantStrategy = new AuthorizationCodeWithPKCEStrategy(
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      `http://localhost:3000/radio`,
      ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private, user-read-playback-state, user-modify-playback-state']
    );

    const spotify = new SpotifyApi(implicitGrantStrategy);
    const fetchProfile = async () => {
      const profile = await spotify.currentUser.profile();
      setProfile(profile);
    };

    fetchProfile();
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <h2>{profile.display_name}</h2>
          <img src={profile.images[0]?.url} alt="Profile" />
          <p>{profile.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SpotifyConnect;