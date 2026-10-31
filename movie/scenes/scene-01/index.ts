import type { SceneModule } from "@movie/types/scene";
import { terminalChrome, typeText } from "@movie/lib/terminal";
import { scene } from "./config";
import script from "./scene.md?raw";
import "./styles.css";

const COMMANDS = [
  { command: "whoami", output: "navy / software engineer" },
  { command: "pwd", output: "~/workspace" },
  { command: "printenv EDITOR", output: "nvim" },
  { command: "ls interests/", output: "systems  history  running" },
  { command: "uname -s", output: "Linux" },
];

function createScene(): SceneModule {
  let root: HTMLElement | null = null;
  return {
    config: scene,
    script,
    async preload() {},
    create(r) {
      root = r;
      r.innerHTML = `<section class="intro-terminal">
        ${terminalChrome("navy@workstation — ~")}
        <div class="intro-terminal__body">
          <header class="terminal-welcome"><p>代码爱干净，码码要洗手</p><span>Welcome back, navy.</span></header>
          <div class="intro-commands"></div>
          <div class="intro-ready"><span class="terminal-prompt">❯</span><i aria-hidden="true"></i></div>
        </div>
      </section>`;
      const commands = r.querySelector(".intro-commands")!;
      COMMANDS.forEach(() => {
        const row = document.createElement("div");
        row.className = "intro-command";
        row.innerHTML = '<div class="intro-command__input"><span class="terminal-prompt">❯</span><code></code></div><p></p>';
        commands.appendChild(row);
      });
    },
    play(timeline) {
      if (!root) return;
      timeline.fromTo(root.querySelector(".intro-terminal"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0);
      root.querySelectorAll<HTMLElement>(".intro-command").forEach((row, index) => {
        const at = 0.5 + index * 0.67;
        const { command, output } = COMMANDS[index];
        const input = row.querySelector("code")!;
        const result = row.querySelector("p")!;
        timeline.set(row, { opacity: 1 }, at);
        typeText(timeline, input, command, at, Math.max(0.12, command.length * 0.014));
        timeline.call(() => { result.textContent = output; }, [], at + 0.34);
        timeline.fromTo(result, { opacity: 0 }, { opacity: 1, duration: 0.12 }, at + 0.34);
      });
      timeline.set(root.querySelector(".intro-ready"), { opacity: 1 }, 3.8);
    },
    pause() {},
    destroy() { root = null; },
  };
}
export default createScene();
