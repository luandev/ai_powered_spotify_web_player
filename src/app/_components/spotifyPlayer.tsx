import React, { useEffect, useState } from "react";
import { useSpotifyPlayer } from "./SpotifyPlayerContext";

const SpotifyPlayer: React.FC<{name: string}> = ({name}) => {
  const { player } = useSpotifyPlayer();

  const [state, setState] = useState<Spotify.PlaybackState | null>(null);
  const [isLoaded, setLoaded] = useState(false);

  const loadState = async () => {
    const state = await player.getCurrentState();
    setState(state);
    player.on("player_state_changed", (state) => {
      setState(state);
    });
  };

  useEffect(() => {
    loadState()
      .then(() => setLoaded(true));
  }, []);

  const formatTime = (seconds: number | undefined = 0) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressWidth = `${((state?.position || 0) / (state?.duration || 0)) * 100}%`;

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const defaultState = {
    paused: true,
    duration: 0,
    loading: true,
    position: 0,
    repeat_mode: 0,
    shuffle: false,
    timestamp: 0,
    playback_quality: "",
    track_window: {
      current_track: {
        name: "",
        artists: [],
        album: {
          images: []
        }
      },
      previous_tracks: [],
      next_tracks: []
    }
  };

  const { 
    paused, 
    duration, 
    loading, 
    position, 
    repeat_mode, 
    shuffle, 
    timestamp,
    playback_quality, 
    track_window 
  } = state || defaultState;
  
  const current_track = track_window?.current_track;
  const next_tracks = track_window?.next_tracks || [];
  const previous_tracks = track_window?.previous_tracks || [];

  //inneficient waut to refresh the interface
  //TODO: use a local state to update the interface

  const refreshState = (action: () => Promise<void>) => {
    action()
      .then(() => loadState())
      .catch((error) => console.error("Error performing action:", error));
  }
  return (
    <div className="bg-gray-800 text-white min-h-screen flex justify-center items-center">
      <div className="bg-gray-900 rounded-lg shadow-lg w-96 p-6">
        <div className="text-center mb-4">
          <h3>{name}</h3>
          <h2 className="text-xl font-bold">Now Playing</h2>
          <p className="text-gray-400">{current_track.artists.map(artist => artist.name).join(', ')} - {current_track.name}</p>
        </div>
        <div className="flex justify-center mb-4">
          <img
            src={current_track.album.images[0]?.url || "https://via.placeholder.com/150"}
            alt="Album Art"
            className="w-48 h-48 rounded-md"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">{formatTime(position)}</p>
          <div className="w-full bg-gray-700 h-1 mx-2 rounded">
            <div
              className="bg-blue-500 h-1 rounded"
              style={{ width: progressWidth }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm">{formatTime(duration)}</p>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <button className="text-gray-400 hover:text-white" onClick={player.previousTrack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7 7-7M17 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => refreshState(() => player.togglePlay())}
          >
            {paused ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 4h4v16H6zm8 0h4v16h-4z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="none"
              >
                <path d="M6 4l12 8-12 8z" />
              </svg>
            )}
          </button>
          <button className="text-gray-400 hover:text-white" onClick={player.nextTrack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7-7 7M7 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-between mb-4">
          <button className="text-gray-400 hover:text-white" onClick={() => refreshState(() => player.setVolume(0.5))}>Set Volume to 50%</button>
          <button className="text-gray-400 hover:text-white" onClick={() => player.seek(position + 15000)}>Seek +15s</button>
        </div>
        <div className="text-center mb-4">
          <p className="text-gray-400">Repeat Mode: {repeat_mode}</p>
          <p className="text-gray-400">Shuffle: {shuffle ? "On" : "Off"}</p>
          <p className="text-gray-400">Playback Quality: {playback_quality}</p>
        </div>
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">Next Tracks</h3>
          {next_tracks.map(track => (
            <p key={track.id} className="text-gray-400">{track.name} - {track.artists.map(artist => artist.name).join(', ')}</p>
          ))}
        </div>
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">Previous Tracks</h3>
          {previous_tracks.map(track => (
            <p key={track.id} className="text-gray-400">{track.name} - {track.artists.map(artist => artist.name).join(', ')}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;