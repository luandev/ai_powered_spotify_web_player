import React, { useState } from "react"
import { useSpotifyPlayer } from "../spotifyPlayerContext"

type RadioButtonsProps = {
  isPaused: boolean;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({ isPaused: buttonState }) => {

  const {player} = useSpotifyPlayer();
  const [paused, setToggle] = useState(buttonState)

  const toggleHandler = () => {
    setToggle((prevToggle) => !prevToggle)
    player?.togglePlay()
  }

  return (
    <>
      <button className="text-gray-400 hover:text-white" onClick={() => player?.previousTrack()}>
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
        onClick={toggleHandler}
      >
        {!paused ? (
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
      <button className="text-gray-400 hover:text-white" onClick={() => player?.nextTrack()}>
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
    </>
  )
}



export default RadioButtons