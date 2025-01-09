import React, {  useEffect, useState } from "react";
import { SpotifyPlayerProvider, useSpotifyPlayer } from "./SpotifyPlayerContext";
import { UserJson } from "~/server/services/types";



const SpotifyPlayer = ({  }: {}) => {
  const { player } = useSpotifyPlayer();

  const [state, setState] = useState<Spotify.PlaybackState | null>(null);
  const [isLoaded, setLoaded] = useState(false);

  const loadFromSpotify = async () => {
    if(player) {
      const state = await player.getCurrentState();
      setState(state);
      player.on("player_state_changed", (state) => {
        setState(state);
      });
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadFromSpotify();
  }, [player]);

  const togglePlayPause = () => {
    player!.togglePlay();
  };

  const formatTime = (seconds: number | undefined = 0) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressWidth = `${((state?.timestamp || 0) / (state?.duration || 0)) * 100}%`;

  if (!isLoaded) {
    return <div>Loading...</div>;
  }


  return (
    <div className="bg-gray-800 text-white min-h-screen flex justify-center items-center">
      <div className="bg-gray-900 rounded-lg shadow-lg w-96 p-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Now Playing</h2>
          <p className="text-gray-400">Artist - Song Title</p>
        </div>
        <div className="flex justify-center mb-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Album Art"
            className="w-48 h-48 rounded-md"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">{formatTime(state?.timestamp)}</p>
          <div className="w-full bg-gray-700 h-1 mx-2 rounded">
            <div
              className="bg-blue-500 h-1 rounded"
              style={{ width: progressWidth }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm">{formatTime(state?.duration)}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button className="text-gray-400 hover:text-white">
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
            onClick={togglePlayPause}
          >
            {state?.paused ? (
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
          <button className="text-gray-400 hover:text-white">
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
      </div>
    </div>
  );
};

export default SpotifyPlayer;
