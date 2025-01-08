'use client'

import React, { useState } from "react";
import { UserJson } from "~/server/services/types";
import SpotifyConnect from "./spotifyConnect";
import { AccessToken } from "@spotify/web-api-ts-sdk";
import SpotifyPlayer from "./spotifyPlayer";
import { SpotifyPlayerProvider } from "./SpotifyPlayerContext";

const SpotifyApp: React.FC = () => {
  const [profile, setProfile] = useState<UserJson | null>(null);
  const [token, setToken] = useState<AccessToken | null>(null);

  return (
    <div>
      <SpotifyConnect onToken={(_token) => setToken(_token)} onConnect={(_profile) => setProfile(_profile)} />
      {token && 
        <SpotifyPlayerProvider name="Player T3" volume={1} accessToken={token.access_token}>
          <SpotifyPlayer profile={ profile } />
        </SpotifyPlayerProvider> }
      {/* {profile && <SpotifyDJ profile={ profile } /> } */}
    </div>
  );
};

export default SpotifyApp;
