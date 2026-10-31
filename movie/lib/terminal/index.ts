import { prefersReducedMotion } from "../motion";
import "./styles.css";

export function terminalChrome(title: string): string {
  return `<div class="terminal-chrome"><span class="terminal-lights" aria-hidden="true"><i></i><i></i><i></i></span><span>${title}</span><span class="terminal-chrome__shell">zsh</span></div>`;
}

/** 文本变化由主时间线驱动，暂停、重播与切章共用同一个时钟。 */
export function typeText(timeline: ReturnType<typeof import("gsap").gsap.timeline>, element: HTMLElement, text: string, at: number, duration: number, onUpdate?: () => void): void {
  timeline.call(() => { element.textContent = ""; }, [], at);
  if (prefersReducedMotion()) {
    timeline.call(() => { element.textContent = text; onUpdate?.(); }, [], at + duration);
    return;
  }
  const cursor = { length: 0 };
  timeline.fromTo(cursor, { length: 0 }, {
    length: text.length,
    duration,
    ease: "none",
    onUpdate: () => { element.textContent = text.slice(0, Math.floor(cursor.length)); onUpdate?.(); },
    onComplete: () => { element.textContent = text; onUpdate?.(); },
  }, at);
}
