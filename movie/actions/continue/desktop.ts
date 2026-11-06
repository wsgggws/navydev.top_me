import finder from "./icons/finder.png";
import wezterm from "./icons/wezterm.png";
import sublime from "./icons/sublime.png";
import chrome from "./icons/chrome.png";
import chatgpt from "./icons/chatgpt.png";
import iina from "./icons/iina.png";
import music from "./icons/music.png";
import keka from "./icons/keka.png";
import word from "./icons/word.png";
import excel from "./icons/excel.png";
import powerpoint from "./icons/powerpoint.png";
import longshot from "./icons/longshot.png";
import keycastr from "./icons/keycastr.png";
import alfredMenu from "./icons/menu-alfred.png";
import rectangle from "./icons/rectangle.png";
import launchnext from "./icons/launchnext.png";
import omi from "./icons/omi.png";
import rimeMenu from "./icons/menu-rime.png";
import karabinerMenu from "./icons/menu-karabiner.png";
import keyboardholderMenu from "./icons/menu-keyboardholder.png";
import bobMenu from "./icons/menu-bob.png";
import ccSwitchMenu from "./icons/menu-cc-switch.png";
import awakeMenu from "./icons/menu-awake.png";

const dockApps = [
  { name: "Finder", icon: finder, running: true },
  { name: "WezTerm", icon: wezterm, running: true },
  { name: "Sublime Text", icon: sublime, running: true },
  { name: "Google Chrome", icon: chrome, running: true },
  { name: "ChatGPT", icon: chatgpt, running: true },
  { name: "IINA", icon: iina, running: false },
  { name: "网易云音乐", icon: music, running: false },
  { name: "Keka", icon: keka, running: false },
  { name: "Rectangle", icon: rectangle, running: true },
  { name: "LaunchNext", icon: launchnext, running: true },
  { name: "KeyCastr", icon: keycastr, running: false },
  { name: "Omi录屏专家", icon: omi, running: false },
];

const menuApps = [
  { name: "Alfred", icon: alfredMenu },
  { name: "Rime（鼠须管）", icon: rimeMenu },
  { name: "Karabiner-Elements", icon: karabinerMenu },
  { name: "KeyboardHolder", icon: keyboardholderMenu },
  { name: "Bob", icon: bobMenu },
  { name: "CC Switch", icon: ccSwitchMenu },
  { name: "KeepingYouAwake", icon: awakeMenu },
];

export const desktopAssets = [...new Set([
  ...dockApps.map((app) => app.icon), ...menuApps.map((app) => app.icon),
  word, excel, powerpoint, longshot,
])];

export const brewPackages = ["neovim", "tmux", "fzf", "eza", "starship", "yazi", "uv", "ruff", "lazygit"];

function brewTerminal(): string {
  return `<div class="desktop-terminal" aria-hidden="true">
    <div class="desktop-terminal__bar">
      <div class="continue-note__traffic"><i></i><i></i><i></i></div>
      <span>WezTerm — zsh</span><small>⌘ 1</small>
    </div>
    <div class="desktop-terminal__body">
      <div class="desktop-terminal__prompt"><span>~/Projects</span><span>on</span><b> main</b></div>
      <div class="desktop-terminal__command"><b>❯</b> <span></span><i></i></div>
      <div class="desktop-terminal__output">
        <p class="desktop-terminal__intro"><b>==&gt;</b> Upgrading 9 outdated packages:</p>
        <div class="desktop-terminal__packages">${brewPackages.map((name) => `<div class="desktop-terminal__package"><b>✓</b><span>${name}</span><small>${name === "neovim" ? "nvim" : "updated"}</small></div>`).join("")}</div>
        <p class="desktop-terminal__done"><b>==&gt;</b> Everything is up to date.</p>
        <div class="desktop-terminal__ready"><b>❯</b> <i></i></div>
      </div>
    </div>
    <div class="desktop-terminal__status"><span>zsh</span><span>brew · 9 packages upgraded</span></div>
  </div>`;
}

function folder(name: string, detail: string, previews: string[] = []): string {
  return `<div class="desktop-file">
    <div class="desktop-folder">
      <svg viewBox="0 0 80 64" fill="none"><path d="M5 15a5 5 0 0 1 5-5h21l8 8h31a5 5 0 0 1 5 5v32a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z" fill="var(--luzhu-blue)"/><path d="M5 26a5 5 0 0 1 5-5h60a5 5 0 0 1 5 5v29a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z" fill="var(--luzhu-jade)"/><path d="M11 23h58" stroke="var(--luzhu-fg)" stroke-opacity=".45"/></svg>
      <div class="desktop-folder__previews">${previews.map((src) => `<img src="${src}" alt="" width="128" height="128" draggable="false">`).join("")}</div>
      ${previews.length ? "" : '<span class="desktop-folder__code">&lt;/&gt;</span>'}
    </div>
    <strong>${name}</strong><small>${detail}</small>
  </div>`;
}

// 只使用精选应用图形，不读取访客或本机的实时系统信息。
export function desktopMarkup(): string {
  return `
    <div class="desktop-wallpaper" aria-hidden="true">
      <div class="desktop-wallpaper__sun"></div>
      <div class="desktop-wallpaper__ridge desktop-wallpaper__ridge--far"></div>
      <div class="desktop-wallpaper__ridge desktop-wallpaper__ridge--middle"></div>
      <div class="desktop-wallpaper__ridge desktop-wallpaper__ridge--near"></div>
      <div class="desktop-wallpaper__grain"></div>
    </div>
    <div class="desktop-menubar" aria-hidden="true">
      <div class="desktop-menubar__left">
        <svg class="desktop-apple" viewBox="0 0 24 24" fill="currentColor"><path d="M16.8 2c.1 1.8-1.3 3.8-3.1 4-.3-1.8 1.4-3.7 3.1-4ZM19.9 16.6c-.6 1.4-1 2-1.8 3.1-1 1.3-2.3 2.9-3.9 2.1-1.5-.8-2.3-.8-3.9 0-1.5.8-2.8-.7-3.7-1.9C4 16.3 3.5 11.3 5.2 8.7c1.2-1.8 3.1-2.8 5-2.1 1.6.6 2.5.6 4.2 0 1.8-.6 3.7.1 4.9 1.6-4.2 2.4-3.5 6.6.6 8.4Z"/></svg>
        <b>Finder</b><span>文件</span><span>编辑</span><span>显示</span><span class="desktop-menubar__extra">前往</span><span class="desktop-menubar__extra">窗口</span><span class="desktop-menubar__extra">帮助</span>
      </div>
      <div class="desktop-menubar__right">
        ${menuApps.map((app) => `<span class="desktop-menu-tool desktop-menu-tool--asset" title="${app.name}" style="--menu-icon: url('${app.icon}')"></span>`).join("")}
        <svg class="desktop-status" viewBox="0 0 28 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="21" height="12" rx="3"/><path d="M26 8v4"/><rect x="5" y="7" width="15" height="6" rx="1" fill="currentColor" stroke="none"/></svg>
        <span class="desktop-clock">周五 09:41</span>
      </div>
    </div>
    <div class="desktop-files" aria-hidden="true">
      ${folder("Projects", "保持好奇，继续构建")}
      ${folder("写作与演示", "Word · Excel · PowerPoint", [word, excel, powerpoint])}
      ${folder("截图与录屏", "Longshot · KeyCastr", [longshot, keycastr])}
    </div>
    ${brewTerminal()}
    <div class="desktop-dock-position"><div class="desktop-dock" aria-hidden="true">
      ${dockApps.map((app) => `<div class="desktop-dock__app${app.running ? " desktop-dock__app--running" : ""}"><img src="${app.icon}" alt="" width="128" height="128" draggable="false"><span>${app.name}</span></div>`).join("")}
      <i class="desktop-dock__separator"></i>
      <div class="desktop-dock__trash"><svg viewBox="0 0 40 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m8 12 3 31h18l3-31M6 10h28M15 6h10M16 17l1 20m7-20-1 20"/><ellipse cx="20" cy="10" rx="14" ry="3"/></svg><span>废纸篓</span></div>
    </div></div>`;
}
