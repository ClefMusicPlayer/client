/* eslint-disable @next/next/no-img-element */

import styles from "../styles/player.module.css";
import {
  PlayerPause,
  PlayerPlay,
  PlayerSkipBack,
  PlayerSkipForward,
  Share,
  Volume,
} from "tabler-icons-react";
import {
  Burger,
  Button,
  Center,
  Container,
  Group,
  LoadingOverlay,
  MantineProvider,
  Slider,
  Stack,
} from "@mantine/core";
import { useEffect, useReducer, useState } from "react";
import Queue from "../lib/Queue";
import { useRouter } from "next/router";
import { downloadSong, getRecomendations } from "../lib/utils";
import type { Song } from "../lib/utils";

const initialState = {
  loop: false,
  showMore: false,
  percentage: 0,
  timestamp: "",
  volume: {
    value: 1,
    show: false,
  },
  paused: true,
  songId: null,
};

type BaseState = typeof initialState;
type State = BaseState & {
  song?: Song;
  audioPlayer?: HTMLAudioElement;
};

type Action = { type: ActionType; payload?: any };
enum ActionType {
  TOGGLE_MORE,
  TOGGLE_LOOP,
  TOGGLE_PAUSE,
  TOGGLE_VOLUME,

  SET_VOLUME,
  SET_STATE,
  SET_SONG,
  SET_SONG_ID,
  SET_PLAYER,
  SET_PAUSE,
}
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.TOGGLE_MORE: {
      return { ...state, showMore: !state.showMore };
    }

    case ActionType.TOGGLE_LOOP: {
      return { ...state, loop: !state.loop };
    }

    case ActionType.TOGGLE_VOLUME: {
      return {
        ...state,
        volume: { ...state.volume, show: !state.volume.show },
      };
    }

    case ActionType.TOGGLE_PAUSE: {
      const newState = !state.paused;
      if (newState && state.audioPlayer) state.audioPlayer.pause();
      else if (state.audioPlayer) state.audioPlayer.play();
      return { ...state, paused: !state.paused };
    }

    case ActionType.SET_VOLUME: {
      if (state.audioPlayer) {
        state.audioPlayer.volume = Math.max(
          0,
          Math.min(1, action.payload / 100)
        );
      }
      return { ...state, volume: { ...state.volume, value: action.payload } };
    }

    case ActionType.SET_SONG: {
      return { ...state, song: { ...action.payload } };
    }

    case ActionType.SET_SONG_ID: {
      return { ...state, songId: action.payload };
    }

    case ActionType.SET_PLAYER: {
      return { ...state, audioPlayer: action.payload };
    }

    case ActionType.SET_PAUSE: {
      return { ...state, paused: action.payload };
    }

    case ActionType.SET_STATE: {
      return { ...state, ...action.payload };
    }
  }
}

type Reducer = (state: State, action: Action) => State;

function persist(reducer: Reducer) {
  return function (state: State, action: Action): State {
    const newState = reducer(state, action);
    localStorage.setItem(
      "state",
      JSON.stringify({ ...newState, audioPlayer: undefined })
    );
    return newState;
  };
}

export default function Player() {
  const [state, dispatch] = useReducer(persist(reducer), initialState);
  const [queue, setQueue] = useState(new Queue());
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState(new Map<string, string>());
  const router = useRouter();
  const {
    loop,
    showMore,
    volume,
    songId,
    song,
    audioPlayer,
    paused,
    percentage,
    timestamp,
  } = state;

  const { thumbnail } = state.song || {};
  const thumb = thumbnail?.large || "/loading.gif";

  useEffect(() => {
    let localState;
    try {
      localState = JSON.parse(localStorage.getItem("state") || "{}");
    } catch (error) {
      console.error(error);
      localStorage.removeItem("state");
    }
    if (localState && Object.keys(localState).length) {
      dispatch({ type: ActionType.SET_STATE, payload: localState });
    }

    const params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    if (id) {
      dispatch({ type: ActionType.SET_SONG_ID, payload: id });
    } else {
      id = localState.song?.id;
      if (id) dispatch({ type: ActionType.SET_SONG, payload: { id } });
      else router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!queue.length) {
      if (songId) {
        getRecomendations(songId).then((queue) => {
          const currentSong = queue.next();
          if (currentSong) {
            dispatch({ type: ActionType.SET_SONG, payload: currentSong });
            dispatch({ type: ActionType.SET_SONG_ID, payload: null });
            setQueue(queue);
          }
        });
      }
    }
  }, [queue, songId]);

  useEffect(() => {
    if (!audioPlayer) {
      window.player = document.createElement("audio");
      player.setAttribute("controls", "controls");
      player.autoplay = true;
      player.volume = Math.max(0, Math.min(1, volume.value / 100));
      dispatch({ type: ActionType.SET_PLAYER, payload: player });
      return;
    }

    if (song) {
      downloadSong(song.id, cache).then((url) => {
        audioPlayer.src = url;
        audioPlayer.load();
      });
    }

    audioPlayer.addEventListener("pause", () => {
      dispatch({ type: ActionType.SET_PAUSE, payload: true });
    });
    audioPlayer.addEventListener("play", () => {
      dispatch({ type: ActionType.SET_PAUSE, payload: false });
      setLoading(false);
    });

    audioPlayer.addEventListener("timeupdate", () => {
      const currentTime = audioPlayer.currentTime;
      const totalTime = audioPlayer.duration;
      const percentage = Math.ceil((currentTime / totalTime) * 100);
      const timestamp = secondsToSplitString(currentTime);
      dispatch({
        type: ActionType.SET_STATE,
        payload: { percentage, timestamp },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song, audioPlayer]);
  return (
    <div className={[styles.playerMain].join(" ")}>
      <Stack px={"xs"}>
        <div id="topBar">
          <div className={styles.actionMore}>
            <Burger
              opened={showMore}
              onClick={() => dispatch({ type: ActionType.TOGGLE_MORE })}
              styles={{
                burger: {
                  "&:after": { backgroundColor: "var(--primary)" },
                  "&:before": { backgroundColor: "var(--primary)" },
                  backgroundColor: !showMore
                    ? "var(--primary) !important"
                    : undefined,
                },
              }}
            >
              ⋮
            </Burger>
            {showMore ? (
              <ul className={styles.actionsList}>
                <li id="loop">
                  <span
                    onClick={() => dispatch({ type: ActionType.TOGGLE_LOOP })}
                  >
                    {loop ? "Loop off" : "Loop on"}
                  </span>
                </li>
                <li>
                  <a href={audioPlayer?.src || "#"} id="download" download>
                    ⤓ Download
                  </a>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
        <div id="thumb">
          <Container px={"xs"}>
            <Center style={{ position: "relative" }}>
              <LoadingOverlay visible={loading} />
              <img
                style={{ border: "2px solid var(--primary)" }}
                className={styles.trackThumb}
                src={thumb}
                alt="loading"
              />
            </Center>
          </Container>
        </div>
        <div id="title">
          <div>
            <div>
              <div>
                <h1
                  className="text-2xl font-medium"
                  style={{ marginBottom: 0, marginTop: 7 }}
                >
                  {song?.title || "Loading, Please wait"}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div id="controls">
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <input
                      type="range"
                      max={100}
                      min={0}
                      id="prog"
                      defaultValue={percentage || 0}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <small id="currenttimestamp"> {timestamp || ""} </small>
                  </div>
                  <div>
                    <small id="totaltimestamp"> {song?.length || ""} </small>
                  </div>
                </div>
              </div>
            </div>
            <Center py="xs">
              <Group>
                <MantineProvider
                  styles={{ Button: { root: { padding: "0" } } }}
                >
                  <div id="share">
                    <Button
                      style={{
                        color: "var(--primary)",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <Share />
                    </Button>
                  </div>
                  <div id="prev">
                    <Button>
                      <PlayerSkipBack style={{ color: "var(--primary)" }} />
                    </Button>
                  </div>
                  <div id="play">
                    <button
                      style={{
                        borderRadius: 50,
                        background: "var(--secondary )",
                        border: "2px solid var(--primary)",
                      }}
                      type="button"
                      onClick={() => {
                        dispatch({ type: ActionType.TOGGLE_PAUSE });
                      }}
                    >
                      {paused ? (
                        <PlayerPlay color={"var(--primary)"} size={"60px"} />
                      ) : (
                        <PlayerPause color={"var(--primary)"} size={"60px"} />
                      )}
                    </button>
                  </div>
                  <div id="next">
                    <Button>
                      <PlayerSkipForward style={{ color: "var(--primary)" }} />
                    </Button>
                  </div>
                  <div id="vol" style={{ position: "relative" }}>
                    {volume.show && (
                      <div className={styles.volumeInput}>
                        <input
                          type="range"
                          name="vol-input"
                          id="vol-input"
                          defaultValue={volume.value}
                          onChange={(v) =>
                            dispatch({
                              type: ActionType.SET_VOLUME,
                              payload: v.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                    <Button
                      onClick={() =>
                        dispatch({ type: ActionType.TOGGLE_VOLUME })
                      }
                    >
                      <Volume
                        style={{
                          color: "var(--primary)",
                          borderRadius: "100vh",
                        }}
                      />
                    </Button>
                  </div>
                </MantineProvider>
              </Group>
            </Center>
          </div>
        </div>
      </Stack>
    </div>
  );
}

function secondsToSplitString(seconds: number) {
  let minutes = Math.floor(seconds / 60);
  let secondsLeft = seconds % 60;
  secondsLeft = Math.round(secondsLeft);
  return `${minutes}:${String(secondsLeft).padStart(2, "0")}`;
}
