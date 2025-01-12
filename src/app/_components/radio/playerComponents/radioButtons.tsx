import React, { useOptimistic, useState } from "react"
import { useSpotifyPlayer } from "../spotifyPlayerContext"

type RadioButtonsProps = {
  isPaused: boolean;
}

const play = (
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
);

const pause = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="none"
  >
    <path d="M6 4l12 8-12 8z" />
  </svg>
);

const prev = (<svg
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
</svg>)

const next = (<svg
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
</svg>)

const RadioButtons: React.FC<RadioButtonsProps> = (componentProps) => {
  const [state, addOptimisticUpdate] = useOptimistic(componentProps);
  const { player } = useSpotifyPlayer();

  const toggleHandler = async () => {
    addOptimisticUpdate((state) => ({ ...state, isPaused: !state.isPaused }));
    try {
      await player?.togglePlay();
    } catch (error) {
      console.error("Toggle failed", error);
      addOptimisticUpdate((state) => ({ ...state, isPaused: !state.isPaused }));
    }
  };

  if (!player) {
    return (
      <div className="flex space-x-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <>
      <button className="text-gray-400 hover:text-white" onClick={() => player.previousTrack()} aria-label="Previous track">
        {prev}
      </button>
      <button className="text-gray-400 hover:text-white" onClick={toggleHandler} aria-label={state.isPaused ? "Play" : "Pause"}>
        {state.isPaused ? pause : play}
      </button>
      <button className="text-gray-400 hover:text-white" onClick={() => player.nextTrack()} aria-label="Next track">
        {next}
      </button>
    </>
  );
};



export default RadioButtons