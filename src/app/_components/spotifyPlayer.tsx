import React, { useCallback, useEffect, useState } from "react";
import { useSpotifyPlayer } from "./spotifyPlayerContext";

type RadioTrackProps = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    uri: string;
    images: { url: string }[];
  };
};

type RadioTrackWindowProps = {
  current_track: RadioTrackProps;
  previous_tracks: RadioTrackProps[];
  next_tracks: RadioTrackProps[];
};

type RadioPlayerProps = {
  paused: boolean;
  duration: number;
  loading: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  timestamp: number;
  playback_quality: string;
  track_window: RadioTrackWindowProps;
};

const defaultState: RadioPlayerProps = {
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
      id: "",
      name: "",
      artists: [],
      album: {
        name: "",
        uri: "",
        images: []
      }
    },
    previous_tracks: [],
    next_tracks: []
  }
};

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

  if (!isLoaded || loading || current_track.name === "") {
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
          <button className="text-gray-400 hover:text-white" onClick={player?.previousTrack}>
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
            onClick={() => refreshState((player) => player.togglePlay())}
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
          <button className="text-gray-400 hover:text-white" onClick={() => refreshState((player) => player.nextTrack())}>
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
