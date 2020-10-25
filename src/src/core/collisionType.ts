import { GameObject } from '../interfaces/GameObject.ts';
import { Ground } from '../objects/ground.ts';

export enum CollisionType {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  BOTTOM = 'BOTTOM',
}

export type Collision = {
  type: CollisionType;
  diffX: number;
  diffY: number;
};

export function getCollisions(
  objects: GameObject[],
  target: GameObject
): Collision[] {
  const collisions: Collision[] = [];
  objects.forEach((obj) => {
    let collision: CollisionType;
    if (obj === target || !target.collides || !obj.collidable) {
      return;
    }
    const ol = obj.x;
    const ot = obj.y;
    const ob = ot - obj.height;
    const or = ol + obj.width;

    const tl = target.x;
    const tt = target.y;
    const tb = tt;
    const tr = tl + target.width / 2;
    let diffX = 0;
    const diffY = ot - tb;

    if (tr > ol && tl < ol && tb < ot && Math.abs(tr - ol) <= 10) {
      diffX = tr - ol;
      collision = CollisionType.RIGHT;
    } else if (tr > ol && tr < or && tb < ot && Math.abs(ot - tb) <= 10) {
      collision = CollisionType.BOTTOM;
    } else if (tl < or && tr > ol && tb < ot && Math.abs(or - tl) <= 10) {
      diffX = or - tl;
      collision = CollisionType.LEFT;
    }

    if (collision) {
      collisions.push({ type: collision, diffX, diffY });
    }
  });
  return collisions;
}
