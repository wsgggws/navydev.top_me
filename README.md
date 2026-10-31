# navydev.top_me

[navydev.top/me](https://navydev.top/me/) 是一卷自动播放的电影化个人作品集，统一使用 [LuZhu.nvim](https://github.com/wsgggws/LuZhu.nvim) 的潭绿、珠白、玉青配色。

## 当前内容

播放顺序为 **start → 1 → 2 → 3 → 4 → continue**。场景目录、配置 ID、章节轨和快捷键均按新顺序编号。

| 标记 | 模块 | 内容 |
| --- | --- | --- |
| start | `movie/actions/start` | 生活就是自导自演的一场戏 |
| 1 | `movie/scenes/scene-01` | 关于我：CRT 终端中的身份、原则与兴趣 |
| 2 | `movie/scenes/scene-02` | 手边的工具：Neovim / Tmux、Codex / Git、Python / Go、Docker / Nginx |
| 3 | `movie/scenes/scene-03` | 屏幕之外：阅读、跑步与观察 |
| 4 | `movie/scenes/scene-04` | 继续提问：为什么、如果与下一步 |
| continue | `movie/actions/continue` | 未完待续、座右铭、GitHub 与主页链接；停留在最终画面 |

第二幕的工具分组在 `movie/scenes/scene-02/index.ts` 的 `TOOLKIT` 中维护。

- 配色集中在 `src/theme.ts`，取自相邻 `LuZhu.nvim/lua/luzhu/palette.lua`；CSS、Canvas 文字、CRT 材质和 3D 灯光共用色板。页面加载底色与浏览器主题色也保持潭绿。
- `movie/pacing.ts` 统一控制速度：时间线为原速的 **65%**，每段转场开合各 **600ms**。片头约 4 秒，四幕约 15 / 18 / 12 / 13 秒；片尾出现后保持。
- 章节可直接点击重播或跳转；`1`–`4` 跳章，`Space` 暂停 / 播放，`R` 重播，`S` / `→` 跳过，`Home` 从头开始。
- 横屏使用 2.35:1 舞台，竖屏使用 9:16；控制层无操作 3 秒后隐藏。系统减少动态效果设置会缩短并简化转场。
- 当前版本静音，已移除闲置音频和不再使用的场景、旧配色与转场实现。

## 本地开发

Node 20+，技术栈为 React、TypeScript、Vite、GSAP、Three.js。

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

CRT 使用 Three.js。首轮只预热 pipeline、start 和第一幕，避免首屏同时下载整卷；渲染质量根据设备与 FPS 调整。`check:performance` 限制入口为 80KB，并检查 React / GSAP 分包及 Three.js 延迟加载。

匿名性能统计发送到站点的 `/__perf.gif`，仅包含 LCP、INP、长任务、FPS 与渲染质量等诊断指标。

## 部署

GitHub Actions 在推送 `main` 或 `v*.*.*` tag 后检查、构建并发布。仓库 Secrets：`SSH_PRIVATE_KEY`、`REMOTE_IP`、`SSH_USER`。

发布范围为 `/var/www/navydev.top/me/`：

1. 构建 `dist/`，打包并上传远端临时目录。
2. 替换 `/me` 目录的静态产物；`random.html` 发布到 `/me/nghh/random.html`。
3. 清理远端临时文件。

站点路由由相邻 `nginx-config` 仓库管理，本项目部署不修改 Nginx 或其他站点目录。Vite base 固定为 `/me/`，避免资源引用根目录 `/assets/`。

回退时可从 GitHub Actions 重跑之前成功提交的 Deploy 工作流。
