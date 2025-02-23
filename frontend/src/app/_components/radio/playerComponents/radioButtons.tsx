import React, { useCallback, useOptimistic, useRef, useState, useTransition } from "react"

type RadioButtonsProps = {
  isPaused: boolean;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  togglePlay: () => Promise<void>;
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

const RadioButtons: React.FC<RadioButtonsProps> = ({isPaused, nextTrack, togglePlay, previousTrack}) => {
  const [state, addOptimisticUpdate] = useOptimistic({isPaused});
  const [_isPending, startTransition] = useTransition();
  const debounceTimer = useRef<NodeJS.Timeout>();

  const debounce = <T extends unknown[]>(func: (...args: T) => void, delay: number) => ((...args: T) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      func(...args);
    }, delay)
  })

  const toggleHandler:React.MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(async () => {
      try {
        await togglePlay();
      } catch (error) {
        console.error("Toggle failed", error);
        addOptimisticUpdate((state) => ({ ...state, isPaused: !state.isPaused }));
      }
    })
    addOptimisticUpdate((state) => ({ ...state, isPaused: !state.isPaused }));
  };

  const debouncedToggleHandler = useCallback(
    debounce(toggleHandler, 300),
    [toggleHandler] // Dependencies
  );
  
  return (
    <>
      <button className="text-gray-400 hover:text-white" onClick={previousTrack} aria-label="Previous track">
        {prev}
      </button>
      <button className="text-gray-400 hover:text-white" onClick={debouncedToggleHandler} aria-label={state.isPaused ? "Play" : "Pause"}>
        {state.isPaused ? pause : play}
      </button>
      <button className="text-gray-400 hover:text-white" onClick={nextTrack} aria-label="Next track">
        {next}
      </button>
    </>
  );
};



export default RadioButtons