import { GameObject } from '../interfaces/gameObject';
import { CONFIG } from '../config';

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
    let collisionType: CollisionType | undefined;
    if (obj === target || !target.collides || !obj.collidable) {
      return;
    }
    const objLeft = obj.x;
    const objTop = obj.y;
    const objRight = objLeft + obj.width;

    const targetLeft = target.x;
    const targetTop = target.y;
    const targetBottom = targetTop;
    const targetRight = targetLeft + target.width / 2;
    let diffX = 0;
    const diffY = objTop - targetBottom;
    const overlappedFromRight = targetRight > objLeft && targetLeft < objLeft;
    const overlappedFromLeft = targetLeft < objRight && targetRight > objLeft;
    const overlappedFromBottom = targetBottom < objTop;
    if (
      overlappedFromRight &&
      overlappedFromBottom &&
      Math.abs(targetRight - objLeft) <= CONFIG.MAX_COLLISION_DEPTH
    ) {
      diffX = targetRight - objLeft;
      collisionType = CollisionType.RIGHT;
    }
    if (
      targetRight > objLeft &&
      targetRight < objRight &&
      targetBottom < objTop &&
      Math.abs(objTop - targetBottom) <= CONFIG.MAX_COLLISION_DEPTH
    ) {
      collisionType = CollisionType.BOTTOM;
    }
    if (
      overlappedFromLeft &&
      overlappedFromBottom &&
      Math.abs(objRight - targetLeft) <= CONFIG.MAX_COLLISION_DEPTH
    ) {
      diffX = objRight - targetLeft;
      collisionType = CollisionType.LEFT;
    }

    if (typeof collisionType !== 'undefined') {
      collisions.push({ type: collisionType, diffX, diffY });
    }
  });
  return collisions;
}
