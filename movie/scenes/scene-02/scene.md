# 工作现场

WezTerm 里运行一个 Tmux session。底部状态栏始终显示四个窗口：

1. git：单 pane，检查改动与 diff。先执行 `tmux bind-key l next-window`，让后续按键与真实 Tmux 行为一致。
2. nvim：左右两个 pane，分别编写 Python 与 Go 的健康检查。
3. ops：四个 pane 同时运行 docker ps、make test、应用日志、代码检查；容器正常运行，Python / Go 测试全部通过。
4. codex：单 pane，提出补充测试的请求，展示读取、改动和 make test 通过的对话。

每次切换前，Ctrl 与 B 键帽先压下，松开后 L 键帽压下，再切换到下一个窗口。所有状态变化和文本输入都由场景时间线驱动，暂停与重播保持一致。

这是预设动画演示，不连接服务器终端，不执行真实命令。窗口内容、分屏与时间点集中在 workspace.ts。
