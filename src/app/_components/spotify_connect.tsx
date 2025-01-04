'use client'

import { useState, useEffect } from "react";
import { AuthorizationCodeWithPKCEStrategy, SpotifyApi, UserProfile, PlaybackState } from "@spotify/web-api-ts-sdk";

const SpotifyConnect = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);

  useEffect(() => {
    const implicitGrantStrategy = new AuthorizationCodeWithPKCEStrategy(
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      `http://localhost:3000/radio`,
      ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private', 'user-read-playback-state', 'user-modify-playback-state']
    );

    const spotify = new SpotifyApi(implicitGrantStrategy);
    (async () => {
      setProfile(await spotify.currentUser.profile());
      setPlaybackState(await spotify.player.getPlaybackState());
    })();
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
        <p>Loading profile...</p>
      )}
      {playbackState ? (
        <div>
          <h3>Currently Playing</h3>
          <p>{playbackState.item.name} by {playbackState.item.artists.map(artist => artist.name).join(', ')}</p>
          <img src={playbackState.item.album.images[0]?.url} alt="Album Art" />
        </div>
      ) : (
        <p>Loading currently playing...</p>
      )}
    </div>
  );
};

export default SpotifyConnect;