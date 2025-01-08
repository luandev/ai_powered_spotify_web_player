import { FollowedArtists, PlaybackState, UserProfile } from "@spotify/web-api-ts-sdk";

export type UserJson =  {
  spotifyProfile: SpotifyProfile;
  aiGeneratedStuff: any; // this is a WIP
}

export interface SpotifyProfile {
  profile: UserProfile;
  playbackState: PlaybackState;
  followedArtists?: FollowedArtists;
}

export interface UserInterface { 
}