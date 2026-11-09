import type { SceneEntry } from "./types/scene";
import { scene as workspace } from "./scenes/scene-01/config";
import { scene as offscreen } from "./scenes/scene-02/config";
import { scene as curiosity } from "./scenes/scene-03/config";
import { scene as continuation } from "./actions/continue/config";

const reel: SceneEntry[] = [
  { config: workspace, load: async () => (await import("./scenes/scene-01")).default },
  { config: offscreen, load: async () => (await import("./scenes/scene-02")).default },
  { config: curiosity, load: async () => (await import("./scenes/scene-03")).default },
  { config: continuation, load: async () => (await import("./actions/continue")).default },
];

export default reel;
