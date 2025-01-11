import React, { useCallback, useEffect, useState } from "react";
import { useSpotifyPlayer } from "./spotifyPlayerContext";
import AlbumArt from "./playerComponents/albumArt";
import { defaultState, RadioPlayerProps, RadioTrackProps } from "./types";
import RadioButtons from "./playerComponents/radioButtons";

const SpotifyPlayer: React.FC<{ name: string }> = ({ name }) => {
  const { player } = useSpotifyPlayer();

  const [state, setState] = useState<RadioPlayerProps>(defaultState);
  const [isLoaded, setLoaded] = useState(false);

  const composeSpotifyPlayerState = ({
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
  }: Spotify.PlaybackState): RadioPlayerProps => {

    const getTrack = (track: Spotify.Track): RadioTrackProps => {
      return {
        id: track.id ?? "",
        name: track.name,
        artists: track.artists,
        album: track.album
      }
    }

    return {
      paused,
      duration,
      loading,
      position,
      repeat_mode,
      shuffle,
      timestamp,
      playback_quality,
      track_window: {
        current_track: getTrack(current_track),
        next_tracks: next_tracks.map(getTrack),
        previous_tracks: previous_tracks.map(getTrack)
      }
    }
  }

  const loadState = async () => {
    if (player) {
      const state = await player.getCurrentState();
      
      if (state) {
        setState(composeSpotifyPlayerState(state));
      }

      setLoaded(true);
    };
  }
  
  const formatTime = useCallback((seconds: number | undefined = 0) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);

  //inneficient waut to refresh the interface
  //TODO: use a local state to update the interface
  const refreshState = useCallback( async (action: (Player: Spotify.Player) => Promise<void>) => {
    try {
      if (player) {
        await action(player);
        const state = await player.getCurrentState();
        if (state) {
          setState(composeSpotifyPlayerState(state));
        }
      }
    }
    catch (error) {
      console.error("Error performing action:", error);
    }
  }, [player?._options.name]);

  useEffect(() => {
    if (player) {

      loadState();

      player.on("player_state_changed", (state) => {
        setState(composeSpotifyPlayerState(state));
      });

      return () => {
        player.removeListener("player_state_changed");
      }
    }

  }, [player?._options.name]);


  const progressWidth = `${((state?.position || 0) / (state?.duration || 0)) * 100}%`;

  const {
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
  } = state;

  if (!isLoaded || current_track.name === "") {
    return <>
      {/* <div className="bg-gray-800 text-white min-h-screen flex justify-center items-center">
        <div className="bg-gray-900 rounded-lg shadow-lg w-96 animate-pulse p-6">
        </div>
      </div> */}
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
          <p className="text-gray-400 text-sm">{(position)}</p>
          <div className="w-full bg-gray-700 h-1 mx-2 rounded">
            <div
              className="bg-blue-500 h-1 rounded"
              style={{ width: progressWidth }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm">{(duration)}</p>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <RadioButtons isPaused={paused} />
        </div>
        <div className="flex justify-between mb-4">
          <button className="text-gray-400 hover:text-white" onClick={() => refreshState((player) => player.setVolume(0.5))}>Set Volume to 50%</button>
          <button className="text-gray-400 hover:text-white" onClick={() => refreshState((player) => player.seek(position + 15000))}>Seek +15s</button>
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
