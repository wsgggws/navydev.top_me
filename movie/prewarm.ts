import type { SceneEntry } from "./types/scene";

let activePrewarm: Promise<void> | null = null;
const OPENING_SCENE_COUNT = 1;

async function preloadEntry(entry: SceneEntry): Promise<void> {
  const scene = await entry.load();
  await scene.preload();
}

export function prewarmReel(reel: SceneEntry[]): Promise<void> {
  if (activePrewarm) return activePrewarm;

  // 首轮只预热第一幕；Director 在播放开始后预热下一幕，避免争用首屏资源。
  activePrewarm = Promise.allSettled([
    ...reel.slice(0, OPENING_SCENE_COUNT).map(preloadEntry),
  ])
    .then(() => undefined);

  return activePrewarm;
}
