import { GameObject } from '../interfaces/GameObject.ts';
import { RenderContext } from '../core/renderContext.ts';
import { cos, degreesToRadians, radiansToDegrees, sin } from '../core/math.ts';
import rocketImageSrc from '../assets/rocket.png';

type Options = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  context: RenderContext;
};
const G = 9.8;
type Vector = {
  x: number;
  y: number;
};
function vectorsAngle(vector1: Vector, vector2: Vector): number {
  if (vector1.x === vector2.x && vector1.y === vector2.y) {
    return 0;
  }
  const result = radiansToDegrees(
    Math.acos(
      (vector1.x * vector2.x + vector1.y * vector2.y) /
        (Math.sqrt(vector1.x ** 2 + vector1.y ** 2) *
          Math.sqrt(vector2.x ** 2 + vector2.y ** 2))
    )
  );
  return Number.isNaN(result) ? 0 : result;
}
export class Rocket implements GameObject {
  public x: number;

  private initialX: number;

  public y: number;

  private initialY: number;

  private initialAngle: number;

  private displayAngle: number;

  private speed: number;

  private context: RenderContext;

  private tickNumber = 0;

  private readonly img: HTMLImageElement;

  constructor(options: Options) {
    this.x = options.x;
    this.initialX = options.x;
    this.y = options.y;
    this.initialY = options.y;
    this.initialAngle = options.angle;
    this.displayAngle = options.angle;
    this.speed = options.speed;
    this.context = options.context;
    this.img = new Image();
    this.img.src = rocketImageSrc;
  }

  update() {
    const previousX = this.x;
    const previousY = this.y;
    this.x =
      this.initialX + this.speed * this.tickNumber * cos(this.initialAngle);
    this.y =
      this.speed * this.tickNumber * sin(this.initialAngle) -
      0.5 * G * this.tickNumber ** 2;
    if (this.y < 0) {
      this.y = 0;
      this.x = previousX;
      this.initialX = previousX;
      this.speed /= 1.5;
      this.tickNumber = 0;
    }
    const timeToGround = (2 * this.speed * sin(this.initialAngle)) / (G * 3);
    this.displayAngle =
      this.initialAngle +
      ((this.tickNumber / timeToGround) * this.initialAngle) / 2;
    // this.displayAngle += vectorsAngle(
    //   { x: previousX, y: previousY },
    //   { x: this.x, y: this.y }
    // );

    this.tickNumber += (1 / 60) * 5;
  }

  render() {
    const canvasContext = this.context.getContext();
    canvasContext.save();
    canvasContext.translate(
      this.context.getCurrentX(this.x),
      this.context.getCurrentY(this.y)
    );
    canvasContext.rotate(degreesToRadians(this.displayAngle));
    canvasContext.drawImage(this.img, 0, 0, 50, 80);
    canvasContext.restore();
  }
}
