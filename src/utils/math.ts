import { Position } from '../simulation/interfaces/position';
import { pipe } from './function';

function memo(
  cb: (num: number) => number,
  precision: number
): (arg: number) => number {
  const cache: Record<string, number> = {};
  return (arg: number): number => {
    const value = Number(arg.toFixed(precision));
    const cacheKey = value;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    const result = cb(value);
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

export const cos = memo(pipe(degreesToRadians, Math.cos), 0);
export const sin = memo(pipe(degreesToRadians, Math.sin), 0);
export const atan = memo(Math.atan, 2);

export function denormalizeAngle(angle: number, initialAngle?: number): number {
  let result = 90 - angle;
  if (
    initialAngle &&
    initialAngle > 90 &&
    initialAngle < 270 &&
    initialAngle !== angle
  ) {
    result += 180;
  }
  if (result < 0) {
    result = 360 + result;
  }
  return result % 360;
}

export function getOnePointAngle(
  centerPoint: Position,
  point: Position
): number {
  const radians = Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x);
  const angle = radiansToDegrees(radians);
  if (angle < 0) {
    return -angle;
  }
  return 360 - angle;
}

export function normalizeAngle(angle: number) {
  let result = angle;
  if (angle < 0) {
    result = 360 + angle;
  }
  return result % 360;
}

/**
 * Generate cache for frequently used functions
 */
new Array(360).fill(0).forEach((_, degree: number) => {
  cos(degree);
  sin(degree);
});

new Array(400).fill(0).forEach((_, index: number) => {
  atan(index * 0.01 - 2);
});
