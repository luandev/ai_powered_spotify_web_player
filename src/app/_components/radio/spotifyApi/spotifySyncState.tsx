import { useEffect, useState, useSyncExternalStore } from "react";
import { useSpotifyPlayerContext } from "./playerContextProvider";
import { defaultState, RadioPlayerProps, RadioTrackProps } from "../types";

const mapSpotifyPlaybackStateToRadioPlayerProps = ({
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

  const mapSpotifyTrackToRadioTrackProps = (track: Spotify.Track): RadioTrackProps => {
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
      current_track: mapSpotifyTrackToRadioTrackProps(current_track),
      next_tracks: next_tracks.map(mapSpotifyTrackToRadioTrackProps),
      previous_tracks: previous_tracks.map(mapSpotifyTrackToRadioTrackProps)
    }
  }
}

type SpotifySyncState = { isInitialStateLoaded: boolean, state: RadioPlayerProps };

const useSpotifySyncState = (): SpotifySyncState => {
  const { player } = useSpotifyPlayerContext();
  
  const [localState, setLocalState] = useState<RadioPlayerProps>(defaultState);
  const [isInitialStateLoaded, setIsInitialStateLoaded] = useState(false);

  const loadInitialState = async () => {
    if (player) {
      const initialState = await player.getCurrentState();
      if (initialState) {
        setLocalState(mapSpotifyPlaybackStateToRadioPlayerProps(initialState));
      }
      setIsInitialStateLoaded(true);
    };
  }

  useEffect(() => {
    loadInitialState();
  }, [player?._options.name]);

  const syncState = useSyncExternalStore(
    (callback) => {
      if (player) {
        player.on("player_state_changed", (state) => {
          const radioState = mapSpotifyPlaybackStateToRadioPlayerProps(state);
          setLocalState(radioState)
          callback();
        });
        return () => {
          player.removeListener("player_state_changed");
        }
      }
      return () => {}
    },
    () => localState,
    () => defaultState
  );

  return {
    isInitialStateLoaded,
    state: syncState
  };
}

export default useSpotifySyncState;
