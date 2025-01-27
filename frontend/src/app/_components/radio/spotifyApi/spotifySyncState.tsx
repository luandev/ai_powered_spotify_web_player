import { Reducer, ReducerWithoutAction, useEffect, useReducer, useState, useSyncExternalStore } from "react";
import { useSpotifyPlayerContext } from "./playerContextProvider";
import { defaultState, RadioPlayerProps, RadioTrackProps } from "../types";
import { UserJson } from "@/server/services/types";

type SpotifySyncState = { isInitialStateLoaded: boolean; state: RadioPlayerProps };
type SpotifyActions = {
  togglePlay: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  seek: (pos_ms: number) => Promise<void>;
  resume: () => Promise<void>;
  pause: () => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  setProfile: (profile: UserJson) => Promise<void>
};

type Action =
  | { type: "LOAD_PROFILE"; payload: UserJson }
  | { type: "LOAD_INITIAL_STATE"; payload: RadioPlayerProps }
  | { type: "UPDATE_STATE"; payload: RadioPlayerProps }
  | { type: "SEEK", payload: number }
  | { type: "VOLUME", payload: number }
  | { type: "TOGGLE_PLAY" }
  | { type: "NEXT_TRACK" }
  | { type: "PREVIOUS_TRACK" }
  | { type: "PAUSE" }
  | { type: "RESUME" };

const mapSpotifyPlaybackStateToRadioPlayerProps = ({
  paused,
  duration,
  loading,
  position,
  repeat_mode,
  shuffle,
  timestamp,
  playback_quality,
  track_window: { current_track, next_tracks, previous_tracks },
}: Spotify.PlaybackState): Partial<RadioPlayerProps> => {
  const mapSpotifyTrackToRadioTrackProps = (track: Spotify.Track): RadioTrackProps => {
    return {
      id: track.id ?? "",
      name: track.name,
      artists: track.artists,
      album: track.album,
    };
  };

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
      current_track: mapSpotifyTrackToRadioTrackProps(current_track),
      next_tracks: next_tracks.map(mapSpotifyTrackToRadioTrackProps),
      previous_tracks: previous_tracks.map(mapSpotifyTrackToRadioTrackProps),
    },
  };
};

const reducer = (state: RadioPlayerProps, action: Action ): RadioPlayerProps => {
  switch (action.type) {
    case "LOAD_PROFILE":
      return { ...state, profile: action.payload };
    case "LOAD_INITIAL_STATE":
      return { ...state, ...action.payload };
    case "UPDATE_STATE":
      return { ...state, ...action.payload };
    case "SEEK":
      const newPosition = state.position + action.payload;
      return { ...state, position: newPosition }
    case "VOLUME":
      return { ...state, volume: action.payload }
    case "TOGGLE_PLAY":
      return { ...state, paused: !state.paused };
    case "NEXT_TRACK":
      return { ...state, loading: true };
    case "PREVIOUS_TRACK":
      return { ...state, loading: true };
    case "PAUSE":
      return { ...state, paused: true };
    case "RESUME":
      return { ...state, paused: false };
    default:
      return state;
  }
};

const useSpotifySyncState = (): SpotifySyncState & SpotifyActions => {

  const [state, dispatch] = useReducer(reducer, defaultState);
  const [isInitialStateLoaded, setIsInitialStateLoaded] = useState(false);
  const { player } = useSpotifyPlayerContext();

  const loadInitialState = async () => {
    if (player) {
      const spotifyState = await player.getCurrentState();
      const volume = await player.getVolume();
      const initialState: RadioPlayerProps  = { 
        ...defaultState, 
        ... spotifyState ? mapSpotifyPlaybackStateToRadioPlayerProps(spotifyState) : {}, 
        volume: volume 
      }
      
      dispatch({ type: "LOAD_INITIAL_STATE", payload: initialState });
      setIsInitialStateLoaded(true);
    }
  };

  useEffect(() => {
    loadInitialState();
  }, [player?._options.name]);

  const syncState = useSyncExternalStore(
    (callback) => {
      if (player) {
        player.on("player_state_changed", (spotifyState) => {
          const radioState = {
            ...state,
            ...mapSpotifyPlaybackStateToRadioPlayerProps(spotifyState),
          }
          dispatch({ type: "UPDATE_STATE", payload: radioState });
          callback();
        });
        return () => {
          player.removeListener("player_state_changed");
        };
      }
      return () => {};
    },
    () => state,
    () => defaultState
  );

  // Dispatch actions for Spotify interactions
  const togglePlay = async () => {
    if (player) {
      await player.togglePlay();
      dispatch({ type: "TOGGLE_PLAY" });
    }
  };

  const nextTrack = async () => {
    if (player) {
      await player.nextTrack();
      dispatch({ type: "NEXT_TRACK" });
    }
  };

  const previousTrack = async () => {
    if (player) {
      await player.previousTrack();
      dispatch({ type: "PREVIOUS_TRACK" });
    }
  };

  const pause = async () => {
    if (player) {
      await player.pause();
      dispatch({ type: "PAUSE" });
    }
  };

  const resume = async () => {
    if (player) {
      await player.resume();
      dispatch({ type: "RESUME" });
    }
  };

  const seek = async (pos_ms: number) => {
    if (player) {
      await player.seek(pos_ms);
      dispatch({ type: "SEEK", payload: pos_ms });
    }
  };

  const setVolume = async (volume: number) => {
    if (player) {
      await player.setVolume(volume);
      dispatch({ type: "VOLUME", payload: volume });
    }
  };

  const setProfile = async (profile: UserJson) => {
    if (player) {
      dispatch({ type: "LOAD_PROFILE", payload: profile });
    }
  };


  return {
    isInitialStateLoaded,
    state: syncState,
    togglePlay,
    setProfile,
    setVolume,
    seek,
    resume,
    pause,
    previousTrack,
    nextTrack,
  };
};

export default useSpotifySyncState;
