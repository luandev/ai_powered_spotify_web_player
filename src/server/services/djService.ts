import { AccessToken } from "@spotify/web-api-ts-sdk";
import { UserInterface, UserJson } from "./types";
import { composeSpotifyProfile } from "./spotifyService";
import { saveUser } from "./repositoryService";
import { getAiInsights } from "./llmService";

export const createInterface = async (accessToken: AccessToken): Promise<UserInterface> => {
  const spotifyProfile = await composeSpotifyProfile(accessToken);
  let aiGeneratedStuff = {}
  if(false) {
    aiGeneratedStuff = await getAiInsights(spotifyProfile)
  }
  const user:UserJson = {
    spotifyProfile,
    aiGeneratedStuff
  }
  const id = "test";
  return {
    id,
    ...user
  }
};