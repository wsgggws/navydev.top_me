export interface TerminalLine {
  text: string;
  at: number;
  tone?: "command" | "success" | "muted" | "add" | "user" | "code" | "accent";
}
export interface Pane {
  title: string;
  editor?: string;
  prompt?: string;
  lines: TerminalLine[];
}
export interface WorkspaceWindow {
  name: string;
  layout: "single" | "split" | "quad";
  at: number;
  panes: Pane[];
}

// 时间相对于窗口进入时刻。所有内容均为演示，不连接终端或执行命令。
export const ATTACH_AT = 5.35;
export const WINDOWS: WorkspaceWindow[] = [
  { name: "zsh", layout: "single", at: 0, panes: [{ title: "zsh · ~/github", lines: [
    { at: 0.1, tone: "accent", text: "代码爱干净，码码要洗手" },
    { at: 0.5, tone: "command", text: "whoami" },
    { at: 0.95, text: "navy / software engineer" },
    { at: 1.3, tone: "command", text: "j top_me" },
    { at: 1.8, text: "~/github/navydev.top_me" },
    { at: 2.15, tone: "command", text: "ls fun/" },
    { at: 2.6, text: "reading/  running/  history/" },
    { at: 2.95, tone: "command", text: "tmux bind-key l next-window" },
    { at: 3.55, tone: "success", text: "✓ prefix + l → next-window" },
    { at: 4.2, tone: "command", text: "tmux attach" },
    { at: 4.9, tone: "muted", text: "attached to navy:work" },
  ] }] },
  { name: "nvim", layout: "split", at: 6.4, panes: [
    { title: "nvim · api/app.py", editor: "app.py · Python", lines: [
      "from typing import TypedDict", "", "class Health(TypedDict):", "    status: str", "", "def health() -> Health:", '    return {"status": "ok"}',
    ].map((text, index) => ({ text, at: 0.25 + index * 0.3, tone: "code" })) },
    { title: "nvim · api/health.go", editor: "health.go · Go", lines: [
      "package api", "", "type Health struct {", '    Status string `json:"status"`', "}", "", "func Check() Health {", '    return Health{Status: "ok"}', "}",
    ].map((text, index) => ({ text, at: 0.35 + index * 0.3, tone: "code" })) },
  ] },
  { name: "git", layout: "single", at: 11.2, panes: [{ title: "git · ~/github/navydev.top_me", lines: [
    { at: 0.2, tone: "command", text: "gst" },
    { at: 0.7, tone: "add", text: " M api/app.py\n M api/health.go" },
    { at: 1.25, tone: "command", text: "gcb feat/app" },
    { at: 1.85, text: "Switched to a new branch 'feat/app'" },
    { at: 2.4, tone: "command", text: "gd" },
    { at: 2.9, tone: "muted", text: 'diff --git a/api/app.py b/api/app.py\n+    return {"status": "ok"}\ndiff --git a/api/health.go b/api/health.go\n+    return Health{Status: "ok"}' },
    { at: 3.45, tone: "command", text: "make test" },
    { at: 4.1, text: "pytest -q · go test ./..." },
    { at: 4.7, tone: "success", text: "✓ Python: 4 passed · Go: 4 passed" },
    { at: 5.25, tone: "command", text: "ga ." },
    { at: 5.75, tone: "muted", text: "2 files staged" },
    { at: 6.25, tone: "command", text: 'gc -m"feat(app): add app.py and health.go"' },
    { at: 7.15, text: "pre-commit · running hooks" },
    { at: 7.7, tone: "success", text: "ruff lint ................. Passed" },
    { at: 8.2, tone: "success", text: "ruff format · gofmt ........ Passed" },
    { at: 8.7, tone: "success", text: "go vet · tests ............ Passed" },
    { at: 9.3, text: "[feat/app 8ac31d2] feat(app): add app.py and health.go" },
    { at: 9.9, tone: "command", text: "gl origin main --rebase" },
    { at: 10.6, tone: "muted", text: "From github.com:wsgggws/navydev.top_me" },
    { at: 11.15, tone: "success", text: "Successfully rebased and updated feat/app." },
    { at: 11.85, tone: "command", text: "gp origin feat/app" },
    { at: 12.5, text: "[new branch] feat/app -> feat/app" },
    { at: 13, tone: "success", text: "Create a pull request:" },
    { at: 13.4, tone: "accent", text: "https://github.com/wsgggws/navydev.top_me/pull/new/feat/app" },
  ] }] },
  { name: "ops", layout: "quad", at: 26.5, panes: [
    { title: "api · live logs", lines: [
      { at: 0.15, tone: "command", text: "docker logs -f api" },
      { at: 0.9, tone: "muted", text: "INFO server ready :8000" },
      { at: 2.15, text: "GET /health       200" },
      { at: 4.15, tone: "success", text: "GET /api/orders   200" },
    ] },
    { title: "MySQL · app", prompt: "mysql>", lines: [
      { at: 0.3, tone: "command", text: "SELECT id, status\nFROM orders LIMIT 2;" },
      { at: 1.2, tone: "muted", text: "id  status" },
      { at: 1.7, text: "42  paid\n43  pending" },
      { at: 2.3, tone: "success", text: "2 rows in set (0.01s)" },
      { at: 3.6, tone: "command", text: "SELECT COUNT(*)\nFROM orders;" },
      { at: 4.5, text: "COUNT(*)\n128" },
      { at: 5, tone: "success", text: "1 row in set (0.00s)" },
    ] },
    { title: "curl · requests", lines: [
      { at: 1.1, tone: "command", text: "curl -i localhost:8000/health" },
      { at: 2.1, tone: "success", text: "HTTP/1.1 200 OK" },
      { at: 2.45, text: '{"status":"ok"}' },
      { at: 3.1, tone: "command", text: "curl localhost:8000/api/orders" },
      { at: 4.1, text: '[{"id":42,"status":"paid"}]' },
    ] },
    { title: "Redis · cache", prompt: "redis>", lines: [
      { at: 0.5, tone: "command", text: "PING" },
      { at: 1, tone: "success", text: "PONG" },
      { at: 1.65, tone: "command", text: "SET health:api ok EX 60" },
      { at: 2.4, tone: "success", text: "OK" },
      { at: 3.2, tone: "command", text: "GET health:api" },
      { at: 3.8, text: '"ok"' },
      { at: 4.5, tone: "command", text: "TTL health:api" },
      { at: 5.1, text: "(integer) 57" },
    ] },
  ] },
  { name: "AI", layout: "split", at: 34, panes: [
    { title: "claude · review", lines: [
      { at: 0.1, tone: "command", text: "claude" },
      { at: 0.7, tone: "accent", text: "Claude Code" },
      { at: 1.1, tone: "user", text: "检查健康接口的实现和边界情况。" },
      { at: 2.3, tone: "muted", text: "Reading app.py, health.go…" },
      { at: 3.1, text: "• 返回结构一致\n• 状态字段使用明确类型" },
      { at: 4.1, text: "建议增加响应状态码断言。" },
      { at: 5.4, tone: "success", text: "✓ Review complete" },
    ] },
    { title: "codex · tests", lines: [
      { at: 0.2, tone: "command", text: "codex" },
      { at: 0.8, tone: "accent", text: "OpenAI Codex" },
      { at: 1.3, tone: "user", text: "补充状态码断言，运行 make test。" },
      { at: 2.6, tone: "add", text: "+ test_health.py\n+ health_test.go" },
      { at: 3.5, tone: "command", text: "make test" },
      { at: 4.4, tone: "success", text: "✓ Python: 4 passed\n✓ Go: 4 passed" },
      { at: 5.6, text: "断言已补充，全部测试通过。" },
      { at: 6.5, tone: "muted", text: "ready for review" },
    ] },
  ] },
];
