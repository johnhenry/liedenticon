//@flow
export default (h: number, s: number, b: number) => {
  h *= 6;
  const S = [
    (b += s *= b < 0.5 ? b : 1 - b),
    b - (h % 1) * s * 2,
    (b -= s *= 2),
    b,
    b + (h % 1) * s,
    b + s
  ];

  return [
    S[~~h % 6] * 255, // red
    S[(h | 16) % 6] * 255, // green
    S[(h | 8) % 6] * 255 // blue
  ];
};
