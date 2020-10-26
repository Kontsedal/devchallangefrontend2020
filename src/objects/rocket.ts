import { GameObject } from '../interfaces/gameObject';
import { RenderContext } from '../core/renderContext';
import { cos, degreesToRadians, radiansToDegrees, sin } from '../core/math';
import rocketImageSrc from '../assets/rocket.png';
import { Collision, CollisionType } from '../core/collision';

type Options = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  context: RenderContext;
};
const G = 9.8;
function denormalizeAngle(angle: number, isOpposite: boolean): number {
  const result = Math.abs(angle - (isOpposite ? 270 : 90));
  return result;
}
export class Rocket implements GameObject {
  public x: number;

  private initialX: number;

  public y: number;

  private initialY: number;

  private initialAngle: number;

  private currentAngle: number;

  private speed: number;

  private renderContext: RenderContext;

  private tickNumber = 0;

  public width = 40;

  public height = 40;

  public readonly collidable = true;

  private readonly img: HTMLImageElement;

  public collides = true;

  private oppositeDirection: boolean = false;

  constructor(options: Options) {
    this.x = options.x;
    this.initialX = options.x;
    this.y = options.y;
    this.initialY = options.y;
    this.initialAngle = options.angle;
    this.currentAngle = this.initialAngle;
    this.speed = options.speed;
    this.renderContext = options.context;
    this.img = new Image();
    this.img.src = rocketImageSrc;
  }

  update(collisions: Collision[]) {
    // Calculating angle of the object force
    this.currentAngle = radiansToDegrees(
      Math.atan(
        (this.speed * sin(this.initialAngle) - G * this.tickNumber) /
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
      if (collision.type === CollisionType.RIGHT && !this.oppositeDirection) {
        this.initialX = this.x - collision.diffX;
        this.initialY = this.y;
        this.initialAngle = 180 - this.currentAngle;
        this.oppositeDirection = true;
      }

      if (collision.type === CollisionType.LEFT && this.oppositeDirection) {
        this.initialX = this.x + collision.diffX;
        this.initialY = this.y;
        this.initialAngle = -this.currentAngle;
        this.oppositeDirection = false;
      }
    });

    if (collisions.length) {
      this.tickNumber = 0;
      this.speed /= 1.3;
    }

    this.x =
      this.initialX + this.speed * this.tickNumber * cos(this.initialAngle);
    this.y =
      this.initialY +
      this.speed * this.tickNumber * sin(this.initialAngle) -
      0.5 * G * this.tickNumber ** 2;

    if (this.speed <= 2) {
      this.speed = 0;
    }
    // slow normalization of the object angle in the eng of the simulation
    if (this.speed <= 20) {
      this.currentAngle = this.oppositeDirection ? -1 : 1;
    }
    // const timeToGround = (2 * this.speed * sin(this.initialAngle)) / (G * 3);

    // else {
    //   this.currentAngle =
    //     this.initialAngle +
    //     (this.xMultiplier *
    //       ((this.tickNumber / timeToGround) * this.initialAngle)) /
    //       2;
    // }
    this.tickNumber += (1 / 60) * 5;
  }

  render() {
    const canvasContext = this.renderContext.getContext();
    canvasContext.save();
    canvasContext.translate(
      this.renderContext.getCurrentX(this.x),
      this.renderContext.getCurrentY(this.y)
    );
    canvasContext.rotate(
      degreesToRadians(
        denormalizeAngle(this.currentAngle, this.oppositeDirection)
      )
    );
    canvasContext.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    canvasContext.restore();
  }
}
