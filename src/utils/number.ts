export const asPercent = (score: number) => {
  const places = score % 1 === 0 ? 0 : (score * 10) % 1 === 0 ? 1 : 2;
  return `${score.toFixed(places)}%`;
};
