import { GameObject } from '../interfaces/GameObject.ts';
import { RenderContext } from '../core/renderContext.ts';
import { cos, sin } from '../core/math.ts';

type Options = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  context: RenderContext;
};
const G = 9.8;

export class Rocket implements GameObject {
  public x: number;

  private initialX: number;

  public y: number;

  private initialY: number;

  private angle: number;

  private speed: number;

  private context: RenderContext;

  private tickNumber = 0;

  constructor(options: Options) {
    this.x = options.x;
    this.initialX = options.x;
    this.y = options.y;
    this.initialY = options.y;
    this.angle = options.angle;
    this.speed = options.speed;
    this.context = options.context;
  }

  update() {
    const previousX = this.x;
    this.x = this.initialX + this.speed * this.tickNumber * cos(this.angle);
    this.y =
      this.speed * this.tickNumber * sin(this.angle) -
      0.5 * G * this.tickNumber ** 2;
    if (this.y < 0) {
      this.y = 0;
      this.x = previousX;
      this.initialX = previousX;
      this.speed /= 1.5;
      this.tickNumber = 0;
    }
    this.tickNumber += (1 / 60) * 5;
  }

  render() {
    const canvasContext = this.context.getContext();
    canvasContext.beginPath();
    canvasContext.arc(
      this.context.getCurrentX(this.x),
      this.context.getCurrentY(this.y),
      10,
      0,
      2 * Math.PI
    );
    canvasContext.stroke();
  }
}
