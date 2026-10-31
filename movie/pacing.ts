// 片头、生活、提问与片尾略加快；终端工作流保留原来的阅读节奏。
export const REEL_PLAYBACK_RATE = 0.73;
export const WORKSPACE_PLAYBACK_RATE = 0.65;
export const TRANSITION_MS = 600;

export function getScenePlaybackRate(config: { playbackRate?: number }): number {
  return config.playbackRate ?? REEL_PLAYBACK_RATE;
}
