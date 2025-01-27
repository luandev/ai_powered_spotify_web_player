import React from "react";
import AlbumArt from "./albumArt";
import RadioButtons from "./radioButtons";
import Timecode from "./timecode";
import useSpotifySyncState from "../spotifyApi/spotifySyncState";

const SpotifyPlayer: React.FC<{ name: string }> = ({ name }) => {

  const {
    nextTrack,
    pause,
    previousTrack,
    resume,
    seek,
    setVolume,
    togglePlay,
    isInitialStateLoaded,
    state: {
      paused,
      duration,
      loading,
      position,
      repeat_mode,
      shuffle,
      timestamp,
      playback_quality,
      track_window: {
        current_track,
        next_tracks,
        previous_tracks
      }
    }
  } = useSpotifySyncState()


  if (!isInitialStateLoaded) {
    return <>
      <div className="bg-gray-800 text-white min-h-screen flex justify-center items-center">
        <div className="bg-gray-900 rounded-lg shadow-lg w-96 animate-pulse p-6">
        </div>
      </div> 
    </>;
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
          <AlbumArt album={current_track.album} imagePeriod={500} />
        </div>
        <div className="flex items-center justify-between mb-4">
          <Timecode seek={seek} duration={duration} position={position} isPaused={paused} />
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <RadioButtons previousTrack={previousTrack} nextTrack={nextTrack} togglePlay={togglePlay} isPaused={paused} />
        </div>
        <div className="flex justify-between mb-4">
          {/* <button className="text-gray-400 hover:text-white" onClick={() => player?.setVolume(0.5)}>Set Volume to 50%</button> */}
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
