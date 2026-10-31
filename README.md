# navydev.top_me

[navydev.top/me](https://navydev.top/me/) 是一卷自动播放的电影化个人作品集，使用 [LuZhu.nvim](https://github.com/wsgggws/LuZhu.nvim) 的潭绿、珠白、玉青配色。

## 当前内容

播放顺序为 **start → 1 → 2 → 3 → 4 → continue**。场景目录、配置 ID、章节轨和快捷键均按新顺序编号。

| 标记 | 模块 | 内容 |
| --- | --- | --- |
| start | `movie/actions/start` | 生活似自导自演的电影；座右铭“此心光明，神采飞扬” |
| 1 | `movie/scenes/scene-01` | 关于我：欢迎界面与五条快速命令 |
| 2 | `movie/scenes/scene-02` | 工作现场：WezTerm / Tmux 的 Git、双分屏 Nvim、四分屏运维与 Codex 对话 |
| 3 | `movie/scenes/scene-03` | 屏幕之外：阅读、跑步与观察 |
| 4 | `movie/scenes/scene-04` | 继续提问：为什么、如果与下一步 |
| continue | `movie/actions/continue` | 未完待续、GitHub 与主页链接；停留在最终画面 |

第一幕的命令集中在 `movie/scenes/scene-01/index.ts` 的 `COMMANDS`；第二幕的窗口、pane、文本和时间点集中在 `movie/scenes/scene-02/workspace.ts`。

- 第 1 幕顶部是“代码爱干净，码码要洗手”的欢迎语；五条命令各输出一行，约 5 秒显示完整，随后留出阅读时间。
- 第 2 幕为四个 Tmux window：Git 单 pane、Nvim 左右两个 pane、运维四个 pane、Codex 单 pane。Python / Go 代码、运行中的容器、make test 全部通过及 Codex 对话依次出现。
- 窗口切换展示真实顺序的键帽动作：`Ctrl+B` → `L`。Tmux 默认 `prefix+l` 为 last-window；演示先使用 `tmux bind-key l next-window`，让四窗口依次切换。
- 终端内容是预设动画，不连接真实终端，也不执行命令。所有文本、输出、按键和窗口变化均由 GSAP 主时间线驱动，支持暂停、重播和跳章。
- 配色集中在 `src/theme.ts`，来自 LuZhu.nvim 色板；页面、终端、语法高亮与按键效果统一使用 `--luzhu-*`。动画不展示主题名称或色板说明。
- `movie/pacing.ts` 保持统一的 **0.65** 倍播放与开合各 **600ms** 的转场。第一幕使用更密集的时间点，第二幕约 40 秒，留出每个工作窗口的阅读时间。
- 章节可直接点击重播或跳转；`1`–`4` 跳章，`Space` 暂停 / 播放，`R` 重播，`S` / `→` 跳过，`Home` 从头开始。
- 横屏使用 2.35:1 舞台，竖屏使用 9:16；控制层无操作 3 秒后隐藏。系统减少动态效果设置会缩短并简化转场。
- 当前版本静音，已移除闲置音频和不再使用的场景、旧配色与转场实现。

## 本地开发

Node 20+，技术栈为 React、TypeScript、Vite、GSAP。

```bash
npm ci
npm run dev
# http://localhost:5173/me/
```

提交前执行：

```bash
npm run typecheck
npm run build
npm run check:performance
```

随后手动检查完整播放、六个章节按钮、暂停 / 重播 / 跳过、片尾两个链接，以及横竖屏布局。维护规则见 [CLAUDE.md](CLAUDE.md)。

## 架构

React 负责舞台与控制层，`movie/movie.ts` 仅静态导入轻量配置，场景实现经 `load()` 按需加载。`MovieDirector` 负责播放、转场、资源销毁、错误重试与预热下一幕；剧情统一写入各场景的 GSAP timeline。

所有场景使用 DOM / CSS，已删除 CRT 的 Three.js、shader、渲染质量控制和 GPU 依赖。首轮只预热 start 和第一幕，其余随播放逐幕加载。`check:performance` 限制入口为 80KB，检查 React / GSAP 分包并阻止闲置 3D chunk 回到构建。

匿名性能统计发送到站点的 `/__perf.gif`，仅包含 LCP、INP、长任务、FPS 等诊断指标；渲染类型标记为 `dom`。

## 部署

GitHub Actions 在推送 `main` 或 `v*.*.*` tag 后检查、构建并发布。仓库 Secrets：`SSH_PRIVATE_KEY`、`REMOTE_IP`、`SSH_USER`。

发布范围为 `/var/www/navydev.top/me/`：

1. 构建 `dist/`，打包并上传远端临时目录。
2. 替换 `/me` 目录的静态产物；`random.html` 发布到 `/me/nghh/random.html`。
3. 清理远端临时文件。

站点路由由相邻 `nginx-config` 仓库管理，本项目部署不修改 Nginx 或其他站点目录。Vite base 固定为 `/me/`，避免资源引用根目录 `/assets/`。

回退时可从 GitHub Actions 重跑之前成功提交的 Deploy 工作流。
