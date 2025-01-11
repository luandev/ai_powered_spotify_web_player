export type RadioAlbumProps = {
  name: string;
  uri: string;
  images: { url: string }[];
};

export type RadioTrackProps = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: RadioAlbumProps;
};

export type RadioTrackWindowProps = {
  current_track: RadioTrackProps;
  previous_tracks: RadioTrackProps[];
  next_tracks: RadioTrackProps[];
};

export type RadioPlayerProps = {
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

export const defaultState: RadioPlayerProps = {
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

export interface SpotifyPlayerContextProps {
  player: Spotify.Player | null;
}
