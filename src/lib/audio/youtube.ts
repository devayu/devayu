// Thin wrapper over the YouTube IFrame Player API. The soundtracks are played
// through YouTube's own embedded player (never downloaded or re-hosted), and
// the player stays visible while it plays, as YouTube's terms require.

/* eslint-disable @typescript-eslint/no-explicit-any */

export type YTPlayer = {
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(v: number): void;
  getCurrentTime(): number;
  getVideoData(): { video_id: string };
  getPlayerState(): number;
  setPlaybackRate(rate: number): void;
};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;

export const loadYouTubeApi = (timeoutMs = 8000): Promise<any> => {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);
    const timer = window.setTimeout(() => reject(new Error("YouTube API timed out")), timeoutMs);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      window.clearTimeout(timer);
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("YouTube API failed to load"));
    };
    document.head.appendChild(tag);
  });
  apiPromise.catch(() => {
    apiPromise = null;
  });
  return apiPromise;
};

export const createPlayer = async (
  host: HTMLElement,
  handlers: { onError: (code: number) => void; onStateChange: (state: number) => void }
): Promise<YTPlayer> => {
  const YT = await loadYouTubeApi();
  return new Promise((resolve) => {
    const player = new YT.Player(host, {
      width: 200,
      height: 200,
      playerVars: { playsinline: 1, rel: 0, controls: 1, disablekb: 1 },
      events: {
        onReady: () => resolve(player),
        onError: (e: { data: number }) => handlers.onError(e.data),
        onStateChange: (e: { data: number }) => handlers.onStateChange(e.data),
      },
    });
  });
};

export const YT_PLAYING = 1;
