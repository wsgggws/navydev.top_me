import type { SceneModule } from "@movie/types/scene";
import { scene } from "./config";
import script from "./scene.md?raw";
import "./styles.css";

function createAction(): SceneModule {
  let root: HTMLElement | null = null;

  return {
    config: scene,
    script,
    async preload() {},
    create(r) {
      root = r;
      r.innerHTML = `
        <section class="continue-action">
          <span>continue</span>
          <h2>未完待续</h2>
          <p class="continue-copy">下一幕还在写，镜头先停在这里。</p>
          <nav class="continue-links" aria-label="片尾链接">
            <a href="https://github.com/wsgggws" target="_blank" rel="noreferrer">
              <small>片尾之后</small><strong>GitHub ↗</strong>
            </a>
            <a href="https://navydev.top/">
              <small>回到主页</small><strong>navydev.top ↗</strong>
            </a>
          </nav>
        </section>
      `;
    },
    play(timeline) {
      if (!root) return;
      timeline.fromTo(root.querySelector(".continue-action > span"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.1);
      timeline.fromTo(root.querySelector("h2"), { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, 0.2);
      timeline.fromTo(root.querySelector(".continue-copy"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7 }, 0.8);
      timeline.fromTo(root.querySelector(".continue-links"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8 }, 1.4);
    },
    pause() {},
    destroy() { root = null; },
  };
}

export default createAction();
