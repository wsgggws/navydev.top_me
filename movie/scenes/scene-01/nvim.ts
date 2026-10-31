import { typeText } from "@movie/lib/terminal";
import "./nvim.css";

type StoryTimeline = ReturnType<typeof import("gsap").gsap.timeline>;
const API = [
  "from typing import TypedDict", "", "class Health(TypedDict):", "    status: str", "",
  "def health() -> Health:", '    return {"status": "starting"}',
];
const TEST = ["from api import health", "", "def test_health_status():", ""];
const RETURN = '    return {"status": "ok"}';
const ASSERTION = '    assert health()["status"] == "ok"';

function highlight(host: HTMLElement, text: string): void {
  host.replaceChildren();
  const tokens = /("[^"]*"|\b(?:from|import|class|def|return|assert|str)\b)/g;
  let offset = 0;
  for (const match of text.matchAll(tokens)) {
    host.append(text.slice(offset, match.index));
    const token = document.createElement("span");
    token.className = match[0].startsWith('"') ? "nvim-string" : "nvim-keyword";
    token.textContent = match[0];
    host.append(token);
    offset = match.index! + match[0].length;
  }
  host.append(text.slice(offset));
}

function renderCode(host: HTMLElement, lines: string[]): void {
  host.replaceChildren();
  lines.forEach((text, index) => {
    const row = document.createElement("div");
    row.className = "nvim-code-line";
    const number = document.createElement("span");
    number.className = "nvim-number";
    number.textContent = String(index + 1);
    const content = document.createElement("code");
    highlight(content, text);
    row.append(number, content);
    host.append(row);
  });
}

function buffer(name: string, lines: string[]): HTMLElement {
  const pane = document.createElement("section");
  pane.className = "nvim-buffer";
  pane.innerHTML = '<header class="nvim-file"></header><div class="nvim-code"></div><footer class="nvim-status"><strong>NORMAL</strong><span></span><small>Python</small></footer>';
  pane.querySelector(".nvim-file")!.textContent = name;
  pane.querySelector(".nvim-status > span")!.textContent = name;
  renderCode(pane.querySelector(".nvim-code")!, lines);
  return pane;
}

export function createNvimDemo(): HTMLElement {
  const root = document.createElement("section");
  root.className = "nvim-demo";
  root.dataset.phase = "launch";
  root.innerHTML = `<div class="nvim-viewport">
    <section class="nvim-view nvim-launch" data-view="launch"><span>❯ </span><code class="nvim-launch-command"></code></section>
    <section class="nvim-view nvim-dashboard" data-view="dashboard" hidden>
      <span class="nvim-dashboard__mark">N V I M</span><h2>LazyVim</h2><p>Neovim · Python workspace</p>
      <div class="nvim-dashboard__menu"><span>Find File <kbd>Space Space</kbd></span><span>Recent Files <kbd>Space f r</kbd></span><span>New File <kbd>Space f n</kbd></span></div><small>Plugins loaded · Ready</small>
    </section>
    <section class="nvim-view nvim-picker-view" data-view="picker" hidden>
      <div class="nvim-picker" aria-label="Find Files · fzf"><header>Find Files <span>fzf</span></header>
        <div class="nvim-search" role="searchbox" aria-label="Find Files query" aria-readonly="true"><span>❯</span><code class="nvim-query"></code><i></i></div>
        <div class="nvim-picker-grid"><ul class="nvim-files"><li data-file="api.py" aria-selected="true">api.py</li><li data-file="tests/test_api.py">tests/test_api.py</li><li data-file="README.md">README.md</li><li data-file="pyproject.toml">pyproject.toml</li></ul><section class="nvim-preview"><header>Preview · api.py</header><div class="nvim-preview-code"></div></section></div>
        <footer><span class="nvim-match-count">4 files</span><span>Enter ↵ open</span></footer>
      </div>
    </section>
    <section class="nvim-view nvim-editor" data-view="editor" hidden><div class="nvim-editors" data-split="false"></div></section>
    <section class="nvim-view nvim-launch" data-view="closed" hidden><p>✓ Python files saved · Neovim exited</p><div>❯ <span class="nvim-shell-cursor">▍</span></div></section>
  </div>
  <div class="nvim-commandbar"><code class="nvim-command"></code><span class="nvim-feedback">~/github/navydev.top_me</span></div>
  <footer class="nvim-keyboard" aria-label="Neovim keystrokes"><div class="nvim-keys"></div><span class="nvim-save-help"><b>:w</b> 保存 · <b>:wq</b> 保存退出</span></footer>`;
  renderCode(root.querySelector(".nvim-preview-code")!, API);
  const editors = root.querySelector(".nvim-editors")!;
  const left = buffer("api.py", API);
  left.dataset.side = "left";
  const right = buffer("api.py", [...API.slice(0, 6), RETURN]);
  right.dataset.side = "right";
  right.hidden = true;
  editors.append(left, right);
  return root;
}

/** 每次挂载只安排一次，输入、按键、搜索、分屏与保存退出均跟随场景时间线。 */
export function playNvimDemo(timeline: StoryTimeline, root: HTMLElement, start: number): void {
  const at = (time: number) => start + time;
  const call = (time: number, action: () => void) => timeline.call(action, [], at(time));
  const feedback = root.querySelector<HTMLElement>(".nvim-feedback")!;
  const command = root.querySelector<HTMLElement>(".nvim-command")!;
  const left = root.querySelector<HTMLElement>('[data-side="left"]')!;
  const right = root.querySelector<HTMLElement>('[data-side="right"]')!;
  const editors = root.querySelector<HTMLElement>(".nvim-editors")!;
  const phase = (name: string) => {
    root.dataset.phase = name;
    root.querySelectorAll<HTMLElement>("[data-view]").forEach(view => { view.hidden = view.dataset.view !== name; });
  };
  const mode = (pane: HTMLElement, text: string) => { pane.querySelector(".nvim-status strong")!.textContent = text; pane.dataset.mode = text; };
  const press = (labels: string[], time: number, indexes = labels.map((_, index) => index)) => {
    call(time, () => {
      const keys = root.querySelector(".nvim-keys")!;
      keys.replaceChildren(...labels.map((label, index) => {
        const key = document.createElement("kbd");
        key.textContent = label;
        key.dataset.pressed = String(indexes.includes(index));
        return key;
      }));
    });
    call(time + 0.22, () => root.querySelectorAll<HTMLElement>(".nvim-keys kbd").forEach(key => { key.dataset.pressed = "false"; }));
  };
  const exCommand = (text: string, time: number, enter: number, action: () => void) => {
    call(time, () => { feedback.textContent = ""; });
    typeText(timeline, command, text, at(time), text.length > 5 ? 0.65 : 0.3);
    press(["Enter"], enter);
    call(enter, () => { action(); command.textContent = ""; });
  };
  const edit = (pane: HTMLElement, line: number, text: string, time: number, duration: number) => {
    const code = pane.querySelectorAll<HTMLElement>(".nvim-code-line code")[line - 1];
    call(time, () => { mode(pane, "INSERT"); pane.dataset.modified = "true"; code.parentElement!.dataset.cursor = "true"; });
    typeText(timeline, code, text, at(time), duration);
    call(time + duration, () => highlight(code, text));
  };
  typeText(timeline, root.querySelector(".nvim-launch-command")!, "nvim", at(0.15), 0.45);
  call(0.9, () => { phase("dashboard"); feedback.textContent = "LazyVim · Ready"; });
  press(["Space", "Space"], 1.6, [0]);
  press(["Space", "Space"], 1.95, [1]);
  call(2.15, () => { phase("picker"); feedback.textContent = "Find Files · Space Space"; });
  typeText(timeline, root.querySelector(".nvim-query")!, "api.py", at(2.35), 0.65, () => {
    const query = root.querySelector(".nvim-query")!.textContent ?? "";
    let matches = 0;
    root.querySelectorAll<HTMLElement>(".nvim-files li").forEach(file => { file.hidden = !file.dataset.file!.includes(query); if (!file.hidden) matches++; });
    root.querySelector(".nvim-match-count")!.textContent = `${matches} files`;
  });
  press(["Enter"], 3.2);
  call(3.4, () => { phase("editor"); feedback.textContent = "api.py"; });
  press(["C", "C"], 3.8);
  edit(left, 7, RETURN, 4, 0.6);
  press(["Esc"], 4.7);
  call(4.7, () => mode(left, "NORMAL"));
  exCommand(":w", 4.9, 5.95, () => { left.dataset.modified = "false"; feedback.textContent = '"api.py" 7L written · 已保存'; });
  press(["Ctrl", "W"], 6.4);
  press(["V"], 6.75);
  call(7, () => { right.hidden = false; editors.dataset.split = "true"; feedback.textContent = "Ctrl+W → V · 左右分屏"; });
  exCommand(":e tests/test_api.py", 7.2, 7.95, () => {
    right.querySelector(".nvim-file")!.textContent = "tests/test_api.py";
    right.querySelector(".nvim-status > span")!.textContent = "tests/test_api.py";
    renderCode(right.querySelector(".nvim-code")!, TEST);
    feedback.textContent = "tests/test_api.py";
  });
  // 测试文件由上面的 :e 回调创建，目标元素在时间线执行时才可获取。
  call(8.2, () => { mode(right, "INSERT"); right.dataset.modified = "true"; });
  press(["I"], 8.2);
  const assertionProxy = document.createElement("span");
  typeText(timeline, assertionProxy, ASSERTION, at(8.4), 0.8, () => {
    const code = right.querySelectorAll<HTMLElement>(".nvim-code-line code")[3];
    code.textContent = assertionProxy.textContent ?? "";
    code.parentElement!.dataset.cursor = "true";
  });
  call(9.21, () => highlight(right.querySelectorAll<HTMLElement>(".nvim-code-line code")[3], ASSERTION));
  press(["Esc"], 9.35);
  call(9.35, () => mode(right, "NORMAL"));
  exCommand(":w", 9.7, 10.7, () => { right.dataset.modified = "false"; feedback.textContent = '"tests/test_api.py" 4L written · 已保存'; });
  press(["Ctrl", "W"], 11.1);
  press(["C"], 11.45);
  call(11.65, () => { right.hidden = true; editors.dataset.split = "false"; feedback.textContent = "关闭右侧分屏 · api.py"; });
  exCommand(":wq", 12, 13.1, () => { phase("closed"); feedback.textContent = ":wq · 已保存并退出 Neovim"; });
}
