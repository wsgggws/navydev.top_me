import type { SceneConfig } from "@movie/types/scene";
import { WORKSPACE_PLAYBACK_RATE } from "@movie/pacing";

export const scene: SceneConfig = {
  id: "scene-01",
  title: "工作现场",
  caption: "WezTerm / Tmux · 恢复工作区",
  mood: "release",
  pacing: "pulse",
  shot: "medium",
  titleCard: "none",
  duration: 61.5,
  playbackRate: WORKSPACE_PLAYBACK_RATE,
  transition: "fade",
  preload: [],
};
