# 工作现场

同一个 WezTerm / Tmux 工作流，按顺序展示五个窗口：

- 0:zsh：欢迎语“代码爱干净，码码要洗手”，输入 whoami、j top_me、ls fun/、tmux bind-key l next-window、tmux attach。进入 navydev.top_me 项目，attach 后显示全部窗口标签。
- 1:nvim：单个 Tmux pane 内先输入 nvim，显示 LazyVim 启动页；按 Space Space 呼出 fzf 文件搜索，输入 api.py，左侧匹配文件、右侧预览，回车进入编辑。修改 Python 健康接口后用 :w 保存，再以 Ctrl+W → V 创建 Neovim 内部分屏，在右侧打开 tests/test_api.py 并编辑断言。以 :w 保存测试，关闭右侧分屏后用 :wq 保存并退出剩余窗口。底部始终标明 :w 是保存，:wq 是保存退出。
- 2:git：依次输入 gst、gcb feat/app、gd、make test、ga .、gc 提交、gl origin main --rebase、gp origin feat/app；显示 diff、全部测试通过、pre-commit Ruff lint / format 与 pytest 检查、rebase 成功及创建 PR 的链接。
- 3:ops：左上 docker logs -f api，左下 curl 请求；右上 MySQL 查询，右下 Redis 缓存操作。请求发出后日志同步显示成功响应。
- 4:AI：左侧 Claude 对 diff 做 code review，重点检查正确性、边界情况与测试覆盖，只报告有依据的问题，右侧 Codex 补充测试并运行 make test。

AI 结束后显示 Cmd+B → S，打开仿本机 fzf 的 session:window 搜索浮窗：上方输入 zsh、左侧过滤列表、右侧预览 zsh。按 Enter 回到 0:zsh，再用 Cmd+B → D 临时退出 Tmux，回到带有原先 tmux attach 历史的外层 shell，逐字输入 # Talk is cheap, show me the code.，随后进入第二幕。收尾由 outro.ts / outro.css 维护；Cmd 为展示要求，标准 Tmux 对应 Ctrl+B 前缀。

切换前展示 Ctrl+B，松开后按 L。演示中的 next-window 绑定使快捷键与窗口顺序一致。所有命令和交互输入都展示逐字输入，输出及时跟随滚动；暂停、重播、跳章共用 GSAP 时间线。

窗口、pane、输出与时间点由 workspace.ts 维护，Nvim 子流程由 nvim.ts / nvim.css 维护。所有演示代码、测试与 AI 对话只涉及 Python。所有内容为预设动画，不连接终端、数据库或 AI 服务，不创建真实分支、提交或 PR。

PC 终端宽度为舞台的 84%、高度约 93%；竖屏宽度占满舞台，高度约 90%，上下留白进一步缩小。较矮屏幕为按键提示与控制栏预留空间；按键提示始终位于终端下方。
