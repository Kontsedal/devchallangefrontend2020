function memo<T extends Function>(cb: T): ReturnType<T> {
  const cache: Record<string, ReturnType<T>> = {};
  return (...args: Parameters<T>[]) => {
    const cacheKey = JSON.stringify(args);
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    const result = cb(...args);
    cache[cacheKey] = result;
    return result;
  };
}

function degreesToRadians(deg: number): number {
  return deg * (Math.PI / 180);
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
