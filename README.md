# navydev.top_me

[navydev.top/me](https://navydev.top/me/) 是一卷自动播放的电影化个人作品集，使用 [LuZhu.nvim](https://github.com/wsgggws/LuZhu.nvim) 的潭绿、珠白、玉青配色。

## 当前内容

播放顺序为 **start → 1 → 2 → 3 → continue**。场景目录、配置 ID、章节轨和快捷键按顺序编号。

| 标记 | 模块 | 内容 |
| --- | --- | --- |
| start | `movie/actions/start` | 生活似自导自演的电影；座右铭“此心光明，神采飞扬” |
| 1 | `movie/scenes/scene-01` | 同一个 WezTerm / Tmux 工作流：zsh、Nvim、Git、运维、AI |
| 2 | `movie/scenes/scene-02` | 屏幕之外：阅读、跑步与观察 |
| 3 | `movie/scenes/scene-03` | 继续提问：为什么、如果与下一步 |
| continue | `movie/actions/continue` | 未完待续、GitHub 与主页链接；停留在最终画面 |

第一幕的五个窗口、pane、文本与时间点集中在 `movie/scenes/scene-01/workspace.ts`：

| 窗口 | 布局 | 工作流 |
| --- | --- | --- |
| `0:zsh` | 单 pane | 欢迎语；`whoami` → `j top_me` → `ls fun/` → `tmux bind-key l next-window` → `tmux attach`，随后显示全部窗口标签 |
| `1:nvim` | 左右双 pane | 编辑 Python 的 app.py 与 Go 的 health.go，保留原编辑内容 |
| `2:git` | 单 pane | `gst` → `gcb feat/app` → `gd` → `make test` → `ga .` → `gc -m"feat(app): add app.py and health.go"` → `gl origin main --rebase` → `gp origin feat/app`；显示 pre-commit 检查与创建 PR 的链接 |
| `3:ops` | 四 pane | 左上 Docker 日志，左下 curl 请求；右上 MySQL 查询，右下 Redis 缓存操作 |
| `4:AI` | 左右双 pane | Claude 检查实现，Codex 补充测试并运行 make test |

Git 动画沿用 shell 别名：`gst=git status --short`、`gcb=git checkout -b`、`gd=git diff`、`ga=git add`、`gc=git commit`、`gl=git pull`、`gp=git push`。别名说明只用于维护，不作为额外命令输出。

- 窗口切换展示 `Ctrl+B` → `L` 键帽动作。Tmux 默认 prefix+l 是 last-window；zsh 中先绑定 next-window，使五个窗口依次切换。
- 每条命令均逐字输入，并显示相应输出；长输出自动滚动到最新行。所有文本、滚动、按键和窗口变化均跟随 GSAP 时间线，支持暂停、重播和跳章。
- 终端、数据库、AI 对话和 PR 地址均为预设动画，不连接真实服务，不执行命令或创建 PR。
- 配色集中在 `src/theme.ts`，来自 LuZhu.nvim 色板；页面、终端、语法高亮与按键效果统一使用 `--luzhu-*`。动画不展示主题名称或色板说明。
- `movie/pacing.ts` 保持 **0.65** 倍播放与开合各 **600ms** 的转场；第一幕命令节奏紧凑，约 **66 秒**，其余两幕保留原节奏。
- `1`–`3` 跳章，`Space` 暂停 / 播放，`R` 重播，`S` / `→` 跳过，`Home` 从头开始。
- 横屏使用 2.35:1 舞台，竖屏使用 9:16，保留双分屏和四分屏结构；控制层无操作 3 秒后隐藏。系统减少动态效果设置会简化转场与输入效果。
- 当前版本静音，已删除独立欢迎终端和合并后不再使用的场景代码。

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

随后手动检查完整播放、五个章节按钮、暂停 / 重播 / 跳过、片尾两个链接，以及横竖屏布局。维护规则见 [AGENTS.md](AGENTS.md)。

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
