import { gsap } from "gsap";
import { getScenePlaybackRate } from "../pacing";
import type { SceneConfig } from "../types/scene";

/**
 * Title card overlay shown briefly when a new scene enters.
 * Pure DOM + GSAP — respects Director's pause/play via the timeline.
 */
export interface TitleCardHandle {
  show(config: SceneConfig, chapterLabel?: string): void;
  hide(): void;
  dispose(): void;
}

export function mountTitleCard(host: HTMLElement): TitleCardHandle {
  const card = document.createElement("div");
  card.className = "title-card";
  card.setAttribute("aria-hidden", "true");
  card.innerHTML = `
    <div class="title-card__chapter"></div>
    <div class="title-card__title"></div>
    <div class="title-card__caption"></div>
    <div class="title-card__rule"></div>
  `;
  host.appendChild(card);

  const chapterEl = card.querySelector(".title-card__chapter") as HTMLElement;
  const titleEl = card.querySelector(".title-card__title") as HTMLElement;
  const captionEl = card.querySelector(".title-card__caption") as HTMLElement;

  return {
    show(config: SceneConfig, chapterLabel?: string) {
      gsap.killTweensOf([card, chapterEl, titleEl, captionEl]);
      card.removeAttribute("aria-hidden");
      card.className = [
        "title-card",
        `title-card--${config.titleCard ?? "chapter-card"}`,
        `title-card--mood-${config.mood}`,
        `title-card--pace-${config.pacing}`,
      ].join(" ");
      chapterEl.textContent = chapterLabel ?? config.id.toUpperCase().replace(/-/g, " · ");
      titleEl.textContent = config.title;
      captionEl.textContent = config.caption ?? "";
      captionEl.hidden = !config.caption;

      const playbackRate = getScenePlaybackRate(config);
      const hold =
        config.pacing === "hold" || config.titleCard === "silent-card"
          ? 0.8
          : config.pacing === "staccato"
            ? 0.32
            : 0.48;
      const enterY = config.titleCard === "terminal-caption" ? 0 : 16;

      // GSAP overload resolution on fromTo loses element inference in strict mode.
      // Casting through `any` keeps the runtime behaviour identical.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = gsap;
      g.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.28 / playbackRate, ease: "power2.out" });
      g.fromTo(
        titleEl,
        { y: enterY, scale: 1 },
        { y: 0, scale: 1, duration: 0.65 / playbackRate, ease: "power3.out" },
        "<",
      );
      g.fromTo(captionEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.48 / playbackRate, delay: 0.1 / playbackRate }, "<");
      g.to(card, {
        opacity: 0,
        duration: 0.3 / playbackRate,
        delay: hold / playbackRate,
        ease: "power2.in",
        onComplete: () => card.setAttribute("aria-hidden", "true"),
      });
    },
    hide() {
      gsap.killTweensOf([card, chapterEl, titleEl, captionEl]);
      gsap.set(card, { opacity: 0 });
      card.setAttribute("aria-hidden", "true");
    },
    dispose() {
      gsap.killTweensOf(card);
      card.remove();
    },
  };
}

/** Re-exported for type imports of scene config across the lib boundary. */
export type { SceneConfig };
