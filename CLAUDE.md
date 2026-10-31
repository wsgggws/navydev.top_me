# 维护约定

默认使用简体中文沟通、注释与提交信息；代码标识符保持英文。

## 修改顺序

1. 阅读 `movie/movie.ts`，确认正在修改的场景与播放顺序；内容说明见 [README.md](README.md)。当前仅有 start、四幕和 continue，目录名与 `config.id` 一致。
2. 修改场景时连同 `config.ts`、`scene.md`、`index.ts`、`styles.css` 保持一致；删除场景时移除注册、实现和仅被它使用的能力。
3. 执行 `npm run typecheck`、`npm run build`、`npm run check:performance`。浏览器检查完整播放、章节跳转、暂停 / 重播、片尾链接与横竖屏布局，确认控制台无错误。
4. 用户要求部署时，提交并推送后等待 CI / Deploy 成功，再检查线上页面。部署范围与回退方式见 README。

## 场景边界

- `movie/movie.ts` 静态导入配置，使用动态 `load()` 导入场景实现，保证 Three.js 和场景资源延迟加载。
- `MovieDirector` 是唯一播放控制者，负责预热、挂载、时间线、转场、跳章和销毁。场景之间保持独立。
- `preload()` 准备资源，`create()` 挂载对象，`warmup()` 准备首帧，`play(timeline)` 安排剧情，`destroy()` 幂等释放资源。
- GSAP timeline 是剧情的唯一时间源；场景动画总时长应不超过 `config.duration`。Director 会补足短于声明时长的空白。
- 节奏集中在 `movie/pacing.ts`：统一调整时间线速度和转场时长，保持场景之间节奏一致。片尾停留，保留链接的键盘访问能力。

## 画面与性能

- 配色以 `src/theme.ts` 为唯一运行时来源，来自相邻 LuZhu.nvim 的色板。CSS 使用 `--luzhu-*`，Canvas / Three.js 使用同一个 `luzhu` 对象；加载背景与 HTML theme-color 同步。
- 文字使用珠白 / 薄绢，玉青、碧玉、钗金作强调；CRT、光影和过场也遵循 LuZhu，避免恢复旧版荧光 RGB、纯黑或霓虹配色。
- 保持 2.35:1 横屏与 9:16 竖屏，内容避开底部章节和控制条；系统减少动态效果设置下使用简短 fade。
- Three.js 通过 `ensureThree()` 预载，再创建 `CinematicStage`。Canvas 纹理只在文字变化时更新，销毁时释放材质、几何体、纹理、渲染器和 ticker。
- 首轮只预热 start 与第一幕，播放中只预热下一幕。入口预算和延迟加载规则由 `check:performance` 检查。
- 当前 reel 静音，保留这一行为。
