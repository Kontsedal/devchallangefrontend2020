export enum CollisionType {
  RIGHT,
  LEFT,
  BOTTOM,
}

export type Collision = {
  type: CollisionType;
  diffX: number;
  diffY: number;
};
