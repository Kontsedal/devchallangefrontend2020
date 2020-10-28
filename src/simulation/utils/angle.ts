import { Position } from '../interfaces/position';

export function denormalizeAngle(
  angle: number,
  isOppositeDirection: boolean
): number {
  return Math.abs(angle - (isOppositeDirection ? 270 : 90));
}

export function getThreePointsAngle(
  A: Position,
  B: Position,
  C: Position
): number {
  const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
  const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
  const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);

  return (
    Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI)
  );
}

export function getOnePointAngle(
  centerPoint: Position,
  point: Position
): number {
  const radians = Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x);
  const angle = (radians * 180) / Math.PI;
  if (angle < 0) {
    return -angle;
  }
  return 360 - angle;
}
