export const variance = (arr: number[]) => {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const variance =
    arr.reduce((acc, val) => acc + (val - mean) ** 2, 0) / arr.length;
  return variance;
};
