# 工作现场

页面打开后直接进入本幕。主时间线使用 0.8008 倍速，在 0.715 基础上再提速 12%；同时压缩 Tmux 恢复、Nvim 命令执行和收尾搜索的空等，声明时长 55.5 秒，实际约 69 秒。命令输入结束后立即给出首个响应；快捷键按下时同步切换界面，其他场景节奏保持不变。

同一个 WezTerm / Tmux 工作流，按顺序展示五个窗口：

- 0:zsh：欢迎语“代码爱干净，码码要洗手”，输入 whoami、j top_me、ls fun/、tmux。进入 navydev.top_me 项目后，Tmux 自动恢复 navy:work session 与五个窗口，恢复完成时一起显示标签。
- 1:nvim：单个 Tmux pane 内先输入 nvim，显示 LazyVim 启动页；按 Space Space 呼出 fzf 文件搜索，输入 api.py，左侧匹配文件、右侧预览，回车进入编辑。修改 Python 健康接口后用 :w 保存，再以 Ctrl+W → V 创建 Neovim 内部分屏，在右侧打开 tests/test_api.py 并编辑断言。测试编辑完成后保持双分屏，用 :wqa 一次保存全部 buffer 并退出 Neovim，两个分屏同时消失。底部始终标明 :w 是保存，:wqa 是全部保存退出。
- 2:git：依次输入 gst、gcb feat/app、gd、make test、ga .、gc 提交、gl origin main --rebase、gp origin feat/app；显示 diff、全部测试通过、pre-commit Ruff lint / format 与 pytest 检查、rebase 成功及创建 PR 的链接。
- 3:ops：左上 docker logs -f api，左下 curl 请求；右上 MySQL 查询，右下 Redis 缓存操作。请求发出后日志同步显示成功响应。
- 4:AI：左侧 Claude 对 diff 做 code review，重点检查正确性、边界情况与测试覆盖，只报告有依据的问题，右侧 Codex 补充测试并运行 make test。

AI 结束后显示 Cmd+B → S，打开仿本机 fzf 的 session:window 搜索浮窗：上方输入 zsh、左侧过滤列表、右侧预览 zsh。按 Enter 回到 0:zsh，再用 Cmd+B → D 临时退出 Tmux，回到带有原先 tmux 命令历史的外层 shell，逐字输入 # Talk is cheap, show me the code.，随后进入第二幕。收尾由 outro.ts / outro.css 维护；Cmd 为展示要求，标准 Tmux 对应 Ctrl+B 前缀。

切换前展示 Ctrl+B，松开后按 N，使用标准 next-window 快捷键，依次切换五个窗口。所有命令和交互输入都展示逐字输入，输出及时跟随滚动；暂停、重播、跳章共用 GSAP 时间线。

窗口、pane、输出与时间点由 workspace.ts 维护，Nvim 子流程由 nvim.ts / nvim.css 维护。所有演示代码、测试与 AI 对话只涉及 Python。所有内容为预设动画，不连接终端、数据库或 AI 服务，不创建真实分支、提交或 PR。

PC 终端宽度为舞台的 84%、高度约 93%；竖屏宽度占满舞台，高度约 90%，上下留白进一步缩小。较矮屏幕为按键提示与控制栏预留空间；按键提示始终位于终端下方。
