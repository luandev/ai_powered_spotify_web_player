declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: string;
    NEXT_PUBLIC_GENIUS_CLIENT_ID: string;
    ELEVENLABS_API_KEY: string;
  }
}