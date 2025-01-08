'use client'

import React, { useState } from "react";
import { UserInterface } from "~/server/services/types";
import SpotifyConnect from "./spotifyConnect";

const SpotifyApp = () => {
  const [profile, setProfile] = useState<UserInterface | null>(null);

  return (
    <div>
      <SpotifyConnect onConnect={(profile) => setProfile(profile)} />
    </div>
  );
};

export default SpotifyApp;
