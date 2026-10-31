# 工作现场

同一个 WezTerm / Tmux 工作流，按顺序展示五个窗口：

- 0:zsh：欢迎语“代码爱干净，码码要洗手”，输入 whoami、j top_me、ls fun/、tmux bind-key l next-window、tmux attach。进入 navydev.top_me 项目，attach 后显示全部窗口标签。
- 1:nvim：保留原有 Python / Go 健康接口的左右双 pane 编辑动画。
- 2:git：依次输入 gst、gcb feat/app、gd、make test、ga .、gc 提交、gl origin main --rebase、gp origin feat/app；显示 diff、全部测试通过、pre-commit lint / format / vet 检查、rebase 成功及创建 PR 的链接。
- 3:ops：左上 docker logs -f api，左下 curl 请求；右上 MySQL 查询，右下 Redis 缓存操作。请求发出后日志同步显示成功响应。
- 4:AI：左侧 Claude 对 diff 做 code review，重点检查正确性、边界情况与测试覆盖，只报告有依据的问题，右侧 Codex 补充测试并运行 make test。

切换前展示 Ctrl+B，松开后按 L。演示中的 next-window 绑定使快捷键与窗口顺序一致。所有命令和交互输入都展示逐字输入，输出及时跟随滚动；暂停、重播、跳章共用 GSAP 时间线。

窗口、pane、输出与时间点由 workspace.ts 维护。所有内容为预设动画，不连接终端、数据库或 AI 服务，不创建真实分支、提交或 PR。

PC 终端宽度为舞台的 84%、高度 86%；竖屏宽度占满舞台，高度 76%，上下保留留白，按键提示位于终端下方。
