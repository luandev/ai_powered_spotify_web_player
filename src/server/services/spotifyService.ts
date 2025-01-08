import { SpotifyApi, UserProfile, PlaybackState, AccessToken } from "@spotify/web-api-ts-sdk";
import { env } from "~/env";
import { SpotifyProfile } from "./types";

export const composeSpotifyProfile = async (accessToken: AccessToken): Promise<SpotifyProfile> => {
  console.log("I got here!");
  const spotify = SpotifyApi.withAccessToken(env.SPOTIFY_CLIENT_ID, accessToken);
  const profile = await spotify.currentUser.profile();
  const playbackState = await spotify.player.getPlaybackState();
  // const followedArtists = await spotify.currentUser.followedArtists();
  console.log("And here!");

  return  {
    profile,
    playbackState,
    // followedArtists
  };
};