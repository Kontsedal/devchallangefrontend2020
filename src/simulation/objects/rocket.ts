import { GameObject } from '../interfaces/gameObject';
import { RenderContext } from '../core/renderContext';
import { cos, degreesToRadians, radiansToDegrees, sin } from '../core/math';
import rocketImageSrc from '../../assets/rocket.png';
import { Collision, CollisionType } from '../core/collision';
import { CONFIG } from '../../config';
import { AssetsManager } from '../core/assets';
import { Camera } from './camera';

function denormalizeAngle(angle: number, isOpposite: boolean): number {
  return Math.abs(angle - (isOpposite ? 270 : 90));
}
export class Rocket implements GameObject {
  public x: number = CONFIG.ROCKET.INITIAL_X;

  private initialX: number = CONFIG.ROCKET.INITIAL_X;

  public y: number = CONFIG.ROCKET.INITIAL_Y;

  private initialY: number = CONFIG.ROCKET.INITIAL_Y;

  private initialAngle: number = CONFIG.ROCKET.INITIAL_ANGLE;

  private currentAngle: number = CONFIG.ROCKET.INITIAL_ANGLE;

  private speed: number = CONFIG.ROCKET.INITIAL_SPEED;

  private renderContext: RenderContext;

  private timeSinceStart = 0;

  public width = CONFIG.ROCKET.WIDTH;

  public height = CONFIG.ROCKET.HEIGHT;

  public readonly collidable = true;

  private readonly img: HTMLImageElement;

  public collides = true;

  private oppositeDirection: boolean = false;

  private camera: Camera;

  constructor({
    assetsManager,
    renderContext,
    camera,
  }: {
    renderContext: RenderContext;
    assetsManager: AssetsManager;
    camera: Camera;
  }) {
    this.renderContext = renderContext;
    this.camera = camera;
    this.img = assetsManager.register(rocketImageSrc);
  }

  update(collisions: Collision[]) {
    // Calculating angle of the object force
    this.currentAngle = radiansToDegrees(
      Math.atan(
        (this.speed * sin(this.initialAngle) -
          CONFIG.GRAVITY_FORCE * this.timeSinceStart) /
          (this.speed * cos(this.initialAngle))
      )
    );
    collisions.forEach((collision) => {
      if (collision.type === CollisionType.BOTTOM) {
        this.y += collision.diffY;
        this.initialX = this.x;
        this.initialY = this.y;
        this.initialAngle = !this.oppositeDirection
          ? -this.currentAngle
          : 180 - this.currentAngle;
      }
      if (collision.type === CollisionType.RIGHT) {
        this.initialX = this.x - collision.diffX;
        this.initialY = this.y;
        this.initialAngle = 180 - this.currentAngle;
        this.oppositeDirection = true;
      }

      if (collision.type === CollisionType.LEFT) {
        this.initialX = this.x + collision.diffX;
        this.initialY = this.y;
        this.initialAngle = -this.currentAngle;
        this.oppositeDirection = false;
      }
    });

    if (collisions.length) {
      this.timeSinceStart = 0;
      this.speed *= CONFIG.ROCKET.COLLISION_SPEED_MULTIPLIER;
    }

    this.x =
      this.initialX + this.speed * this.timeSinceStart * cos(this.initialAngle);
    this.y =
      this.initialY +
      this.speed * this.timeSinceStart * sin(this.initialAngle) -
      0.5 * CONFIG.GRAVITY_FORCE * this.timeSinceStart ** 2;

    if (this.speed <= CONFIG.ROCKET.MINIMAL_SPEED) {
      this.speed = 0;
    }
    if (this.speed <= CONFIG.ROCKET.SPEED_TO_FIX_ANGLE) {
      this.currentAngle = 0;
    }

    // assume that we're at 60fps
    this.timeSinceStart += (1 / 60) * CONFIG.ROCKET.SIMULATION_SPEED;
  }

  setPosition(position: { x: number; y: number }) {
    this.initialX = position.x;
    this.initialY = position.y;
    this.x = position.x;
    this.y = position.y;
  }

  render() {
    const canvasContext = this.renderContext.getContext();
    canvasContext.save();
    canvasContext.translate(
      this.camera.getCurrentX(this.x),
      this.camera.getCurrentY(this.y)
    );
    canvasContext.rotate(
      degreesToRadians(
        denormalizeAngle(this.currentAngle, this.oppositeDirection)
      )
    );
    console.log({
      x: this.camera.getCurrentX(this.x),
      y: this.camera.getCurrentY(this.y),
      currentX: this.x,
      currentY: this.y,
    });
    canvasContext.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    canvasContext.strokeRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    canvasContext.restore();
  }
}
