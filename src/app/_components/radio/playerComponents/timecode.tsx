import { time } from "console";
import React, { useCallback, useEffect, useRef, useState } from "react";

type TimecodeProps = {
  position: number;
  duration: number;
  isPaused: boolean;
}

const Timecode: React.FC<TimecodeProps> = ({ position, duration, isPaused }) => {
  const [clockPosition, setPosition] = useState(position)
  const timer = useRef<NodeJS.Timeout>();
  
  const clearTimer = useCallback(()=> {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = undefined;
    }
  }, [])

  const getProgres = () => 
    ((clockPosition) / (duration)) * 100

  function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000); // Convert to seconds
    const minutes = Math.floor(totalSeconds / 60); // Get the minutes
    const seconds = totalSeconds % 60; // Get the remaining seconds
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

    useEffect(() => {
    setPosition(position);
  }, [position]);
  
  useEffect(() => {
    const timerIncrement = 1000;

    if (isPaused) {
      clearTimer()
    } else if (!timer.current) {
      timer.current = setInterval(() => {
        setPosition((prevPosition) => {
          const newPosition = prevPosition + timerIncrement;
          if (newPosition >= duration) {
            clearTimer()
            return duration;
          }
          return newPosition;
        });
      }, timerIncrement);
    }

    return () => {
      if (timer.current) {
        clearTimer()
      }
    };
  }, [ duration, isPaused, clearTimer ])


  // const seek:React.MouseEventHandler<HTMLDivElement> = ({clientX, clientY, screenX, screenY, detail, eventPhase}) => {
  //   console.log({clientX, clientY, screenX, screenY, detail, eventPhase})
{/* <button className="text-gray-400 hover:text-white" onClick={() => refreshState((player) => player.seek(position + 15000))}>Seek +15s</button> */}
  // }

  return(
    <>
      <p className="w-24 text-center text-gray-400 text-sm">{formatTime(clockPosition)}</p>
      <div className="w-full bg-gray-700 h-1 mx-2 rounded">
        <div
          // onClick={seek}
          className="bg-blue-500 h-1 rounded"
          style={{ width: `${getProgres()}%` }}
        ></div>
      </div>
      <p className="w-24 text-center text-gray-400 text-sm">{formatTime(duration)}</p>
    </>
  )
};

export default Timecode;
