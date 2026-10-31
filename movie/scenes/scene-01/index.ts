import type { SceneModule } from "@movie/types/scene";
import { terminalChrome, typeText } from "@movie/lib/terminal";
import { ATTACH_AT, WINDOWS, type Pane } from "./workspace";
import { scene } from "./config";
import script from "./scene.md?raw";
import "./styles.css";

function highlightCode(host: HTMLElement, text: string): void {
  host.replaceChildren();
  const tokens = /("[^"]*"|'[^']*'|`[^`]*`|\b(?:from|import|class|def|return|func|package|type|struct|string|str)\b)/g;
  let offset = 0;
  for (const match of text.matchAll(tokens)) {
    host.append(text.slice(offset, match.index));
    const token = document.createElement("span");
    token.className = /^["'`]/.test(match[0]) ? "code-string" : "code-keyword";
    token.textContent = match[0];
    host.append(token);
    offset = match.index! + match[0].length;
  }
  host.append(text.slice(offset));
}

function createPane(pane: Pane): HTMLElement {
  const section = document.createElement("section");
  section.className = pane.editor ? "tmux-pane tmux-pane--editor" : "tmux-pane";
  const title = document.createElement("header");
  title.className = "tmux-pane__title";
  title.textContent = pane.title;
  section.append(title);
  const body = document.createElement("div");
  body.className = "tmux-pane__body";
  pane.lines.forEach((line, index) => {
    const row = document.createElement("div");
    row.className = `terminal-line terminal-line--${line.tone ?? "output"}`;
    const prefix = document.createElement("span");
    prefix.className = "terminal-line__prefix";
    prefix.textContent = pane.editor ? String(index + 1) : line.tone === "command" ? (pane.prompt ?? "❯") : line.tone === "user" ? "›" : "";
    const content = document.createElement("span");
    content.className = "terminal-line__text";
    row.append(prefix, content);
    body.append(row);
  });
  section.append(body);
  if (pane.editor) {
    const status = document.createElement("footer");
    status.className = "nvim-status";
    const mode = document.createElement("strong");
    mode.textContent = "NORMAL";
    const file = document.createElement("span");
    file.textContent = pane.editor;
    const saved = document.createElement("span");
    saved.className = "nvim-status__saved";
    saved.textContent = "written ✓";
    status.append(mode, file, saved);
    section.append(status);
  }
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
        window.panes.forEach((pane) => panel.append(createPane(pane)));
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
            if (["command", "user", "code"].includes(line.tone ?? "")) {
              const duration = line.tone === "user" ? 1 : line.tone === "code" ? 0.2 : Math.min(0.7, Math.max(0.28, line.text.length * 0.016));
              typeText(timeline, text, line.text, at, duration, followOutput);
              if (line.tone === "code") timeline.call(() => highlightCode(text, line.text), [], at + duration + 0.01);
            } else {
              timeline.call(() => { text.textContent = line.text; followOutput(); }, [], at);
            }
          });
          if (pane.editor) timeline.set(panel.querySelector(".nvim-status__saved"), { opacity: 1 }, window.at + 3.4);
        });
      });
    },
    pause() {},
    destroy() { root = null; },
  };
}
export default createScene();
