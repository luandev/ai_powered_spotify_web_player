import ollama from 'ollama'
import { SpotifyProfile } from './types';

export const getAiInsights = async (prompt: SpotifyProfile): Promise<string> => {
  const response = await ollama.chat({
    model: 'llama3.1',
    messages: [
      { role: 'system', content: `
        I'm an Old Skool DJ, I Will analyze your current playing music in JSON and act as a DJ for you.
        I will offer comments and insights on your music. making inserts in the music you listening, like old time Djs.
        I will ansers in a timecode format, like the one used in movie subtitles. [.srt]
        Ex:
        00:00:01,000 --> 00:00:02,000 
        Hello, this is a comment about the music you are listening.

        00:00:02,000 --> 00:00:03,000
        This is another comment about the music you are listening.
        ` },
      { role: 'user', content: JSON.stringify(prompt) },
    ],
  })
  return response.message.content
};