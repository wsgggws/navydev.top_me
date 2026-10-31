import type { SceneModule } from "@movie/types/scene";
import { terminalChrome, typeText } from "@movie/lib/terminal";
import { ATTACH_AT, WINDOWS, type Pane } from "./workspace";
import { scene } from "./config";
import { createNvimDemo, playNvimDemo } from "./nvim";
import script from "./scene.md?raw";
import "./styles.css";

function createPane(pane: Pane): HTMLElement {
  const section = document.createElement("section");
  section.className = "tmux-pane";
  const title = document.createElement("header");
  title.className = "tmux-pane__title";
  title.textContent = pane.title;
  section.append(title);
  const body = document.createElement("div");
  body.className = "tmux-pane__body";
  pane.lines.forEach((line) => {
    const row = document.createElement("div");
    row.className = `terminal-line terminal-line--${line.tone ?? "output"}`;
    const prefix = document.createElement("span");
    prefix.className = "terminal-line__prefix";
    prefix.textContent = line.tone === "command" ? (pane.prompt ?? "❯") : line.tone === "user" ? "›" : "";
    const content = document.createElement("span");
    content.className = "terminal-line__text";
    row.append(prefix, content);
    body.append(row);
  });
  section.append(body);
  return section;
}

function createScene(): SceneModule {
  let root: HTMLElement | null = null;
  return {
    config: scene,
    script,
    async preload() {},
    create(r) {
      root = r;
      r.innerHTML = `<section class="workstation">
        ${terminalChrome("WezTerm — navy@workstation")}
        <div class="tmux-windows"></div>
        <footer class="tmux-status"><strong>navy:work</strong><div class="tmux-tabs"></div><span class="tmux-layout-label"></span></footer>
      </section>
      <div class="shortcut-hud" aria-label="窗口切换快捷键"><kbd data-key="ctrl">Ctrl</kbd><span>+</span><kbd data-key="b">B</kbd><span class="shortcut-hud__then">then</span><kbd data-key="l">L</kbd><span class="shortcut-hud__label">next window</span></div>`;
      const windows = r.querySelector(".tmux-windows")!;
      const tabs = r.querySelector(".tmux-tabs")!;
      WINDOWS.forEach((window, index) => {
        const panel = document.createElement("div");
        panel.className = `tmux-window tmux-window--${window.layout}`;
        panel.dataset.window = window.name;
        panel.setAttribute("aria-label", `${window.name} · ${window.panes.length} ${window.panes.length === 1 ? "pane" : "panes"}`);
        panel.hidden = index !== 0;
        if (window.demo === "nvim") panel.append(createNvimDemo());
        else window.panes.forEach((pane) => panel.append(createPane(pane)));
        windows.append(panel);
        const tab = document.createElement("span");
        tab.textContent = `${index}:${window.name}`;
        tab.dataset.active = String(index === 0);
        tabs.append(tab);
      });
      r.querySelector(".tmux-layout-label")!.textContent = "1 pane";
      r.dataset.window = WINDOWS[0].name;
      r.dataset.attached = "false";
    },
    play(timeline) {
      if (!root) return;
      const host = root;
      const panels = Array.from(host.querySelectorAll<HTMLElement>(".tmux-window"));
      const tabs = Array.from(host.querySelectorAll<HTMLElement>(".tmux-tabs > span"));
      const ctrl = host.querySelector<HTMLElement>('[data-key="ctrl"]')!;
      const b = host.querySelector<HTMLElement>('[data-key="b"]')!;
      const l = host.querySelector<HTMLElement>('[data-key="l"]')!;
      const hud = host.querySelector<HTMLElement>(".shortcut-hud")!;
      timeline.fromTo(host.querySelector(".workstation"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0);
      timeline.call(() => { host.dataset.attached = "true"; }, [], ATTACH_AT);
      WINDOWS.forEach((window, index) => {
        if (index > 0) {
          timeline.call(() => { hud.dataset.pressing = "true"; ctrl.dataset.pressed = b.dataset.pressed = "true"; }, [], window.at - 0.85);
          timeline.call(() => { ctrl.dataset.pressed = b.dataset.pressed = "false"; l.dataset.pressed = "true"; }, [], window.at - 0.28);
          timeline.call(() => {
            panels.forEach((panel, position) => { panel.hidden = position !== index; });
            tabs.forEach((tab, position) => { tab.dataset.active = String(position === index); });
            host.dataset.window = window.name;
            host.querySelector(".tmux-layout-label")!.textContent = `${window.panes.length} ${window.panes.length === 1 ? "pane" : "panes"}`;
          }, [], window.at);
          timeline.fromTo(panels[index], { opacity: 0.4 }, { opacity: 1, duration: 0.2 }, window.at);
          timeline.call(() => { l.dataset.pressed = "false"; hud.dataset.pressing = "false"; }, [], window.at + 0.2);
        }
        if (window.demo === "nvim") {
          playNvimDemo(timeline, panels[index].querySelector<HTMLElement>(".nvim-demo")!, window.at);
          return;
        }
        window.panes.forEach((pane, paneIndex) => {
          const panel = panels[index].querySelectorAll<HTMLElement>(".tmux-pane")[paneIndex];
          const body = panel.querySelector<HTMLElement>(".tmux-pane__body")!;
          const followOutput = () => { body.scrollTop = body.scrollHeight; };
          const rows = panel.querySelectorAll<HTMLElement>(".terminal-line");
          pane.lines.forEach((line, rowIndex) => {
            const row = rows[rowIndex];
            const text = row.querySelector<HTMLElement>(".terminal-line__text")!;
            const at = window.at + line.at;
            timeline.set(row, { display: "flex", opacity: 1 }, at);
            timeline.call(followOutput, [], at);
            if (["command", "user"].includes(line.tone ?? "")) {
              const duration = line.tone === "user" ? 1 : Math.min(0.7, Math.max(0.28, line.text.length * 0.016));
              typeText(timeline, text, line.text, at, duration, followOutput);
            } else {
              timeline.call(() => { text.textContent = line.text; followOutput(); }, [], at);
            }
          });
        });
      });
    },
    pause() {},
    destroy() { root = null; },
  };
}
export default createScene();
