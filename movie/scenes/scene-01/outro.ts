import { typeText } from "@movie/lib/terminal";
import { WINDOWS } from "./workspace";
import "./outro.css";

type StoryTimeline = ReturnType<typeof import("gsap").gsap.timeline>;

/** 参考本机 fzf window-picker：session:window 标签与右侧 pane 预览。 */
export function createWorkspaceOutro(): HTMLElement {
  const overlay = document.createElement("section");
  overlay.className = "window-picker-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `<div class="window-picker" aria-label="Tmux session:window search">
    <header>session:window <span>fzf · windows</span></header>
    <div class="window-picker__search" role="searchbox" aria-label="Select window query" aria-readonly="true"><span>Select window &gt;</span><code class="window-picker__query"></code><i>▍</i></div>
    <div class="window-picker__grid"><div class="window-picker__list" role="listbox" aria-label="Tmux windows"></div><section class="window-picker__preview"><header>navy:AI · 2 panes</header><pre class="window-picker__screen"></pre></section></div>
    <footer><span class="window-picker__count">5 / 5</span><span>Enter ↵ switch · Esc cancel</span></footer>
  </div>`;
  const list = overlay.querySelector(".window-picker__list")!;
  [...WINDOWS].reverse().forEach(window => {
    const row = document.createElement("div");
    row.className = "window-picker__item";
    row.dataset.name = window.name;
    row.setAttribute("role", "option");
    row.setAttribute("aria-selected", String(window.name === "AI"));
    row.textContent = `${window.name === "AI" ? "● " : "  "}navy:${window.name}${window.panes.length > 1 ? ` [${window.panes.length}p]` : ""}`;
    list.append(row);
  });
  return overlay;
}

export function playWorkspaceOutro(
  timeline: StoryTimeline,
  host: HTMLElement,
  selectWindow: (index: number) => void,
  shortcut: (at: number, key: string, label: string, modifier?: string) => void,
): void {
  const picker = host.querySelector<HTMLElement>(".window-picker-overlay")!;
  const shell = host.querySelector<HTMLElement>(".shell-return")!;
  const body = shell.querySelector<HTMLElement>(".tmux-pane__body")!;
  const followOutput = () => { body.scrollTop = body.scrollHeight; };
  const detached = document.createElement("div");
  detached.className = "terminal-line terminal-line--muted";
  detached.textContent = "[detached (from session navy)]";
  const quote = document.createElement("div");
  quote.className = "terminal-line terminal-line--accent shell-return__quote";
  const prompt = document.createElement("span");
  prompt.className = "terminal-line__prefix";
  prompt.textContent = "❯";
  const text = document.createElement("span");
  text.className = "terminal-line__text";
  quote.append(prompt, text);
  body.append(detached, quote);

  shortcut(52.5, "S", "session:window search", "Cmd");
  timeline.call(() => {
    picker.hidden = false;
    picker.querySelector(".window-picker__screen")!.textContent = "claude · review          │ codex · tests\n\n✓ Review complete        │ make test\n                         │ ✓ Python: 4 passed\n                         │ ready for review";
  }, [], 52.5);
  typeText(timeline, picker.querySelector(".window-picker__query")!, "zsh", 53.4, 0.7, () => {
    const query = picker.querySelector(".window-picker__query")!.textContent ?? "";
    let count = 0;
    picker.querySelectorAll<HTMLElement>(".window-picker__item").forEach(row => {
      row.hidden = !row.dataset.name!.toLowerCase().includes(query);
      row.setAttribute("aria-selected", String(row.dataset.name === (query ? "zsh" : "AI")));
      if (!row.hidden) count++;
    });
    picker.querySelector(".window-picker__count")!.textContent = `${count} / 5`;
    if (query) {
      picker.querySelector(".window-picker__preview header")!.textContent = "navy:zsh · 1 pane";
      picker.querySelector(".window-picker__screen")!.textContent = "❯ whoami\nnavy / software engineer\n\n❯ j top_me\n~/github/navydev.top_me\n\n❯ ls fun/\nreading/  running/  history/\n\n❯ ▍";
    }
  });
  timeline.call(() => {
    const hud = host.querySelector(".shortcut-hud")!;
    hud.querySelector('[data-key="ctrl"]')!.textContent = "Enter";
    hud.setAttribute("data-enter", "true");
    hud.querySelector(".shortcut-hud__label")!.textContent = "switch to 0:zsh";
  }, [], 55);
  timeline.call(() => {
    picker.hidden = true;
    selectWindow(0);
    host.querySelector(".shortcut-hud")!.removeAttribute("data-enter");
    host.querySelector('[data-key="ctrl"]')!.textContent = "Cmd";
  }, [], 55.35);
  shortcut(57, "D", "detach session", "Cmd");
  timeline.call(() => {
    host.querySelectorAll<HTMLElement>(".tmux-window").forEach(panel => { panel.hidden = true; });
    host.dataset.attached = "false";
    host.dataset.window = "shell";
    shell.hidden = false;
    followOutput();
  }, [], 57);
  timeline.set(detached, { display: "flex", opacity: 1 }, 57);
  timeline.set(quote, { display: "flex", opacity: 1 }, 57.7);
  typeText(timeline, text, "# Talk is cheap, show me the code.", 57.7, 1.8, followOutput);
}
