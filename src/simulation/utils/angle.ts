export function denormalizeAngle(angle: number, isOpposite: boolean): number {
  return Math.abs(angle - (isOpposite ? 270 : 90));
}
