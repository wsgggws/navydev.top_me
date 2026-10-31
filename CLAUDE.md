# 维护约定

默认使用简体中文沟通、注释与提交信息；代码标识符保持英文。

## 修改顺序

1. 阅读 `movie/movie.ts`，确认正在修改的场景与播放顺序；内容说明见 [README.md](README.md)。当前仅有 start、四幕和 continue，目录名与 `config.id` 一致。
2. 修改场景时连同 `config.ts`、`scene.md`、`index.ts`、`styles.css` 保持一致；删除场景时移除注册、实现和仅被它使用的能力。
3. 执行 `npm run typecheck`、`npm run build`、`npm run check:performance`。浏览器检查完整播放、章节跳转、暂停 / 重播、片尾链接与横竖屏布局，确认控制台无错误。
4. 用户要求部署时，提交并推送后等待 CI / Deploy 成功，再检查线上页面。部署范围与回退方式见 README。

## 场景边界

- `movie/movie.ts` 静态导入配置，使用动态 `load()` 导入场景实现，保证场景资源按需加载。
- `MovieDirector` 是唯一播放控制者，负责预热、挂载、时间线、转场、跳章和销毁。场景之间保持独立。
- `preload()` 准备资源，`create()` 挂载对象，`warmup()` 准备首帧，`play(timeline)` 安排剧情，`destroy()` 幂等释放资源。
- GSAP timeline 是剧情的唯一时间源；场景动画总时长应不超过 `config.duration`。Director 会补足短于声明时长的空白。
- 节奏集中在 `movie/pacing.ts`：统一调整时间线速度和转场时长，保持场景之间节奏一致。片尾停留，保留链接的键盘访问能力。

## 画面与性能

- 配色统一取自 `src/theme.ts` 的 LuZhu 色板；页面、终端、语法高亮与按键效果使用 `--luzhu-*`，动画文案不展示主题名称或色板说明。
- 第一幕顶部保留欢迎语，命令各输出一行；第二幕围绕 WezTerm / Tmux 的实际工作状态展开，窗口与 pane 内容由 `workspace.ts` 维护。
- Tmux 的 `prefix+l` 默认是 last-window。按顺序循环多个窗口时，保留演示开头的 next-window 绑定，使按键、状态栏与内容切换一致。
- 终端是静态预设动画。文本、输出、按键按下 / 松开、窗口切换都挂到场景主时间线，确保暂停、重播和跳章不会留下额外循环。
- 保持 2.35:1 横屏与 9:16 竖屏，内容避开底部章节和控制条；双分屏与四分屏在竖屏也保留结构，优先精简输出以确保可读。
- 所有场景为 DOM / CSS。首轮只预热 start 与第一幕，播放中只预热下一幕；`check:performance` 检查入口大小、分包和闲置 3D 依赖。
- 当前 reel 静音，保留这一行为。
