import { SpotifyApi, AccessToken } from "@spotify/web-api-ts-sdk";
import { env } from "@/env";
import { SpotifyProfile } from "./types";

export const composeSpotifyProfile = async (accessToken: AccessToken): Promise<SpotifyProfile> => {
  const spotify = SpotifyApi.withAccessToken(env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, accessToken);
  const profile = await spotify.currentUser.profile();
  const playbackState = await spotify.player.getPlaybackState();
  const trackQueue = await spotify.player.getUsersQueue();
  const recentlyPlayedTracks = await spotify.player.getRecentlyPlayedTracks(4);
  const followedArtists = await spotify.currentUser.followedArtists();

  return {
    profile,
    playbackState: playbackState && {
      is_playing: playbackState.is_playing,
      progress_ms: playbackState.progress_ms,
      currently_playing_type: playbackState.currently_playing_type,
      item: playbackState.item 
    },
    followedArtists: followedArtists.artists.items
      .map(({name, type, genres, popularity, id}) => ({name, type, genres, popularity, id})),
    playQueue: trackQueue.queue
      .map(({name, type, duration_ms, href, id}) => ({name, type, duration_ms, href, id})),
    playHistory: recentlyPlayedTracks.items
      .map(({track, played_at}) => ({name: track.name, href: track.href, id: track.id, type: track.type, duration_ms: track.duration_ms, played_at}))
  };
};