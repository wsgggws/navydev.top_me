export interface TerminalLine {
  text: string;
  at: number;
  tone?: "command" | "success" | "muted" | "add" | "user" | "accent";
}
export interface Pane {
  title: string;
  prompt?: string;
  lines: TerminalLine[];
}
export interface WorkspaceWindow {
  name: string;
  layout: "single" | "split" | "quad";
  at: number;
  demo?: "nvim";
  panes: Pane[];
}

// 时间相对于窗口进入时刻。所有内容均为演示，不连接终端或执行命令。
export const ATTACH_AT = 3.32;
export const WINDOWS: WorkspaceWindow[] = [
  { name: "zsh", layout: "single", at: 0, panes: [{ title: "zsh · ~/github", lines: [
    { at: 0.1, tone: "accent", text: "代码爱干净，码码要洗手" },
    { at: 0.5, tone: "command", text: "whoami" },
    { at: 0.82, text: "navy / software engineer" },
    { at: 1.3, tone: "command", text: "j top_me" },
    { at: 1.62, text: "~/github/navydev.top_me" },
    { at: 2.15, tone: "command", text: "ls fun/" },
    { at: 2.47, text: "reading/  running/  history/" },
    { at: 2.95, tone: "command", text: "tmux" },
    { at: 3.27, tone: "success", text: "✓ restored session navy:work · 5 windows" },
  ] }] },
  { name: "nvim", layout: "single", at: 5, demo: "nvim", panes: [{ title: "nvim · Python", lines: [] }] },
  { name: "git", layout: "single", at: 17.9, panes: [{ title: "git · ~/github/navydev.top_me", lines: [
    { at: 0.2, tone: "command", text: "gst" },
    { at: 0.52, tone: "add", text: " M api.py\n M tests/test_api.py" },
    { at: 1.25, tone: "command", text: "gcb feat/app" },
    { at: 1.57, text: "Switched to a new branch 'feat/app'" },
    { at: 2.4, tone: "command", text: "gd" },
    { at: 2.72, tone: "muted", text: 'diff --git a/api.py b/api.py\n-    return {"status": "starting"}\n+    return {"status": "ok"}\ndiff --git a/tests/test_api.py b/tests/test_api.py\n+    assert health()["status"] == "ok"' },
    { at: 3.45, tone: "command", text: "make test" },
    { at: 3.77, text: "pytest -q" },
    { at: 4.7, tone: "success", text: "✓ Python: 4 passed" },
    { at: 5.25, tone: "command", text: "ga ." },
    { at: 5.57, tone: "muted", text: "2 files staged" },
    { at: 6.25, tone: "command", text: 'gc -m"feat(app): update api.py and add Python tests"' },
    { at: 6.99, text: "pre-commit · running hooks" },
    { at: 7.7, tone: "success", text: "ruff lint ................. Passed" },
    { at: 8.2, tone: "success", text: "ruff format ............... Passed" },
    { at: 8.7, tone: "success", text: "pytest .................... Passed" },
    { at: 9.3, text: "[feat/app 8ac31d2] feat(app): update api.py and add Python tests" },
    { at: 9.9, tone: "command", text: "gl origin main --rebase" },
    { at: 10.31, tone: "muted", text: "From github.com:wsgggws/navydev.top_me" },
    { at: 11.15, tone: "success", text: "Successfully rebased and updated feat/app." },
    { at: 11.85, tone: "command", text: "gp origin feat/app" },
    { at: 12.18, text: "[new branch] feat/app -> feat/app" },
    { at: 13, tone: "success", text: "Create a pull request:" },
    { at: 13.4, tone: "accent", text: "https://github.com/wsgggws/navydev.top_me/pull/new/feat/app" },
  ] }] },
  { name: "ops", layout: "quad", at: 33.2, panes: [
    { title: "api · live logs", lines: [
      { at: 0.15, tone: "command", text: "docker logs -f api" },
      { at: 0.48, tone: "muted", text: "INFO server ready :8000" },
      { at: 1.68, text: "GET /health       200" },
      { at: 3.66, tone: "success", text: "GET /api/orders   200" },
    ] },
    { title: "MySQL · app", prompt: "mysql>", lines: [
      { at: 0.3, tone: "command", text: "SELECT id, status\nFROM orders LIMIT 2;" },
      { at: 0.95, tone: "muted", text: "id  status" },
      { at: 1.1, text: "42  paid\n43  pending" },
      { at: 1.3, tone: "success", text: "2 rows in set (0.01s)" },
      { at: 3.6, tone: "command", text: "SELECT COUNT(*)\nFROM orders;" },
      { at: 4.09, text: "COUNT(*)\n128" },
      { at: 5, tone: "success", text: "1 row in set (0.00s)" },
    ] },
    { title: "curl · requests", lines: [
      { at: 1.1, tone: "command", text: "curl -i localhost:8000/health" },
      { at: 1.6, tone: "success", text: "HTTP/1.1 200 OK" },
      { at: 1.8, text: '{"status":"ok"}' },
      { at: 3.1, tone: "command", text: "curl localhost:8000/api/orders" },
      { at: 3.62, text: '[{"id":42,"status":"paid"}]' },
    ] },
    { title: "Redis · cache", prompt: "redis>", lines: [
      { at: 0.5, tone: "command", text: "PING" },
      { at: 0.82, tone: "success", text: "PONG" },
      { at: 1.65, tone: "command", text: "SET health:api ok EX 60" },
      { at: 2.06, tone: "success", text: "OK" },
      { at: 3.2, tone: "command", text: "GET health:api" },
      { at: 3.52, text: '"ok"' },
      { at: 4.5, tone: "command", text: "TTL health:api" },
      { at: 4.82, text: "(integer) 57" },
    ] },
  ] },
  { name: "AI", layout: "split", at: 40.7, panes: [
    { title: "claude · review", lines: [
      { at: 0.1, tone: "command", text: "claude" },
      { at: 0.42, tone: "accent", text: "Claude Code" },
      { at: 1.1, tone: "user", text: "对本次 diff 做 code review，重点检查正确性、边界情况和测试覆盖，只报告有依据的问题。" },
      { at: 2.14, tone: "muted", text: "Reviewing api.py · tests/test_api.py…" },
      { at: 3.1, text: "• 正确性与边界情况已检查\n• 测试覆盖缺少状态码断言" },
      { at: 3.62, text: "Review 建议：补充状态码断言。" },
      { at: 5.4, tone: "success", text: "✓ Review complete" },
    ] },
    { title: "codex · tests", lines: [
      { at: 0.2, tone: "command", text: "codex" },
      { at: 0.52, tone: "accent", text: "OpenAI Codex" },
      { at: 1.3, tone: "user", text: "补充状态码断言，运行 make test。" },
      { at: 2.34, tone: "add", text: "+ tests/test_api.py" },
      { at: 3.5, tone: "command", text: "make test" },
      { at: 3.82, tone: "success", text: "✓ Python: 4 passed" },
      { at: 5.6, text: "断言已补充，全部测试通过。" },
      { at: 6.5, tone: "muted", text: "ready for review" },
    ] },
  ] },
];
