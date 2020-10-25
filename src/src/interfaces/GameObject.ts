import { Collision } from '../core/collisionType.ts';

export interface GameObject {
  update: (collisions: Collision[]) => void;
  render: () => void;
  x: number;
  y: number;
  width: number;
  height: number;
  collidable: boolean;
  collides: boolean;
}
