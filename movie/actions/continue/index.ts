import type { SceneModule } from "@movie/types/scene";
import { scene } from "./config";
import script from "./scene.md?raw";
import { desktopAssets, desktopMarkup } from "./desktop";
import { prefersReducedMotion } from "@movie/lib/motion";
import "./styles.css";

function createAction(): SceneModule {
  let root: HTMLElement | null = null;

  return {
    config: scene,
    script,
    async preload() {
      await Promise.all(desktopAssets.map(async (src) => {
        const image = new Image();
        image.src = src;
        await image.decode();
      }));
    },
    create(r) {
      root = r;
      r.innerHTML = `
        <section class="continue-action" aria-label="未完待续，回到桌面">
          ${desktopMarkup()}
          <article class="continue-note" aria-labelledby="continue-title">
            <div class="continue-note__bar" aria-hidden="true">
              <div class="continue-note__traffic"><i></i><i></i><i></i></div>
              <span>下一幕.md</span><span class="continue-note__edit">↗</span>
            </div>
            <div class="continue-note__body">
              <span class="continue-eyebrow">continue</span>
              <h2 id="continue-title">未完待续<span>。</span></h2>
              <p class="continue-copy">下一幕还在写，镜头先停在这里。</p>
              <nav class="continue-links" aria-label="片尾链接">
                <a href="https://github.com/wsgggws" target="_blank" rel="noreferrer">
                  <small>片尾之后</small><strong>GitHub <span>↗</span></strong>
                </a>
                <a href="https://navydev.top/">
                  <small>回到主页</small><strong>navydev.top <span>↗</span></strong>
                </a>
              </nav>
              <div class="continue-note__footer"><span>写到这里，先去生活。</span><span>to be continued</span></div>
            </div>
          </article>
        </section>
      `;
    },
    play(timeline) {
      if (!root) return;
      const reduced = prefersReducedMotion();
      timeline.fromTo(root.querySelector(".continue-eyebrow"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.1);
      timeline.fromTo(root.querySelector("h2"), { opacity: 0, scale: reduced ? 1 : 0.97 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, 0.2);
      timeline.fromTo(root.querySelector(".continue-copy"), { opacity: 0, y: reduced ? 0 : 8 }, { opacity: 1, y: 0, duration: 0.7 }, 0.8);
      timeline.fromTo(root.querySelector(".continue-links"), { opacity: 0, y: reduced ? 0 : 8 }, { opacity: 1, y: 0, duration: 0.8 }, 1.4);
      timeline.fromTo(root.querySelector(".desktop-wallpaper"), { opacity: 0, scale: reduced ? 1 : 1.08 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 2.8);
      timeline.fromTo(root.querySelector(".continue-note"), { "--note-surface": 0, scale: reduced ? 1 : 1.08 }, { "--note-surface": 1, scale: 1, duration: 1.2, ease: "power2.inOut" }, 2.8);
      timeline.fromTo(root.querySelectorAll(".continue-note__bar, .continue-note__footer"), { opacity: 0 }, { opacity: 1, duration: 0.9 }, 3.2);
      timeline.fromTo(root.querySelector(".desktop-menubar"), { opacity: 0, y: reduced ? 0 : -16 }, { opacity: 1, y: 0, duration: 0.8 }, 3.5);
      timeline.fromTo(root.querySelectorAll(".desktop-file"), { opacity: 0, y: reduced ? 0 : 12 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.8 }, 3.8);
      timeline.fromTo(root.querySelector(".desktop-dock"), { opacity: 0, y: reduced ? 0 : 28 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 4.2);
      timeline.fromTo(root.querySelector(".desktop-terminal"), { opacity: 0, y: reduced ? 0 : 12 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 4.7);
      const command = root.querySelector(".desktop-terminal__command > span");
      const text = "brew upgrade";
      if (reduced) {
        timeline.set(command, { textContent: text }, 5.4);
      } else {
        Array.from(text).forEach((_, index) => {
          timeline.set(command, { textContent: text.slice(0, index + 1) }, 5.4 + index * 0.065);
        });
      }
      timeline.set(root.querySelector(".desktop-terminal__command > i"), { opacity: 0 }, 6.4);
      timeline.fromTo(root.querySelector(".desktop-terminal__intro"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 6.4);
      timeline.fromTo(root.querySelectorAll(".desktop-terminal__package"), { opacity: 0, y: reduced ? 0 : 4 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.12 }, 6.8);
      timeline.fromTo(root.querySelectorAll(".desktop-terminal__done, .desktop-terminal__status > span:last-child"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 8.3);
      timeline.fromTo(root.querySelector(".desktop-terminal__ready"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 8.8);
    },
    pause() {},
    destroy() { root = null; },
  };
}

export default createAction();
