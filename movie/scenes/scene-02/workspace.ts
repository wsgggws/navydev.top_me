export interface TerminalLine {
  text: string;
  at: number;
  tone?: "command" | "success" | "muted" | "add" | "user" | "code" | "accent";
}
export interface Pane {
  title: string;
  editor?: string;
  lines: TerminalLine[];
}
export interface WorkspaceWindow {
  name: string;
  layout: "single" | "split" | "quad";
  at: number;
  panes: Pane[];
}

// 演示数据；所有时间相对于所在窗口进入时刻，不连接真实终端。
export const WINDOWS: WorkspaceWindow[] = [
  { name: "git", layout: "single", at: 0, panes: [{ title: "~/workspace/api · main", lines: [
    { at: 0.2, tone: "command", text: "tmux bind-key l next-window" },
    { at: 0.85, tone: "muted", text: "prefix + l → next-window" },
    { at: 1.1, tone: "command", text: "git status --short" },
    { at: 1.7, tone: "add", text: " M api/app.py" },
    { at: 1.9, tone: "add", text: " M api/health.go" },
    { at: 2.2, tone: "command", text: "git diff --stat" },
    { at: 2.85, text: "2 files changed, 18 insertions(+)" },
    { at: 3.2, tone: "command", text: "git diff --check" },
    { at: 3.85, tone: "success", text: "✓ clean diff · exit 0" },
  ] }] },
  { name: "nvim", layout: "split", at: 4.6, panes: [
    { title: "nvim · api/app.py", editor: "app.py · Python", lines: [
      "from typing import TypedDict", "", "class Health(TypedDict):", "    status: str", "", "def health() -> Health:", '    return {"status": "ok"}',
    ].map((text, index) => ({ text, at: 0.25 + index * 0.3, tone: "code" })) },
    { title: "nvim · api/health.go", editor: "health.go · Go", lines: [
      "package api", "", "type Health struct {", '    Status string `json:"status"`', "}", "", "func Check() Health {", '    return Health{Status: "ok"}', "}",
    ].map((text, index) => ({ text, at: 0.35 + index * 0.3, tone: "code" })) },
  ] },
  { name: "ops", layout: "quad", at: 10.4, panes: [
    { title: "docker · services", lines: [
      { at: 0.2, tone: "command", text: "docker ps" },
      { at: 1, tone: "muted", text: "NAME   IMAGE      STATUS" },
      { at: 1.3, tone: "success", text: "api    api:dev    Up 2m" },
      { at: 1.6, tone: "success", text: "redis  redis:7    Up 2m" },
      { at: 1.9, tone: "success", text: "db     postgres   Up 2m" },
    ] },
    { title: "make · tests", lines: [
      { at: 0.3, tone: "command", text: "make test" },
      { at: 1, tone: "muted", text: "pytest -q" },
      { at: 1.8, text: "....             [100%]" },
      { at: 2.5, tone: "success", text: "4 passed in 0.18s" },
      { at: 3, tone: "muted", text: "go test ./..." },
      { at: 4, text: "ok api/health 0.024s" },
      { at: 4.9, tone: "success", text: "PASS · 8/8 tests" },
    ] },
    { title: "app · live logs", lines: [
      { at: 0.4, tone: "command", text: "docker logs -f api" },
      { at: 1.2, text: "INFO  server ready :8000" },
      { at: 2.2, text: "GET /health       200" },
      { at: 3.2, text: "GET /api/orders   200" },
      { at: 4.2, tone: "success", text: "GET /health       200" },
    ] },
    { title: "checks · quality", lines: [
      { at: 0.5, tone: "command", text: "make check" },
      { at: 1.4, tone: "muted", text: "ruff check ." },
      { at: 2.5, tone: "success", text: "All checks passed!" },
      { at: 3.3, tone: "muted", text: "go vet ./..." },
      { at: 4.9, tone: "success", text: "✓ vet · exit 0" },
    ] },
  ] },
  { name: "codex", layout: "single", at: 17.4, panes: [{ title: "codex · ~/workspace/api", lines: [
    { at: 0.1, tone: "accent", text: "OpenAI Codex" },
    { at: 0.4, tone: "muted", text: "~/workspace/api · workspace-write" },
    { at: 0.8, tone: "user", text: "为 /health 补充测试，并运行 make test。" },
    { at: 2.1, tone: "muted", text: "• Reading app.py and health.go" },
    { at: 2.9, tone: "add", text: "+ tests/test_health.py" },
    { at: 3.4, tone: "add", text: "+ health_test.go" },
    { at: 4, tone: "command", text: "make test" },
    { at: 4.9, tone: "success", text: "✓ Python: 4 passed · Go: 4 passed" },
    { at: 5.6, text: "健康检查覆盖就绪，全部测试通过。" },
    { at: 6.5, tone: "muted", text: "diff: +24 / -0 · ready for review" },
  ] }] },
];
