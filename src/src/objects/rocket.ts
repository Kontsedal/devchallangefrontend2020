import { GameObject } from '../interfaces/GameObject.ts';
import { RenderContext } from '../core/renderContext.ts';
import { cos, degreesToRadians, radiansToDegrees, sin } from '../core/math.ts';
import rocketImageSrc from '../assets/rocket.png';
import { Collision, CollisionType } from '../core/collisionType.ts';

type Options = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  context: RenderContext;
};
const G = 9.8;
function denormalizeAngle(angle, oposite) {
  const result = Math.abs(angle - (oposite ? 270 : 90));
  return result;
}
export class Rocket implements GameObject {
  public x: number;

  private initialX: number;

  public y: number;

  private initialY: number;

  private initialAngle: number;

  private displayAngle: number;

  private speed: number;

  private initialSpeed: number;

  private context: RenderContext;

  private tickNumber = 0;

  private width = 40;

  private height = 40;

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
    this.displayAngle = this.initialAngle;
    this.speed = options.speed;
    this.initialSpeed = options.speed;
    this.context = options.context;
    this.img = new Image();
    this.img.src = rocketImageSrc;
  }

  update(collisions: Collision[]) {
    const testAngle = radiansToDegrees(
      Math.atan(
        (this.speed * sin(this.initialAngle) - G * this.tickNumber) /
          (this.speed * cos(this.initialAngle))
      )
    );
    this.displayAngle = testAngle;
    collisions.forEach((collision) => {
      if (collision.type === CollisionType.BOTTOM) {
        this.y += collision.diffY;
        this.initialX = this.x;
        this.initialY = this.y;
        this.speed /= 1.4;
        this.tickNumber = 0;
        this.initialAngle = !this.oppositeDirection
          ? -this.displayAngle
          : 180 - this.displayAngle;
      }
      if (collision.type === CollisionType.RIGHT && !this.oppositeDirection) {
        this.initialX = this.x - collision.diffX;
        this.initialY = this.y;
        this.speed /= 1.2;
        this.initialAngle = 180 - this.displayAngle;
        this.tickNumber = 0;
        this.oppositeDirection = true;
      }

      if (collision.type === CollisionType.LEFT && this.oppositeDirection) {
        this.initialX = this.x + collision.diffX;
        this.initialY = this.y;
        this.speed /= 1.2;
        this.initialAngle = -this.displayAngle;
        this.tickNumber = 0;
        this.oppositeDirection = false;
      }
    });

    this.x =
      this.initialX + this.speed * this.tickNumber * cos(this.initialAngle);
    this.y =
      this.initialY +
      this.speed * this.tickNumber * sin(this.initialAngle) -
      0.5 * G * this.tickNumber ** 2;

    if (this.speed <= 2) {
      this.speed = 0;
    }
    if (this.speed <= 20) {
      this.displayAngle = Math.floor(
        (this.displayAngle * 50 + this.oppositeDirection ? -90 : 90) / 51
      );
    }
    // const timeToGround = (2 * this.speed * sin(this.initialAngle)) / (G * 3);

    // else {
    //   this.displayAngle =
    //     this.initialAngle +
    //     (this.xMultiplier *
    //       ((this.tickNumber / timeToGround) * this.initialAngle)) /
    //       2;
    // }
    this.tickNumber += (1 / 60) * 5;
  }

  render() {
    const canvasContext = this.context.getContext();
    canvasContext.save();
    canvasContext.translate(
      this.context.getCurrentX(this.x),
      this.context.getCurrentY(this.y)
    );
    canvasContext.rotate(
      degreesToRadians(
        denormalizeAngle(this.displayAngle, this.oppositeDirection)
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
