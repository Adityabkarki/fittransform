// [cx, cy, rx, ry] ellipse coordinates in the 100×198 SVG viewBox
export const SHAPES_F: Record<string, [number, number, number, number][]> = {
  delts: [[33, 43, 6, 5], [67, 43, 6, 5]],
  chest: [[43, 52, 7, 5.5], [57, 52, 7, 5.5]],
  biceps: [[29.5, 61, 3.8, 7], [70.5, 61, 3.8, 7]],
  forearms: [[26, 79, 3.2, 8], [74, 79, 3.2, 8]],
  abs: [[50, 70, 6.5, 12]],
  obliques: [[41, 72, 3, 8], [59, 72, 3, 8]],
  quads: [[43.5, 114, 5.5, 17], [56.5, 114, 5.5, 17]],
  calves: [[43, 162, 4, 11], [57, 162, 4, 11]],
};

export const SHAPES_B: Record<string, [number, number, number, number][]> = {
  traps: [[50, 42, 11, 6]],
  rearDelts: [[33, 45, 5.5, 4.5], [67, 45, 5.5, 4.5]],
  lats: [[42, 62, 5.5, 11], [58, 62, 5.5, 11]],
  triceps: [[29.5, 61, 3.8, 7], [70.5, 61, 3.8, 7]],
  lowerback: [[50, 80, 6, 6]],
  glutes: [[44, 94, 6, 6.5], [56, 94, 6, 6.5]],
  hamstrings: [[43.5, 118, 5.5, 15], [56.5, 118, 5.5, 15]],
  calves: [[43, 158, 4.5, 12], [57, 158, 4.5, 12]],
  forearms: [[26, 79, 3.2, 8], [74, 79, 3.2, 8]],
};

export const BODY_PATH =
  "M41,33 Q50,28 59,33 L67,38 L73,50 L76,92 L69,93 L66,60 L65,90 L62,96 L62,140 L64,190 L53,190 L51,132 L49,132 L47,190 L36,190 L38,140 L38,96 L35,90 L34,60 L31,93 L24,92 L27,50 Z";
