// eslint-disable-next-line no-unused-vars
function memo(cb: (...args: number[]) => number): (arg: number) => number {
  const cache: Record<string, number> = {};
  return (arg: number): number => {
    const cacheKey = arg;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    const result = cb(arg);
    cache[cacheKey] = result;
    return result;
  };
}

export function degreesToRadians(deg: number): number {
  return deg * (Math.PI / 180);
}
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export const cos = memo((degrees: number): number => {
  const newDegrees = Math.floor(degrees);
  return Math.cos(degreesToRadians(newDegrees));
});

export const sin = memo((degrees: number): number => {
  const newDegrees = Math.floor(degrees);
  return Math.sin(degreesToRadians(newDegrees));
});

new Array(360).fill(0).forEach((_, degree: number) => {
  cos(degree);
  sin(degree);
});
