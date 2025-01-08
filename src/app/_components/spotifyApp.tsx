'use client'

import React, { useState } from "react";
import { UserInterface } from "~/server/services/types";
import SpotifyConnect from "./spotifyConnect";
import { AccessToken } from "@spotify/web-api-ts-sdk";

const SpotifyApp = () => {
  const [profile, setProfile] = useState<UserInterface | null>(null);
  const [token, setToken] = useState<AccessToken | null>(null);

  return (
    <div>
      <SpotifyConnect onToken={(_token) => setToken(_token)} onConnect={(_profile) => setProfile(_profile)} />
      {token && <SpotifyPlayer profile={ token } /> }
      {profile && <SpotifyDJ profile={ profile } /> }
    </div>
  );
};

export default SpotifyApp;
