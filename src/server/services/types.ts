import { Artist, PlaybackState, PlayHistory, TrackItem, UserProfile } from "@spotify/web-api-ts-sdk";

export type UserJson =  {
  spotifyProfile: SpotifyProfile;
  aiGeneratedStuff: any; // this is a WIP
}

export type UserTrack =  {
  id: string;
  name : string;
  type : string;
  duration_ms: number;
  href: string;
  played_at?: string;
}

export type UserArtist =  {
  id: string;
  name: string;
  type: string;
  genres: string[];
  popularity: number;
}

export interface SpotifyProfile {
  profile: UserProfile;
  playbackState: Partial<PlaybackState>;
  followedArtists: Array<UserArtist>;
  playQueue: Array<UserTrack>;
  playHistory: Array<UserTrack>;
}

export interface UserInterface { 
}