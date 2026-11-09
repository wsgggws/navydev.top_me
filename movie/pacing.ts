// 生活、提问与片尾保持现有节奏；第一幕整体提速 10%，同步压缩输入与输出等待。
export const REEL_PLAYBACK_RATE = 0.73;
export const WORKSPACE_PLAYBACK_RATE = 0.715;
export const TRANSITION_MS = 600;

export function getScenePlaybackRate(config: { playbackRate?: number }): number {
  return config.playbackRate ?? REEL_PLAYBACK_RATE;
}
