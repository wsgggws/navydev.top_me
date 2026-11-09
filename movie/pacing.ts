// 生活、提问与片尾保持现有节奏；第一幕速率在 0.715 基础上再提高 12%，输入后的停顿由场景时间点消除。
export const REEL_PLAYBACK_RATE = 0.73;
export const WORKSPACE_PLAYBACK_RATE = 0.8008;
export const TRANSITION_MS = 600;

export function getScenePlaybackRate(config: { playbackRate?: number }): number {
  return config.playbackRate ?? REEL_PLAYBACK_RATE;
}
