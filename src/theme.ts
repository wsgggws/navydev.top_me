// LuZhu.nvim/lua/luzhu/palette.lua：页面与终端动画共用同一色板。
export const luzhu = {
  bg: "#1D3229",
  bgDark: "#182A22",
  bgFloat: "#243B2E",
  bgHighlight: "#293F30",
  fg: "#DCE8D5",
  fgDim: "#AEC0AB",
  border: "#56785D",
  keyword: "#89C79B",
  jade: "#99CEBE",
  bamboo: "#A8C38B",
  gold: "#C5AD78",
  sand: "#D7C5A0",
  blue: "#9BBDB5",
} as const;

export function applyLuZhuTheme(): void {
  for (const [key, color] of Object.entries(luzhu)) {
    const token = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    const channels = color.slice(1).match(/../g)!.map((value) => parseInt(value, 16));
    document.documentElement.style.setProperty(`--luzhu-${token}`, color);
    document.documentElement.style.setProperty(`--luzhu-${token}-rgb`, channels.join(", "));
  }
}
