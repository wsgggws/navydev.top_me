import type { SceneModule } from "@movie/types/scene";
import { scene } from "./config";
import script from "./scene.md?raw";
import "./styles.css";

const TOOLKIT = [
  { label: "编辑与终端", title: "Neovim / Tmux", tools: ["LuZhu", "Linux"], detail: "熟悉的键位，专注的工作台。" },
  { label: "思考与协作", title: "Codex / Git", tools: ["GitHub", "Code Review"], detail: "一起推敲，让每次改动有迹可循。" },
  { label: "编码与数据", title: "Python / Go", tools: ["PostgreSQL", "Redis"], detail: "把想法写成清楚、可靠的实现。" },
  { label: "运行与交付", title: "Docker / Nginx", tools: ["Kubernetes", "GitHub Actions"], detail: "从本地验证，到持续交付。" },
];

function createScene(): SceneModule {
  let root: HTMLElement | null = null;

  return {
    config: scene,
    script,
    async preload() {},
    create(r) {
      root = r;
      r.innerHTML = `
        <header class="tools-heading"><span>MY TOOLKIT</span><h2>手边的工具</h2><p>从一行代码，到一次交付。</p></header>
        <div class="tools-grid"></div>
        <p class="tools-coda">把重复交给工具，把心思留给创造。</p>
      `;
      const grid = r.querySelector(".tools-grid")!;
      TOOLKIT.forEach(({ label, title, tools, detail }, index) => {
        const card = document.createElement("section");
        card.className = "tool-card";
        card.innerHTML = `
          <div class="tool-card__label"><span>0${index + 1}</span>${label}</div>
          <h3>${title}</h3>
          <div class="tool-card__tags">${tools.map((tool) => `<span>${tool}</span>`).join("")}</div>
          <p>${detail}</p>
        `;
        grid.appendChild(card);
      });
    },
    play(timeline) {
      if (!root) return;
      const cards = Array.from(root.querySelectorAll(".tool-card"));
      timeline.fromTo(root.querySelector(".tools-heading"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3);
      cards.forEach((card, index) => {
        timeline.fromTo(card, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 1.3 + index * 1.5);
      });
      timeline.fromTo(root.querySelector(".tools-coda"), { opacity: 0 }, { opacity: 1, duration: 1 }, 8);
    },
    pause() {},
    destroy() { root = null; },
  };
}

export default createScene();
