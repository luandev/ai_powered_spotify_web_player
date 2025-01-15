import { useEffect, useState, useSyncExternalStore } from "react";
import { useSpotifyPlayer } from "./spotifyPlayerContext";
import { defaultState, RadioPlayerProps, RadioTrackProps } from "./types";


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

type SpotifySyncProps = { isInitialStateLoaded: boolean, state: RadioPlayerProps };

const useSpotifySync = (): SpotifySyncProps => {
  const { player } = useSpotifyPlayer();
  
  const [localState, setLocalState] = useState<RadioPlayerProps>(defaultState);
  const [isInitialStateLoaded, setInitialStateLoaded] = useState(false);

  const loadInitialState = async () => {
    if (player) {
      const initState = await player.getCurrentState();
      if (initState) {
        setLocalState(composeSpotifyPlayerState(initState));
      }
      setInitialStateLoaded(true);
    };
  }

  useEffect(() => {
    loadInitialState();
  }, [player?._options.name]);

  const syncState = useSyncExternalStore(
    (callback) => {
      if (player) {
        player.on("player_state_changed", (state) => {
          const radioState = composeSpotifyPlayerState(state);
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

export default useSpotifySync;